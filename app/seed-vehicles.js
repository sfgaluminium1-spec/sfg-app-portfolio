
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedVehiclesAndTeams() {
  try {
    console.log('🚀 Starting vehicle and team seeding...');

    // Create 5 vehicles (4 installation vans + 1 surveyor vehicle)
    const vehicles = [
      {
        vanNumber: 'VAN-001',
        registration: 'SFG 001',
        model: 'Ford Transit Custom',
        capacity: 'Large',
        vehicleType: 'INSTALLATION_VAN',
        equipment: ['Glass Handling Equipment', 'Power Tools', 'Measuring Tools', 'Safety Equipment']
      },
      {
        vanNumber: 'VAN-002',
        registration: 'SFG 002',
        model: 'Ford Transit Custom',
        capacity: 'Large',
        vehicleType: 'INSTALLATION_VAN',
        equipment: ['Glass Handling Equipment', 'Power Tools', 'Measuring Tools', 'Safety Equipment']
      },
      {
        vanNumber: 'VAN-003',
        registration: 'SFG 003',
        model: 'Ford Transit',
        capacity: 'Medium',
        vehicleType: 'INSTALLATION_VAN',
        equipment: ['Glass Handling Equipment', 'Basic Tools', 'Measuring Tools', 'Safety Equipment']
      },
      {
        vanNumber: 'VAN-004',
        registration: 'SFG 004',
        model: 'Ford Transit',
        capacity: 'Medium',
        vehicleType: 'INSTALLATION_VAN',
        equipment: ['Glass Handling Equipment', 'Basic Tools', 'Measuring Tools', 'Safety Equipment']
      },
      {
        vanNumber: 'SURVEY-001',
        registration: 'SFG 100',
        model: 'Ford Focus Estate',
        capacity: 'Small',
        vehicleType: 'SURVEYOR_VEHICLE',
        equipment: ['Measuring Equipment', 'Laptop', 'Camera', 'Drawing Tools', 'Safety Equipment']
      }
    ];

    // Clear existing vehicles and teams
    await prisma.jobSchedule.deleteMany();
    await prisma.team.deleteMany();
    await prisma.van.deleteMany();

    // Create vehicles
    const createdVehicles = [];
    for (const vehicle of vehicles) {
      const created = await prisma.van.create({
        data: vehicle
      });
      createdVehicles.push(created);
      console.log(`✅ Created vehicle: ${vehicle.vanNumber}`);
    }

    // Create teams for installation vans
    const installationVans = createdVehicles.filter(v => v.vehicleType === 'INSTALLATION_VAN');
    const teams = [
      {
        teamName: 'Alpha Team',
        teamLeader: 'John Smith',
        members: ['John Smith', 'Mike Johnson', 'Sarah Wilson'],
        skills: ['Curtain Walling', 'Glazing', 'Structural Glazing'],
        vanId: installationVans[0].id
      },
      {
        teamName: 'Beta Team',
        teamLeader: 'David Brown',
        members: ['David Brown', 'Tom Davis', 'Lisa Anderson'],
        skills: ['Windows', 'Doors', 'Shopfronts'],
        vanId: installationVans[1].id
      },
      {
        teamName: 'Gamma Team',
        teamLeader: 'Chris Taylor',
        members: ['Chris Taylor', 'Mark Wilson', 'Emma Thompson'],
        skills: ['Curtain Walling', 'Structural Glazing', 'Repairs'],
        vanId: installationVans[2].id
      },
      {
        teamName: 'Delta Team',
        teamLeader: 'Paul Martinez',
        members: ['Paul Martinez', 'James Garcia', 'Rachel Lee'],
        skills: ['Windows', 'Doors', 'Glazing', 'Maintenance'],
        vanId: installationVans[3].id
      }
    ];

    // Create surveyor team
    const surveyorVehicle = createdVehicles.find(v => v.vehicleType === 'SURVEYOR_VEHICLE');
    const surveyorTeam = {
      teamName: 'Survey Team',
      teamLeader: 'Alex Thompson',
      members: ['Alex Thompson', 'Sophie Clarke'],
      skills: ['Site Survey', 'Measurements', 'Technical Drawing', 'Client Consultation'],
      vanId: surveyorVehicle.id
    };

    // Create all teams
    const allTeams = [...teams, surveyorTeam];
    for (const team of allTeams) {
      const created = await prisma.team.create({
        data: team
      });
      console.log(`✅ Created team: ${team.teamName} with ${team.teamLeader}`);
    }

    console.log('🎉 Vehicle and team seeding completed successfully!');
    console.log(`📊 Created ${createdVehicles.length} vehicles and ${allTeams.length} teams`);

  } catch (error) {
    console.error('❌ Error seeding vehicles and teams:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedVehiclesAndTeams()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
