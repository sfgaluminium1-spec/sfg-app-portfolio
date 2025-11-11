
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'admin',
    },
  });

  // Create sample financial metrics
  const financialData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    revenue: Math.floor(Math.random() * 50000) + 100000,
    expenses: Math.floor(Math.random() * 30000) + 60000,
    profit: 0,
    efficiency: Math.floor(Math.random() * 20) + 80,
  })).map(item => ({
    ...item,
    profit: item.revenue - item.expenses,
  }));

  await prisma.financialMetric.createMany({
    data: financialData,
    skipDuplicates: true,
  });

  // Create AI model usage data
  const aiModels = ['GPT-4', 'Claude-3', 'Gemini-Pro', 'Custom-LLM'];
  for (const model of aiModels) {
    const usageData = Array.from({ length: 7 }, (_, i) => ({
      modelName: model,
      requests: Math.floor(Math.random() * 1000) + 500,
      success: Math.floor(Math.random() * 950) + 450,
      errors: Math.floor(Math.random() * 50),
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
    }));

    await prisma.aIModelUsage.createMany({
      data: usageData,
      skipDuplicates: true,
    });
  }

  // Create document processing records
  const documentData = Array.from({ length: 20 }, (_, i) => ({
    documentName: `Document_${i + 1}.pdf`,
    status: Math.random() > 0.1 ? 'completed' : 'processing',
    processingTime: Math.random() * 30 + 5,
    fileSize: Math.floor(Math.random() * 10000) + 1000,
  }));

  await prisma.documentProcessing.createMany({
    data: documentData,
    skipDuplicates: true,
  });

  // Create system logs
  const logLevels = ['info', 'warning', 'error'];
  const logMessages = [
    'System started successfully',
    'AI model response time optimized',
    'Database connection established',
    'Document processing completed',
    'API request processed',
    'User authentication successful',
  ];

  const systemLogs = Array.from({ length: 50 }, (_, i) => ({
    level: logLevels[Math.floor(Math.random() * logLevels.length)],
    message: logMessages[Math.floor(Math.random() * logMessages.length)],
    details: Math.random() > 0.5 ? `Additional details for log ${i + 1}` : null,
  }));

  await prisma.systemLog.createMany({
    data: systemLogs,
    skipDuplicates: true,
  });

  // Create configuration entries
  const configs = [
    { key: 'api_rate_limit', value: '1000' },
    { key: 'max_file_size', value: '50MB' },
    { key: 'ai_models_enabled', value: 'true' },
    { key: 'auto_backup', value: 'daily' },
  ];

  for (const config of configs) {
    await prisma.configuration.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
