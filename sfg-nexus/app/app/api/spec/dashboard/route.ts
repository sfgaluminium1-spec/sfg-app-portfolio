
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get specification statistics
    const [
      totalSpecifications,
      pendingValidation,
      compliantSpecs,
      nonCompliantSpecs,
      recentSpecifications,
      glassTypeStats,
      securityComplianceStats,
      finishOptionStats
    ] = await Promise.all([
      // Total specifications
      prisma.glassSpecification.count(),
      
      // Pending validation
      prisma.glassSpecification.count({
        where: { isValidated: false }
      }),
      
      // Compliant specifications
      prisma.glassSpecification.count({
        where: { complianceStatus: 'COMPLIANT' }
      }),
      
      // Non-compliant specifications
      prisma.glassSpecification.count({
        where: { complianceStatus: 'NON_COMPLIANT' }
      }),
      
      // Recent specifications
      prisma.glassSpecification.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          glassType: true,
          finishOption: true
        }
      }),
      
      // Glass type usage statistics
      prisma.glassType.findMany({
        include: {
          _count: {
            select: {
              specifications: true
            }
          }
        },
        orderBy: {
          specifications: {
            _count: 'desc'
          }
        },
        take: 10
      }),
      
      // Security compliance statistics
      prisma.securityCompliance.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
      
      // Finish option usage statistics
      prisma.finishOption.findMany({
        include: {
          _count: {
            select: {
              specifications: true
            }
          }
        },
        orderBy: {
          specifications: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Calculate compliance rate
    const complianceRate = totalSpecifications > 0 
      ? (compliantSpecs / totalSpecifications) * 100 
      : 0;

    // Calculate validation rate
    const validationRate = totalSpecifications > 0 
      ? ((totalSpecifications - pendingValidation) / totalSpecifications) * 100 
      : 0;

    // Get monthly specification trends (simplified for compatibility)
    const monthlyTrends = await prisma.glassSpecification.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 12
    });

    const dashboard = {
      overview: {
        totalSpecifications,
        pendingValidation,
        compliantSpecs,
        nonCompliantSpecs,
        complianceRate: Math.round(complianceRate * 100) / 100,
        validationRate: Math.round(validationRate * 100) / 100
      },
      recentActivity: recentSpecifications,
      glassTypeStats: glassTypeStats.map((type: any) => ({
        name: type.name,
        category: type.category,
        usageCount: type._count.specifications,
        isActive: type.isActive
      })),
      securityCompliance: securityComplianceStats.map((stat: any) => ({
        status: stat.status,
        count: stat._count.status
      })),
      finishOptions: finishOptionStats.map((option: any) => ({
        name: option.name,
        category: option.category,
        material: option.material,
        usageCount: option._count.specifications,
        isActive: option.isActive
      })),
      monthlyTrends
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
