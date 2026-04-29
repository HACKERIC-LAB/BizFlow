import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up mock data...');
  
  const deleted = await prisma.transaction.deleteMany({
    where: { 
      receiptNumber: { startsWith: 'MOCK-' } 
    }
  });

  console.log(`Successfully removed ${deleted.count} mock transactions.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
