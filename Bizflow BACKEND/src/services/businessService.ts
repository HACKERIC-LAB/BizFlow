import { prisma } from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';

export async function getBusiness(businessId: string) {
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new AppError('Business not found', 404);
  return business;
}

export async function updateBusiness(businessId: string, data: {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  mpesaTill?: string;
}) {
  return prisma.business.update({ where: { id: businessId }, data });
}

export async function getServices(businessId: string) {
  return prisma.service.findMany({
    where: { businessId, isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function bulkUpsertServices(
  businessId: string,
  services: { id?: string; name: string; price: number; duration: number }[]
) {
  const results = await Promise.all(
    services.map((s) => {
      if (s.id) {
        return prisma.service.update({
          where: { id: s.id },
          data: { name: s.name, price: s.price, duration: s.duration },
        });
      }
      return prisma.service.create({
        data: { businessId, name: s.name, price: s.price, duration: s.duration },
      });
    })
  );
  return results;
}

export async function updateService(
  businessId: string,
  serviceId: string,
  data: { name?: string; price?: number; duration?: number }
) {
  const service = await prisma.service.findFirst({ where: { id: serviceId, businessId } });
  if (!service) throw new AppError('Service not found', 404);
  return prisma.service.update({ where: { id: serviceId }, data });
}

export async function deleteService(businessId: string, serviceId: string) {
  const service = await prisma.service.findFirst({ where: { id: serviceId, businessId } });
  if (!service) throw new AppError('Service not found', 404);
  return prisma.service.update({ where: { id: serviceId }, data: { isActive: false } });
}
