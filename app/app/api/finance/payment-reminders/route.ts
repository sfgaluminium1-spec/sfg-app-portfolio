
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const sent = searchParams.get('sent');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.reminderType = type;
    }

    if (sent !== null) {
      where.sent = sent === 'true';
    }

    const [reminders, total] = await Promise.all([
      prisma.paymentReminder.findMany({
        where,
        include: {
          invoice: {
            include: {
              customer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  company: true,
                  email: true,
                  phone: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.paymentReminder.count({ where })
    ]);

    return NextResponse.json({
      reminders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching payment reminders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment reminders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.action === 'generate_automatic_reminders') {
      // Generate automatic reminders for overdue invoices
      const settings = await prisma.financeSettings.findFirst();
      const firstReminderDays = settings?.firstReminderDays || 60;
      const secondReminderDays = settings?.secondReminderDays || 90;
      const finalReminderDays = settings?.finalReminderDays || 120;

      const now = new Date();
      const firstReminderDate = new Date(now.getTime() - firstReminderDays * 24 * 60 * 60 * 1000);
      const secondReminderDate = new Date(now.getTime() - secondReminderDays * 24 * 60 * 60 * 1000);
      const finalReminderDate = new Date(now.getTime() - finalReminderDays * 24 * 60 * 60 * 1000);

      // Find overdue invoices that need reminders
      const overdueInvoices = await prisma.invoice.findMany({
        where: {
          paymentStatus: {
            in: ['PENDING', 'OVERDUE']
          },
          dueDate: {
            lte: firstReminderDate
          }
        },
        include: {
          customer: true,
          paymentReminders: true
        }
      });

      const reminders = [];

      for (const invoice of overdueInvoices) {
        const daysPastDue = Math.floor((now.getTime() - invoice.dueDate.getTime()) / (24 * 60 * 60 * 1000));
        
        // Check what reminders have already been sent
        const existingReminders = invoice.paymentReminders.map((r: any) => r.reminderType);

        let reminderType: 'FIRST_REMINDER' | 'SECOND_REMINDER' | 'FINAL_REMINDER' | 'CUSTOM' | null = null;
        let subject = '';
        let message = '';

        if (daysPastDue >= finalReminderDays && !existingReminders.includes('FINAL_REMINDER')) {
          reminderType = 'FINAL_REMINDER';
          subject = `FINAL NOTICE: Payment Overdue - Invoice ${invoice.invoiceNumber}`;
          message = `This is a final notice that your payment of £${invoice.totalAmount} for invoice ${invoice.invoiceNumber} is now ${daysPastDue} days overdue. Please contact us immediately to arrange payment.`;
        } else if (daysPastDue >= secondReminderDays && !existingReminders.includes('SECOND_REMINDER')) {
          reminderType = 'SECOND_REMINDER';
          subject = `Second Payment Reminder - Invoice ${invoice.invoiceNumber}`;
          message = `Your payment of £${invoice.totalAmount} for invoice ${invoice.invoiceNumber} is now ${daysPastDue} days overdue. Please arrange payment as soon as possible.`;
        } else if (daysPastDue >= firstReminderDays && !existingReminders.includes('FIRST_REMINDER')) {
          reminderType = 'FIRST_REMINDER';
          subject = `Payment Reminder - Invoice ${invoice.invoiceNumber}`;
          message = `This is a friendly reminder that your payment of £${invoice.totalAmount} for invoice ${invoice.invoiceNumber} is now ${daysPastDue} days overdue.`;
        }

        if (reminderType) {
          const reminder = await prisma.paymentReminder.create({
            data: {
              invoiceId: invoice.id,
              reminderType,
              reminderDate: now,
              daysOverdue: daysPastDue,
              subject,
              message,
              method: invoice.customer.email ? 'EMAIL' : 'PHONE',
              automated: true,
              scheduledFor: now
            }
          });

          reminders.push(reminder);

          // Update invoice status to overdue if not already
          if (invoice.paymentStatus !== 'OVERDUE') {
            await prisma.invoice.update({
              where: { id: invoice.id },
              data: { paymentStatus: 'OVERDUE' }
            });
          }
        }
      }

      return NextResponse.json({
        message: `Generated ${reminders.length} automatic payment reminders`,
        reminders
      });
    }

    // Create individual reminder
    const reminder = await prisma.paymentReminder.create({
      data: {
        invoiceId: data.invoiceId,
        reminderType: data.reminderType,
        reminderDate: new Date(data.reminderDate),
        daysOverdue: data.daysOverdue,
        subject: data.subject,
        message: data.message,
        method: data.method || 'EMAIL',
        automated: data.automated || false,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null
      },
      include: {
        invoice: {
          include: {
            customer: true
          }
        }
      }
    });

    return NextResponse.json(reminder, { status: 201 });

  } catch (error) {
    console.error('Error creating payment reminder:', error);
    return NextResponse.json(
      { error: 'Failed to create payment reminder' },
      { status: 500 }
    );
  }
}
