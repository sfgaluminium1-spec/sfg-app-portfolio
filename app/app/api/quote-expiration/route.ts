
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QuoteExpirationRequest {
  quoteId?: string;
  action?: 'check' | 'expire' | 'revert' | 'extend';
  newExpiryDate?: string;
  force?: boolean;
}

// Quote Expiration Logic
async function processQuoteExpiration() {
  const now = new Date();
  
  // Find quotes that should be expired (90 days from quoted date)
  const quotesToExpire = await prisma.quote.findMany({
    where: {
      status: 'SENT',
      quotedDate: {
        lte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
      },
      isExpired: false
    },
    include: {
      expirationTracking: true
    }
  });

  // Find ON_HOLD quotes that should be reverted (90 days from on hold date)
  const quotesToRevert = await prisma.quote.findMany({
    where: {
      status: 'ON_HOLD' as any,
      onHoldDate: {
        lte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
      },
      isExpired: false
    },
    include: {
      expirationTracking: true
    }
  });

  const results = {
    expired: [] as any[],
    reverted: [] as any[],
    errors: [] as any[]
  };

  // Process expired quotes
  for (const quote of quotesToExpire) {
    try {
      // Update quote to EXPIRED status
      await prisma.quote.update({
        where: { id: quote.id },
        data: {
          status: 'EXPIRED',
          isExpired: true,
          autoExpired: true,
          lastStatusChange: now,
          expiryDate: new Date(quote.quotedDate!.getTime() + 90 * 24 * 60 * 60 * 1000)
        }
      });

      // Create or update expiration tracking
      const trackingData = {
        originalStatus: quote.status as any,
        expirationDate: new Date(quote.quotedDate!.getTime() + 90 * 24 * 60 * 60 * 1000),
        wasAutoExpired: true,
        expiredAt: now,
        statusChanges: [
          ...(quote.expirationTracking?.statusChanges as any[] || []),
          {
            fromStatus: quote.status,
            toStatus: 'EXPIRED',
            changedAt: now.toISOString(),
            reason: 'Auto-expired after 90 days',
            automated: true
          }
        ]
      };

      if (quote.expirationTracking) {
        await prisma.quoteExpirationTracking.update({
          where: { quoteId: quote.id },
          data: trackingData
        });
      } else {
        await prisma.quoteExpirationTracking.create({
          data: {
            quoteId: quote.id,
            ...trackingData
          }
        });
      }

      // Log activity
      await prisma.activity.create({
        data: {
          type: 'QUOTE_UPDATED' as any,
          description: `Quote automatically expired after 90 days (was ${quote.status})`,
          user: 'System',
          quoteId: quote.id,
          metadata: {
            action: 'auto_expire',
            originalStatus: quote.status,
            quotedDate: quote.quotedDate,
            expiredAt: now
          }
        }
      });

      results.expired.push({
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        customerName: quote.customerName,
        value: quote.value,
        originalStatus: quote.status,
        quotedDate: quote.quotedDate,
        expiredAt: now
      });

    } catch (error) {
      results.errors.push({
        quoteId: quote.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Process quotes to revert from ON_HOLD
  for (const quote of quotesToRevert) {
    try {
      // Update quote back to SENT status
      await prisma.quote.update({
        where: { id: quote.id },
        data: {
          status: 'SENT',
          lastStatusChange: now,
          onHoldExpiry: new Date(quote.onHoldDate!.getTime() + 90 * 24 * 60 * 60 * 1000)
        }
      });

      // Update expiration tracking
      const trackingData = {
        wasOnHold: true,
        onHoldStartDate: quote.onHoldDate,
        onHoldEndDate: now,
        autoRevertDate: new Date(quote.onHoldDate!.getTime() + 90 * 24 * 60 * 60 * 1000),
        wasAutoReverted: true,
        statusChanges: [
          ...(quote.expirationTracking?.statusChanges as any[] || []),
          {
            fromStatus: 'ON_HOLD',
            toStatus: 'SENT',
            changedAt: now.toISOString(),
            reason: 'Auto-reverted from ON_HOLD after 90 days',
            automated: true
          }
        ]
      };

      if (quote.expirationTracking) {
        await prisma.quoteExpirationTracking.update({
          where: { quoteId: quote.id },
          data: trackingData
        });
      } else {
        await prisma.quoteExpirationTracking.create({
          data: {
            quoteId: quote.id,
            originalStatus: 'ON_HOLD' as any,
            expirationDate: new Date(quote.quotedDate?.getTime() || now.getTime() + 90 * 24 * 60 * 60 * 1000),
            ...trackingData
          }
        });
      }

      // Log activity
      await prisma.activity.create({
        data: {
          type: 'QUOTE_UPDATED' as any,
          description: `Quote automatically reverted from ON_HOLD to SENT after 90 days`,
          user: 'System',
          quoteId: quote.id,
          metadata: {
            action: 'auto_revert',
            onHoldDate: quote.onHoldDate,
            revertedAt: now
          }
        }
      });

      results.reverted.push({
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        customerName: quote.customerName,
        value: quote.value,
        onHoldDate: quote.onHoldDate,
        revertedAt: now
      });

    } catch (error) {
      results.errors.push({
        quoteId: quote.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, action = 'check', newExpiryDate, force = false } = body as QuoteExpirationRequest;

    if (action === 'expire' && quoteId) {
      // Manually expire a specific quote
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: { expirationTracking: true }
      });

      if (!quote) {
        return NextResponse.json(
          { success: false, message: 'Quote not found' },
          { status: 404 }
        );
      }

      const now = new Date();
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: 'EXPIRED',
          isExpired: true,
          autoExpired: !force,
          lastStatusChange: now,
          expiryDate: newExpiryDate ? new Date(newExpiryDate) : new Date()
        }
      });

      // Update tracking
      const trackingData = {
        originalStatus: quote.status as any,
        expirationDate: newExpiryDate ? new Date(newExpiryDate) : new Date(),
        wasAutoExpired: !force,
        expiredAt: now,
        statusChanges: [
          ...(quote.expirationTracking?.statusChanges as any[] || []),
          {
            fromStatus: quote.status,
            toStatus: 'EXPIRED',
            changedAt: now.toISOString(),
            reason: force ? 'Manually expired' : 'Expired due to time limit',
            automated: !force
          }
        ]
      };

      if (quote.expirationTracking) {
        await prisma.quoteExpirationTracking.update({
          where: { quoteId },
          data: trackingData
        });
      } else {
        await prisma.quoteExpirationTracking.create({
          data: {
            quoteId,
            ...trackingData
          }
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Quote expired successfully',
        quote: { id: quoteId, status: 'EXPIRED' }
      });

    } else if (action === 'extend' && quoteId && newExpiryDate) {
      // Extend quote expiry date
      await prisma.quote.update({
        where: { id: quoteId },
        data: {
          expiryDate: new Date(newExpiryDate),
          lastStatusChange: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Quote expiry date extended successfully'
      });

    } else {
      // Run automated expiration process
      const results = await processQuoteExpiration();

      return NextResponse.json({
        success: true,
        message: 'Quote expiration process completed',
        results: {
          expiredCount: results.expired.length,
          revertedCount: results.reverted.length,
          errorCount: results.errors.length,
          expired: results.expired,
          reverted: results.reverted,
          errors: results.errors
        }
      });
    }

  } catch (error) {
    console.error('Quote Expiration Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process quote expiration',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('quoteId');

    if (quoteId) {
      // Get expiration status for specific quote
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: {
          expirationTracking: true
        }
      });

      if (!quote) {
        return NextResponse.json(
          { success: false, message: 'Quote not found' },
          { status: 404 }
        );
      }

      const now = new Date();
      const quotedDate = quote.quotedDate || quote.createdAt;
      const daysSinceQuoted = Math.floor((now.getTime() - quotedDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysUntilExpiry = 90 - daysSinceQuoted;
      
      return NextResponse.json({
        success: true,
        quote: {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          status: quote.status,
          isExpired: quote.isExpired,
          quotedDate,
          daysSinceQuoted,
          daysUntilExpiry,
          expiryDate: quote.expiryDate,
          tracking: quote.expirationTracking
        }
      });

    } else {
      // Get overview of expiration status
      const now = new Date();
      const expiringWindow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      const expiringSoon = await prisma.quote.count({
        where: {
          status: 'SENT',
          quotedDate: {
            lte: new Date(now.getTime() - 83 * 24 * 60 * 60 * 1000) // 83 days ago (7 days before expiry)
          },
          isExpired: false
        }
      });

      const needsExpiration = await prisma.quote.count({
        where: {
          status: 'SENT',
          quotedDate: {
            lte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
          },
          isExpired: false
        }
      });

      const needsReversion = await prisma.quote.count({
        where: {
          status: 'ON_HOLD' as any,
          onHoldDate: {
            lte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
          },
          isExpired: false
        }
      });

      return NextResponse.json({
        success: true,
        overview: {
          expiringSoon,
          needsExpiration,
          needsReversion,
          lastChecked: now
        }
      });
    }

  } catch (error) {
    console.error('Quote Expiration Check Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check quote expiration',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
