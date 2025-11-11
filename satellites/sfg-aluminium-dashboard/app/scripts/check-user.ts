
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    // Find the demo user
    const user = await prisma.user.findUnique({
      where: { email: 'john@doe.com' }
    });

    if (!user) {
      console.log('❌ Demo user not found in database');
      return;
    }

    console.log('✅ Demo user found:');
    console.log('- Email:', user.email);
    console.log('- Name:', user.name);
    console.log('- Role:', user.role);
    console.log('- Created:', user.createdAt);

    // Test password verification
    const passwordMatch = await bcrypt.compare('johndoe123', user.password);
    console.log('- Password verification:', passwordMatch ? '✅ Valid' : '❌ Invalid');

    // Count total users
    const userCount = await prisma.user.count();
    console.log('- Total users in database:', userCount);

  } catch (error) {
    console.error('❌ Error checking user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
