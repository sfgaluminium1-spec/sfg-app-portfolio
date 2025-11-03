
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSpecData() {
  console.log('🔧 Starting SFG SPEC data seeding...');

  try {
    // Glass Types
    console.log('📋 Creating glass types...');
    const glassTypes = await Promise.all([
      prisma.glassType.create({
        data: {
          name: 'Double Glazed Standard',
          category: 'DOUBLE_GLAZED',
          description: 'Standard double glazed unit with excellent thermal performance',
          thickness: [4, 6, 8],
          uValue: 1.4,
          gValue: 0.63,
          lightTransmission: 78,
          soundReduction: 32,
          isLaminated: false,
          isToughened: false,
          isFireRated: false,
          isSecurityGlass: false,
          isLowE: true,
          securityRating: 'STANDARD',
          standards: ['BS EN 1279', 'BS EN 674'],
          basePrice: 45.00,
          pricePerSqm: 85.00,
          leadTimeWeeks: 2,
          isActive: true
        }
      }),
      prisma.glassType.create({
        data: {
          name: 'Triple Glazed Premium',
          category: 'TRIPLE_GLAZED',
          description: 'Premium triple glazed unit for maximum thermal efficiency',
          thickness: [6, 8, 10],
          uValue: 0.8,
          gValue: 0.55,
          lightTransmission: 72,
          soundReduction: 38,
          isLaminated: false,
          isToughened: false,
          isFireRated: false,
          isSecurityGlass: false,
          isLowE: true,
          securityRating: 'ENHANCED',
          standards: ['BS EN 1279', 'BS EN 674', 'Passivhaus'],
          basePrice: 75.00,
          pricePerSqm: 145.00,
          leadTimeWeeks: 3,
          isActive: true
        }
      }),
      prisma.glassType.create({
        data: {
          name: 'Laminated Security Glass',
          category: 'LAMINATED',
          description: 'Laminated safety glass with enhanced security properties',
          thickness: [6.4, 8.8, 10.8],
          uValue: 1.6,
          gValue: 0.58,
          lightTransmission: 75,
          soundReduction: 35,
          isLaminated: true,
          isToughened: false,
          isFireRated: false,
          isSecurityGlass: true,
          isLowE: false,
          securityRating: 'HIGH_SECURITY',
          standards: ['BS EN 356', 'BS EN 12600'],
          basePrice: 65.00,
          pricePerSqm: 125.00,
          leadTimeWeeks: 2,
          isActive: true
        }
      }),
      prisma.glassType.create({
        data: {
          name: 'Toughened Safety Glass',
          category: 'TOUGHENED',
          description: 'Thermally toughened safety glass for high-risk applications',
          thickness: [6, 8, 10, 12],
          uValue: 1.8,
          gValue: 0.75,
          lightTransmission: 88,
          soundReduction: 28,
          isLaminated: false,
          isToughened: true,
          isFireRated: false,
          isSecurityGlass: false,
          isLowE: false,
          securityRating: 'ENHANCED',
          standards: ['BS EN 12150', 'BS EN 12600'],
          basePrice: 55.00,
          pricePerSqm: 95.00,
          leadTimeWeeks: 2,
          isActive: true
        }
      }),
      prisma.glassType.create({
        data: {
          name: 'Fire Rated Glass',
          category: 'FIRE_RATED',
          description: 'Fire resistant glass for commercial and safety applications',
          thickness: [6, 8, 10],
          uValue: 2.2,
          gValue: 0.45,
          lightTransmission: 65,
          soundReduction: 30,
          isLaminated: true,
          isToughened: false,
          isFireRated: true,
          isSecurityGlass: false,
          isLowE: false,
          securityRating: 'ENHANCED',
          fireRating: 'EI30',
          standards: ['BS EN 1364-1', 'BS EN 13501-2'],
          basePrice: 125.00,
          pricePerSqm: 245.00,
          leadTimeWeeks: 4,
          isActive: true
        }
      }),
      prisma.glassType.create({
        data: {
          name: 'Acoustic Performance Glass',
          category: 'ACOUSTIC',
          description: 'Specialized acoustic glass for noise reduction',
          thickness: [6.8, 8.8, 10.8],
          uValue: 1.5,
          gValue: 0.60,
          lightTransmission: 76,
          soundReduction: 45,
          isLaminated: true,
          isToughened: false,
          isFireRated: false,
          isSecurityGlass: false,
          isLowE: true,
          securityRating: 'STANDARD',
          standards: ['BS EN 20140-3', 'BS EN 717-1'],
          basePrice: 85.00,
          pricePerSqm: 165.00,
          leadTimeWeeks: 3,
          isActive: true
        }
      })
    ]);

    // Security Standards
    console.log('🔒 Creating security standards...');
    const securityStandards = await Promise.all([
      prisma.securityStandard.create({
        data: {
          standardCode: 'PAS24',
          name: 'Enhanced Security Performance',
          description: 'PAS 24:2016 Enhanced security performance requirements for doorsets and windows',
          category: 'RESIDENTIAL',
          requirements: {
            testMethods: ['Static loading', 'Dynamic loading', 'Manual attack'],
            performanceLevels: ['Enhanced security', 'Higher security'],
            certificationRequired: true
          },
          testMethods: ['BS EN 1627', 'BS EN 1628', 'BS EN 1629', 'BS EN 1630'],
          certificationBody: 'BSI',
          securityLevels: {
            'RC2': 'Resistance Class 2',
            'RC3': 'Resistance Class 3'
          },
          minimumRating: 'ENHANCED',
          version: '2016',
          effectiveDate: new Date('2016-07-31'),
          isActive: true
        }
      }),
      prisma.securityStandard.create({
        data: {
          standardCode: 'SBD',
          name: 'Secured by Design',
          description: 'Police preferred specification for security products',
          category: 'RESIDENTIAL',
          requirements: {
            testMethods: ['Physical attack test', 'Tool attack test'],
            performanceLevels: ['SBD approved'],
            certificationRequired: true
          },
          testMethods: ['LPS 1175', 'PAS 24'],
          certificationBody: 'Secured by Design',
          securityLevels: {
            'SBD': 'Secured by Design Approved'
          },
          minimumRating: 'SBD_COMPLIANT',
          version: '2023',
          effectiveDate: new Date('2023-01-01'),
          isActive: true
        }
      }),
      prisma.securityStandard.create({
        data: {
          standardCode: 'BS7950',
          name: 'Enhanced Security Glazing',
          description: 'Code of practice for design of buildings and their approaches to deter crime',
          category: 'COMMERCIAL',
          requirements: {
            testMethods: ['Impact resistance', 'Manual attack resistance'],
            performanceLevels: ['Class P1A', 'Class P2A', 'Class P3A'],
            certificationRequired: false
          },
          testMethods: ['BS EN 356', 'BS EN 1063'],
          certificationBody: 'BSI',
          securityLevels: {
            'P1A': 'Basic manual attack resistance',
            'P2A': 'Enhanced manual attack resistance',
            'P3A': 'High manual attack resistance'
          },
          minimumRating: 'ENHANCED',
          version: '2013',
          effectiveDate: new Date('2013-05-31'),
          isActive: true
        }
      }),
      prisma.securityStandard.create({
        data: {
          standardCode: 'LPS1175',
          name: 'Security Glazing Requirements',
          description: 'Requirements and testing procedures for the LPCB approval of security glazing',
          category: 'COMMERCIAL',
          requirements: {
            testMethods: ['Tool attack test', 'Manual attack test', 'Ballistic test'],
            performanceLevels: ['SR1', 'SR2', 'SR3', 'SR4', 'SR5'],
            certificationRequired: true
          },
          testMethods: ['Manual attack', 'Tool attack', 'Ballistic resistance'],
          certificationBody: 'LPCB',
          securityLevels: {
            'SR1': 'Opportunist attack resistance',
            'SR2': 'Basic tool attack resistance',
            'SR3': 'Intermediate tool attack resistance',
            'SR4': 'Advanced tool attack resistance',
            'SR5': 'High tool attack resistance'
          },
          minimumRating: 'HIGH_SECURITY',
          version: '2010',
          effectiveDate: new Date('2010-09-01'),
          isActive: true
        }
      })
    ]);

    // Finish Options
    console.log('🎨 Creating finish options...');
    const finishOptions = await Promise.all([
      prisma.finishOption.create({
        data: {
          name: 'White UPVC',
          category: 'FRAME_FINISH',
          material: 'UPVC',
          description: 'Standard white UPVC finish with excellent durability',
          colorCode: 'RAL 9016',
          texture: 'Smooth',
          finish: 'Matt',
          durability: '25+ years',
          weatherResistance: 'Excellent',
          uvResistance: 'High',
          maintenanceReq: 'Low - occasional cleaning',
          basePrice: 0.00,
          priceMultiplier: 1.0,
          leadTimeWeeks: 1,
          isStandard: true,
          isActive: true
        }
      }),
      prisma.finishOption.create({
        data: {
          name: 'Anthracite Grey UPVC',
          category: 'FRAME_FINISH',
          material: 'UPVC',
          description: 'Contemporary anthracite grey UPVC finish',
          colorCode: 'RAL 7016',
          texture: 'Smooth',
          finish: 'Matt',
          durability: '25+ years',
          weatherResistance: 'Excellent',
          uvResistance: 'High',
          maintenanceReq: 'Low - occasional cleaning',
          basePrice: 15.00,
          priceMultiplier: 1.15,
          leadTimeWeeks: 2,
          isStandard: true,
          isActive: true
        }
      }),
      prisma.finishOption.create({
        data: {
          name: 'Golden Oak Woodgrain',
          category: 'FRAME_FINISH',
          material: 'UPVC',
          description: 'Realistic golden oak woodgrain effect finish',
          colorCode: 'Woodgrain Effect',
          texture: 'Wood grain',
          finish: 'Textured',
          durability: '20+ years',
          weatherResistance: 'Very Good',
          uvResistance: 'Good',
          maintenanceReq: 'Medium - regular cleaning',
          basePrice: 25.00,
          priceMultiplier: 1.25,
          leadTimeWeeks: 2,
          isStandard: true,
          isActive: true
        }
      }),
      prisma.finishOption.create({
        data: {
          name: 'Mill Finish Aluminium',
          category: 'FRAME_FINISH',
          material: 'ALUMINIUM',
          description: 'Natural mill finish aluminium',
          colorCode: 'Natural',
          texture: 'Smooth',
          finish: 'Satin',
          durability: '30+ years',
          weatherResistance: 'Excellent',
          uvResistance: 'Excellent',
          maintenanceReq: 'Very Low',
          basePrice: 35.00,
          priceMultiplier: 1.4,
          leadTimeWeeks: 3,
          isStandard: true,
          isActive: true
        }
      }),
      prisma.finishOption.create({
        data: {
          name: 'Powder Coated Aluminium',
          category: 'FRAME_FINISH',
          material: 'ALUMINIUM',
          description: 'Powder coated aluminium in various RAL colors',
          colorCode: 'RAL Colors',
          texture: 'Smooth',
          finish: 'Matt/Gloss',
          durability: '25+ years',
          weatherResistance: 'Excellent',
          uvResistance: 'Excellent',
          maintenanceReq: 'Low',
          basePrice: 45.00,
          priceMultiplier: 1.5,
          leadTimeWeeks: 4,
          isStandard: false,
          isActive: true
        }
      }),
      prisma.finishOption.create({
        data: {
          name: 'Black Glazing Bead',
          category: 'GLAZING_BEAD',
          material: 'UPVC',
          description: 'Black glazing bead for contemporary appearance',
          colorCode: 'RAL 9005',
          texture: 'Smooth',
          finish: 'Matt',
          durability: '20+ years',
          weatherResistance: 'Good',
          uvResistance: 'Medium',
          maintenanceReq: 'Low',
          basePrice: 5.00,
          priceMultiplier: 1.05,
          leadTimeWeeks: 1,
          isStandard: true,
          isActive: true
        }
      })
    ]);

    // Glass Finish Options (compatibility matrix)
    console.log('🔗 Creating glass-finish compatibility...');
    for (const glassType of glassTypes) {
      for (const finishOption of finishOptions.slice(0, 4)) { // Only frame finishes
        await prisma.glassFinishOption.create({
          data: {
            glassTypeId: glassType.id,
            finishOptionId: finishOption.id,
            isCompatible: true,
            priceAdjustment: 0.0,
            notes: 'Standard compatibility'
          }
        });
      }
    }

    // Specification Templates
    console.log('📋 Creating specification templates...');
    const templates = await Promise.all([
      prisma.specificationTemplate.create({
        data: {
          name: 'Residential Standard',
          category: 'Residential',
          description: 'Standard residential window specification template',
          defaultGlassType: glassTypes[0].id,
          defaultFinish: finishOptions[0].id,
          securityRequirements: {
            minimumSecurity: 'STANDARD',
            standards: ['PAS24']
          },
          performanceTargets: {
            maxUValue: 1.6,
            minLightTransmission: 70,
            minSoundReduction: 30
          },
          validationRules: {
            requiresDimensions: true,
            requiresPerformance: false,
            requiresSecurity: false
          },
          requiredFields: ['glassType', 'thickness', 'dimensions'],
          isActive: true
        }
      }),
      prisma.specificationTemplate.create({
        data: {
          name: 'Commercial Security',
          category: 'Commercial',
          description: 'High-security commercial specification template',
          defaultGlassType: glassTypes[2].id, // Laminated security glass
          defaultFinish: finishOptions[3].id, // Aluminium
          securityRequirements: {
            minimumSecurity: 'HIGH_SECURITY',
            standards: ['LPS1175', 'BS7950']
          },
          performanceTargets: {
            maxUValue: 2.0,
            minLightTransmission: 60,
            minSoundReduction: 35
          },
          validationRules: {
            requiresDimensions: true,
            requiresPerformance: true,
            requiresSecurity: true
          },
          requiredFields: ['glassType', 'thickness', 'dimensions', 'securityRating', 'securityStandards'],
          isActive: true
        }
      }),
      prisma.specificationTemplate.create({
        data: {
          name: 'Acoustic Performance',
          category: 'Acoustic',
          description: 'Specialized acoustic performance specification template',
          defaultGlassType: glassTypes[5].id, // Acoustic glass
          defaultFinish: finishOptions[1].id,
          securityRequirements: {
            minimumSecurity: 'STANDARD'
          },
          performanceTargets: {
            maxUValue: 1.8,
            minLightTransmission: 70,
            minSoundReduction: 40
          },
          validationRules: {
            requiresDimensions: true,
            requiresPerformance: true,
            requiresSecurity: false
          },
          requiredFields: ['glassType', 'thickness', 'dimensions', 'acousticRequirement'],
          isActive: true
        }
      })
    ]);

    // Sample Specifications
    console.log('📝 Creating sample specifications...');
    const customers = await prisma.customer.findMany({ take: 5 });
    const quotes = await prisma.quote.findMany({ take: 3 });

    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length];
      const quote = i < 3 ? quotes[i] : null;
      const glassType = glassTypes[i % glassTypes.length];
      const template = templates[i % templates.length];
      const finishOption = finishOptions[i % finishOptions.length];

      const width = 1200 + (i * 100);
      const height = 1500 + (i * 50);
      const area = (width * height) / 1000000; // Convert to m²

      const specification = await prisma.glassSpecification.create({
        data: {
          specificationNumber: `SPEC-${Date.now()}-${String(i + 1).padStart(3, '0')}`,
          name: `${customer?.firstName || 'Sample'} ${glassType.name} Specification`,
          description: `Specification for ${glassType.name} with ${finishOption.name} finish`,
          glassTypeId: glassType.id,
          thickness: glassType.thickness[0],
          finishOptionId: finishOption.id,
          width: width,
          height: height,
          area: area,
          quantity: 1 + (i % 3),
          targetUValue: glassType.uValue ? glassType.uValue + 0.1 : null,
          targetGValue: glassType.gValue ? glassType.gValue - 0.05 : null,
          acousticRequirement: glassType.soundReduction ? glassType.soundReduction - 2 : null,
          securityRating: glassType.securityRating,
          specialRequirements: i % 4 === 0 ? 'Special handling required for large dimensions' : null,
          complianceStatus: ['PENDING', 'COMPLIANT', 'NON_COMPLIANT'][i % 3],
          templateId: template.id,
          unitPrice: glassType.pricePerSqm ? glassType.pricePerSqm * area : null,
          totalPrice: glassType.pricePerSqm ? glassType.pricePerSqm * area * (1 + (i % 3)) : null,
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          isValidated: i % 2 === 0,
          validatedBy: i % 2 === 0 ? 'System Admin' : null,
          validatedAt: i % 2 === 0 ? new Date() : null,
          customerId: customer?.id,
          quoteId: quote?.id
        }
      });

      // Create compliance records for some specifications
      if (i % 2 === 0) {
        const standard = securityStandards[i % securityStandards.length];
        await prisma.securityCompliance.create({
          data: {
            standardId: standard.id,
            specificationId: specification.id,
            status: ['PENDING', 'COMPLIANT', 'NON_COMPLIANT'][i % 3],
            rating: glassType.securityRating,
            checkedBy: 'Compliance Officer',
            checkedAt: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            requirements: {
              testsPassed: ['Manual attack test', 'Tool attack test'],
              certificateRequired: true
            },
            testResults: {
              manualAttack: 'PASS',
              toolAttack: 'PASS',
              overallResult: 'COMPLIANT'
            },
            notes: `Compliance check completed for ${standard.standardCode}`,
            certificateNumber: i % 3 === 1 ? `CERT-${Date.now()}-${i}` : null,
            certificateIssued: i % 3 === 1 ? new Date() : null,
            certificateExpiry: i % 3 === 1 ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null
          }
        });
      }
    }

    console.log('✅ SFG SPEC data seeding completed successfully!');
    console.log(`📊 Created:
    - ${glassTypes.length} glass types
    - ${securityStandards.length} security standards  
    - ${finishOptions.length} finish options
    - ${templates.length} specification templates
    - 15 sample specifications
    - Multiple compliance records`);

  } catch (error) {
    console.error('❌ Error seeding SFG SPEC data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedSpecData()
    .then(() => {
      console.log('🎉 SFG SPEC seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 SFG SPEC seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSpecData };
