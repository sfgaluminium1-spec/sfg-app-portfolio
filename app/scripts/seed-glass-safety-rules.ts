
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Seeding glass weight safety rules...');

  // Create glass weight safety rules
  const safetyRules = [
    {
      minWeight: 0,
      maxWeight: 25,
      minimumStaff: 2,
      recommendedStaff: 2,
      maximumStaff: 2,
      liftingMethod: "Manual",
      equipmentNeeded: ["Safety gloves", "Suction cups"],
      safetyCategory: "Light",
      riskLevel: "Low",
      safetyNotes: "Standard manual handling - 2 person lift with basic safety equipment",
      vehiclesNeeded: 1,
      vehicleType: "Standard Van",
      baseInstallTime: 30,
      timeMultiplier: 1.0
    },
    {
      minWeight: 25.01,
      maxWeight: 50,
      minimumStaff: 3,
      recommendedStaff: 3,
      maximumStaff: 3,
      liftingMethod: "Suction/Manual",
      equipmentNeeded: ["Safety gloves", "Suction cups", "Lifting straps"],
      safetyCategory: "Medium",
      riskLevel: "Medium",
      safetyNotes: "3 person lift with suction equipment recommended for safe handling",
      vehiclesNeeded: 1,
      vehicleType: "Standard Van",
      baseInstallTime: 45,
      timeMultiplier: 1.2
    },
    {
      minWeight: 50.01,
      maxWeight: 100,
      minimumStaff: 4,
      recommendedStaff: 4,
      maximumStaff: 4,
      liftingMethod: "Suction/Manual",
      equipmentNeeded: ["Safety gloves", "Heavy duty suction cups", "Lifting straps", "Back support"],
      safetyCategory: "Heavy",
      riskLevel: "High",
      safetyNotes: "4 person lift - Heavy glass protocol required with enhanced safety measures",
      vehiclesNeeded: 1,
      vehicleType: "Large Van",
      baseInstallTime: 60,
      timeMultiplier: 1.5
    },
    {
      minWeight: 100.01,
      maxWeight: 200,
      minimumStaff: 4,
      recommendedStaff: 4,
      maximumStaff: 6,
      liftingMethod: "Crane Required",
      equipmentNeeded: ["Safety gloves", "Crane rigging", "Safety harnesses", "Communication equipment"],
      safetyCategory: "Very Heavy",
      riskLevel: "High",
      safetyNotes: "Mechanical lifting required - Mobile crane and 4 person team with full safety protocols",
      vehiclesNeeded: 2,
      vehicleType: "Large Van + Crane Vehicle",
      baseInstallTime: 90,
      timeMultiplier: 2.0
    },
    {
      minWeight: 200.01,
      maxWeight: null, // No upper limit
      minimumStaff: 6,
      recommendedStaff: 6,
      maximumStaff: 8,
      liftingMethod: "Crane Required",
      equipmentNeeded: ["Safety gloves", "Heavy crane rigging", "Safety harnesses", "Communication equipment", "Site barriers"],
      safetyCategory: "Critical",
      riskLevel: "Critical",
      safetyNotes: "CRITICAL WEIGHT - Specialist heavy lifting team and equipment required with comprehensive safety planning",
      vehiclesNeeded: 3,
      vehicleType: "Large Van + Heavy Crane + Support Vehicle",
      baseInstallTime: 120,
      timeMultiplier: 3.0
    }
  ];

  for (const rule of safetyRules) {
    await prisma.glassWeightSafetyRule.create({
      data: rule
    });
  }

  console.log(`✅ Created ${safetyRules.length} glass weight safety rules`);

  // Create some surveyor schedule entries for Darren Newbury (Norman)
  const currentDate = new Date();
  const scheduleEntries = [];

  // Create 30 days of schedule entries
  for (let i = 0; i < 30; i++) {
    const scheduleDate = new Date(currentDate);
    scheduleDate.setDate(currentDate.getDate() + i);
    
    // Skip weekends for surveys (typically Monday-Friday)
    if (scheduleDate.getDay() === 0 || scheduleDate.getDay() === 6) {
      continue;
    }

    // Create AM and PM slots
    const timeSlots = ['AM', 'PM'];
    
    for (const timeSlot of timeSlots) {
      scheduleEntries.push({
        surveyorName: 'Darren Newbury',
        scheduleDate,
        timeSlot,
        isAvailable: true,
        isBooked: false,
        notes: `${timeSlot} slot available for surveys`
      });
    }
  }

  for (const entry of scheduleEntries) {
    await prisma.surveyorSchedule.create({
      data: entry
    });
  }

  console.log(`✅ Created ${scheduleEntries.length} surveyor schedule entries for Darren Newbury (Norman)`);

  console.log('🎉 Glass weight safety rules and surveyor schedule seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding glass safety rules:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
