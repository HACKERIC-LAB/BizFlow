import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'OWNER' },
      select: {
        phone: true,
        name: true,
        business: {
          select: {
            name: true
          }
        }
      }
    });
    console.log('--- REGISTERED OWNERS ---');
    console.log(JSON.stringify(users, null, 2));
    console.log('-------------------------');
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
