import { prisma } from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';

export async function listCustomers(
  businessId: string,
  params: { search?: string; page?: number; limit?: number }
) {
  const { search = '', page = 1, limit = 20 } = params;
  const skip = (page - 1) * limit;

  const where = {
    businessId,
    isActive: true,
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.customer.count({ where }),
  ]);

  return { customers, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getCustomer(businessId: string, customerId: string) {
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, businessId, isActive: true },
    include: {
      transactions: {
        include: { services: { include: { service: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });
  if (!customer) throw new AppError('Customer not found', 404);
  return customer;
}

export async function createCustomer(
  businessId: string,
  data: { name: string; phone: string; email?: string; notes?: string }
) {
  const existing = await prisma.customer.findFirst({ where: { phone: data.phone, businessId, isActive: true } });
  if (existing) throw new AppError('Customer with this phone already exists', 409);

  return prisma.customer.create({ data: { businessId, ...data } });
}

export async function updateCustomer(
  businessId: string,
  customerId: string,
  data: { name?: string; phone?: string; email?: string; notes?: string }
) {
  const customer = await prisma.customer.findFirst({ where: { id: customerId, businessId, isActive: true } });
  if (!customer) throw new AppError('Customer not found', 404);
  return prisma.customer.update({ where: { id: customerId }, data });
}

export async function deleteCustomer(businessId: string, customerId: string) {
  const customer = await prisma.customer.findFirst({ where: { id: customerId, businessId, isActive: true } });
  if (!customer) throw new AppError('Customer not found', 404);
  
  // Perform soft delete
  return prisma.customer.update({ 
    where: { id: customerId },
    data: { isActive: false }
  });
}
