import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ take: 1 });
  console.log('User:', users[0]);
  const businesses = await prisma.business.findMany({ take: 1 });
  console.log('Business:', businesses[0]);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
