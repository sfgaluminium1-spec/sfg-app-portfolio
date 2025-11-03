
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPricingIntelligence() {
  console.log('🧠 Seeding SFG PRICE INTELLIGENCE data...');

  try {
    // 1. Create Pricing Models
    const pricingModels = await Promise.all([
      prisma.pricingModel.create({
        data: {
          name: 'AI Windows Pricing Model',
          description: 'Machine learning model for window pricing based on specifications and market data',
          modelType: 'AI_MACHINE_LEARNING',
          category: 'Windows',
          basePrice: 250.00,
          formula: JSON.stringify({
            base: 250,
            factors: {
              size: { multiplier: 1.2, per: 'sqm' },
              glazing: { double: 1.0, triple: 1.4 },
              frame: { upvc: 1.0, aluminium: 1.3 },
              hardware: { standard: 1.0, security: 1.2 }
            }
          }),
          factors: {
            material_cost: 0.35,
            labor_cost: 0.25,
            overhead: 0.15,
            profit_margin: 0.25
          },
          confidence: 0.92
        }
      }),
      prisma.pricingModel.create({
        data: {
          name: 'Curtain Wall Pricing Engine',
          description: 'Advanced pricing model for curtain walling systems',
          modelType: 'HYBRID',
          category: 'Structural',
          basePrice: 450.00,
          formula: JSON.stringify({
            base: 450,
            factors: {
              height: { multiplier: 1.1, per: 'meter' },
              complexity: { simple: 1.0, medium: 1.3, complex: 1.6 },
              glazing_type: { standard: 1.0, performance: 1.4, specialty: 1.8 }
            }
          }),
          factors: {
            material_cost: 0.40,
            engineering: 0.15,
            fabrication: 0.20,
            installation: 0.15,
            profit_margin: 0.10
          },
          confidence: 0.88
        }
      }),
      prisma.pricingModel.create({
        data: {
          name: 'Emergency Repair Pricing',
          description: 'Dynamic pricing for emergency glazing repairs',
          modelType: 'RULE_BASED',
          category: 'Maintenance',
          basePrice: 150.00,
          formula: JSON.stringify({
            base: 150,
            factors: {
              urgency: { standard: 1.0, urgent: 1.5, emergency: 2.0 },
              time_of_day: { business: 1.0, evening: 1.3, night: 1.8 },
              weekend: { weekday: 1.0, weekend: 1.4 }
            }
          }),
          factors: {
            callout_fee: 0.30,
            materials: 0.35,
            labor: 0.25,
            profit_margin: 0.10
          },
          confidence: 0.85
        }
      })
    ]);

    console.log(`✅ Created ${pricingModels.length} pricing models`);

    // 2. Create Market Data
    const marketData = await Promise.all([
      prisma.marketData.create({
        data: {
          dataType: 'COMPETITOR_PRICING',
          source: 'Market Research Q1 2025',
          category: 'Windows',
          product: 'Double Glazed uPVC Window',
          region: 'UK Midlands',
          averagePrice: 280.00,
          minPrice: 220.00,
          maxPrice: 350.00,
          marketTrend: 'RISING',
          confidence: 0.85,
          metadata: {
            sample_size: 45,
            competitors: ['Anglian', 'Everest', 'Safestyle'],
            trend_percentage: 3.2
          }
        }
      }),
      prisma.marketData.create({
        data: {
          dataType: 'MATERIAL_COSTS',
          source: 'Supplier Price Index',
          category: 'Glazing',
          product: 'Low-E Glass',
          region: 'UK',
          averagePrice: 45.50,
          minPrice: 42.00,
          maxPrice: 52.00,
          marketTrend: 'STABLE',
          confidence: 0.95,
          metadata: {
            unit: 'per_sqm',
            suppliers: ['Pilkington', 'Guardian', 'AGC'],
            quality_grade: 'Premium'
          }
        }
      }),
      prisma.marketData.create({
        data: {
          dataType: 'LABOR_RATES',
          source: 'Industry Survey 2025',
          category: 'Installation',
          product: 'Glazing Installation',
          region: 'West Midlands',
          averagePrice: 35.00,
          minPrice: 28.00,
          maxPrice: 45.00,
          marketTrend: 'RISING',
          confidence: 0.78,
          metadata: {
            unit: 'per_hour',
            skill_level: 'Experienced',
            includes_benefits: true
          }
        }
      })
    ]);

    console.log(`✅ Created ${marketData.length} market data entries`);

    // 3. Create Customer Behavior Data
    const customerBehaviors = await Promise.all([
      prisma.customerBehavior.create({
        data: {
          customerName: 'Lodestone Projects',
          behaviorType: 'PRICE_SENSITIVITY',
          category: 'Commercial',
          averageValue: 15000.00,
          priceAcceptance: 0.85,
          negotiationRate: 0.65,
          seasonality: {
            q1: 0.8,
            q2: 1.2,
            q3: 0.9,
            q4: 1.1
          },
          preferences: {
            preferred_products: ['Curtain Walling', 'Commercial Glazing'],
            payment_terms: '30_days',
            volume_discounts: true
          }
        }
      }),
      prisma.customerBehavior.create({
        data: {
          customerName: 'True Fix Solution',
          behaviorType: 'BUYING_PATTERNS',
          category: 'Emergency Services',
          averageValue: 2500.00,
          priceAcceptance: 0.95,
          negotiationRate: 0.25,
          seasonality: {
            winter: 1.4,
            spring: 0.9,
            summer: 0.8,
            autumn: 1.1
          },
          preferences: {
            preferred_products: ['Emergency Repairs', 'Glass Replacement'],
            response_time: 'immediate',
            premium_service: true
          }
        }
      })
    ]);

    console.log(`✅ Created ${customerBehaviors.length} customer behavior profiles`);

    // 4. Create Competitor Pricing Data
    const competitorPricing = await Promise.all([
      prisma.competitorPricing.create({
        data: {
          competitor: 'Anglian Windows',
          product: 'uPVC Double Glazed Window',
          category: 'Windows',
          price: 295.00,
          source: 'Public Quote Analysis',
          region: 'Midlands',
          specifications: {
            size: '1200x1000mm',
            glazing: 'Double',
            frame: 'uPVC White',
            hardware: 'Standard'
          },
          confidence: 0.80
        }
      }),
      prisma.competitorPricing.create({
        data: {
          competitor: 'Kawneer',
          product: 'Curtain Walling System',
          category: 'Structural',
          price: 485.00,
          source: 'Industry Report',
          region: 'UK',
          specifications: {
            system: 'AA100',
            glazing: 'Performance',
            finish: 'Polyester Powder Coat'
          },
          confidence: 0.75
        }
      })
    ]);

    console.log(`✅ Created ${competitorPricing.length} competitor pricing entries`);

    // 5. Create Pricing Rules
    const pricingRules = await Promise.all([
      prisma.pricingRule.create({
        data: {
          name: 'Volume Discount Rule',
          description: 'Apply volume discounts for large orders',
          ruleType: 'VOLUME_PRICING',
          category: 'All',
          conditions: {
            min_quantity: 10,
            min_value: 5000
          },
          actions: {
            discount_percentage: 8,
            max_discount: 15
          },
          priority: 1
        }
      }),
      prisma.pricingRule.create({
        data: {
          name: 'Emergency Callout Premium',
          description: 'Apply premium pricing for emergency callouts',
          ruleType: 'CUSTOMER_SPECIFIC',
          category: 'Maintenance',
          conditions: {
            service_type: 'emergency',
            time_constraint: 'immediate'
          },
          actions: {
            markup_percentage: 50,
            minimum_charge: 200
          },
          priority: 2
        }
      }),
      prisma.pricingRule.create({
        data: {
          name: 'Minimum Price Protection',
          description: 'Ensure minimum profit margins are maintained',
          ruleType: 'MINIMUM_PRICE',
          category: 'All',
          conditions: {
            margin_threshold: 0.15
          },
          actions: {
            minimum_margin: 0.20,
            override_required: true
          },
          priority: 3
        }
      })
    ]);

    console.log(`✅ Created ${pricingRules.length} pricing rules`);

    // 6. Create Sample Pricing Analytics
    const analyticsData = await Promise.all([
      prisma.pricingAnalytics.create({
        data: {
          analyticsType: 'PRICING_PERFORMANCE',
          period: 'MONTHLY',
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-31'),
          totalQuotes: 45,
          totalValue: 125000.00,
          averageValue: 2777.78,
          winRate: 0.67,
          marginAnalysis: {
            average_margin: 0.22,
            best_margin: 0.35,
            worst_margin: 0.12,
            margin_trend: 'improving'
          },
          trendData: {
            weekly_quotes: [8, 12, 15, 10],
            weekly_values: [22000, 35000, 42000, 26000],
            category_breakdown: {
              windows: 0.40,
              doors: 0.25,
              structural: 0.35
            }
          },
          category: 'Overall'
        }
      }),
      prisma.pricingAnalytics.create({
        data: {
          analyticsType: 'MARKET_ANALYSIS',
          period: 'QUARTERLY',
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-03-31'),
          totalQuotes: 135,
          totalValue: 385000.00,
          averageValue: 2851.85,
          winRate: 0.71,
          marginAnalysis: {
            market_position: 'competitive',
            price_advantage: 0.08,
            market_share_estimate: 0.12
          },
          trendData: {
            market_growth: 0.05,
            competitive_pressure: 'moderate',
            pricing_opportunities: ['emergency_services', 'premium_glazing']
          },
          category: 'Market Intelligence'
        }
      })
    ]);

    console.log(`✅ Created ${analyticsData.length} analytics entries`);

    console.log('🎉 SFG PRICE INTELLIGENCE seed data completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding pricing intelligence data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedPricingIntelligence()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedPricingIntelligence };
