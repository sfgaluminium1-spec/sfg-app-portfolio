
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, data } = await request.json();

    // Handle different sync types
    switch (type) {
      case 'timesheets':
        return await syncTimesheets(data, session);
      case 'expenses':
        return await syncExpenses(data, session);
      case 'holidays':
        return await syncHolidays(data, session);
      default:
        return NextResponse.json({ error: 'Invalid sync type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function syncTimesheets(data: any[], session: any) {
  const results = [];
  
  for (const entry of data) {
    try {
      // Validate and process timesheet entry
      const processedEntry = {
        ...entry,
        userId: session.user.id,
        syncedAt: new Date().toISOString(),
      };
      
      // In a real app, save to database
      // await prisma.timesheet.create({ data: processedEntry });
      
      results.push({
        id: entry.id,
        status: 'success',
        message: 'Timesheet synced successfully'
      });
    } catch (error) {
      results.push({
        id: entry.id,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return NextResponse.json({ results });
}

async function syncExpenses(data: any[], session: any) {
  const results = [];
  
  for (const entry of data) {
    try {
      // Validate and process expense entry
      const processedEntry = {
        ...entry,
        userId: session.user.id,
        syncedAt: new Date().toISOString(),
      };
      
      // In a real app, save to database
      // await prisma.expense.create({ data: processedEntry });
      
      results.push({
        id: entry.id,
        status: 'success',
        message: 'Expense synced successfully'
      });
    } catch (error) {
      results.push({
        id: entry.id,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return NextResponse.json({ results });
}

async function syncHolidays(data: any[], session: any) {
  const results = [];
  
  for (const entry of data) {
    try {
      // Validate and process holiday entry
      const processedEntry = {
        ...entry,
        userId: session.user.id,
        syncedAt: new Date().toISOString(),
      };
      
      // In a real app, save to database
      // await prisma.holiday.create({ data: processedEntry });
      
      results.push({
        id: entry.id,
        status: 'success',
        message: 'Holiday request synced successfully'
      });
    } catch (error) {
      results.push({
        id: entry.id,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return NextResponse.json({ results });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const lastSync = url.searchParams.get('lastSync');

    // Return data that needs to be synced to client
    const syncData = {
      timesheets: [],
      expenses: [],
      holidays: [],
      employees: [],
    };

    // In a real app, fetch updated data based on lastSync timestamp
    // const updatedData = await prisma[type].findMany({
    //   where: { 
    //     updatedAt: { gt: new Date(lastSync || 0) },
    //     userId: session.user.id 
    //   }
    // });

    return NextResponse.json(syncData);
  } catch (error) {
    console.error('Sync GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
