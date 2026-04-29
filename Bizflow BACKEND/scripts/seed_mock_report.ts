import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.findFirst();
  if (!business) {
    console.error('No business found');
    return;
  }

  const staff = await prisma.user.findFirst({
    where: { role: { not: 'OWNER' }, businessId: business.id }
  });

  if (!staff) {
    console.error('No staff member found to add mock data to');
    return;
  }

  const services = await prisma.service.findMany({
    where: { businessId: business.id }
  });

  if (services.length === 0) {
    // Create some default services if none exist
    const defaultServices = [
      { name: 'Classic Haircut', price: 500, duration: 30 },
      { name: 'Beard Trim', price: 300, duration: 20 },
      { name: 'Hair & Beard Combo', price: 700, duration: 45 },
    ];
    for (const s of defaultServices) {
      await prisma.service.create({ data: { ...s, businessId: business.id } });
    }
  }

  const updatedServices = await prisma.service.findMany({ where: { businessId: business.id } });

  console.log(`Adding mock transactions for ${staff.name} at ${business.name}...`);

  for (let i = 0; i < 15; i++) {
    const randomService = updatedServices[Math.floor(Math.random() * updatedServices.length)];
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 20));

    await prisma.transaction.create({
      data: {
        businessId: business.id,
        staffId: staff.id,
        totalAmount: randomService.price,
        paymentMethod: 'CASH',
        status: 'COMPLETED',
        receiptNumber: `MOCK-${Math.random().toString(36).toUpperCase().slice(-8)}`,
        createdAt: randomDate,
        services: {
          create: {
            serviceId: randomService.id,
            price: randomService.price
          }
        }
      }
    });
  }

  console.log('Successfully added 15 mock transactions.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
