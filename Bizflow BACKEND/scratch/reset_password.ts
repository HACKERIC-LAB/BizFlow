import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  try {
    const passwordHash = await bcrypt.hash('123456', SALT_ROUNDS);
    const user = await prisma.user.updateMany({
      where: { phone: '0112394362' },
      data: { passwordHash, isActive: true }
    });
    
    if (user.count > 0) {
      console.log('--- PASSWORD RESET SUCCESSFUL ---');
      console.log('Phone: 0112394362');
      console.log('New Password: 123456');
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
