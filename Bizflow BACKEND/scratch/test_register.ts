import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  const data = {
    businessName: "Test Auto Business",
    businessType: "BARBERSHOP",
    businessPhone: "254700000002",
    fullName: "Test Auto Owner",
    ownerPhone: "254700000002",
    password: "password123",
    services: [
      { name: "Test Service", price: 500, duration: 30 }
    ]
  };

  try {
    console.log('Testing registration for:', data.ownerPhone);
    
    const existingUser = await prisma.user.findFirst({
      where: { phone: data.ownerPhone },
    });
    
    if (existingUser) {
      console.log('User already exists. Deleting to retry...');
      await prisma.user.delete({ where: { id: existingUser.id } });
      // Note: This might fail if there are dependent records, but for a test it's fine.
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const result = await prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: data.businessName,
          type: data.businessType as any,
          phone: data.businessPhone,
        },
      });

      const user = await tx.user.create({
        data: {
          businessId: business.id,
          name: data.fullName,
          phone: data.ownerPhone,
          passwordHash,
          role: 'OWNER',
        },
      });

      if (data.services.length > 0) {
        await tx.service.createMany({
          data: data.services.map((s) => ({
            businessId: business.id,
            name: s.name,
            price: s.price,
            duration: s.duration,
          })),
        });
      }

      return { business, user };
    });

    console.log('Registration SUCCESSFUL:', result.user.id);
  } catch (error) {
    console.error('Registration FAILED:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
