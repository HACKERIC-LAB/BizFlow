import { prisma } from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';
import { initiateStkPush } from '../utils/mpesaDaraja';
import { v4 as uuidv4 } from 'uuid';

function generateReceipt(): string {
  return `BF-${Date.now().toString(36).toUpperCase()}`;
}

export async function recordCashTransaction(
  businessId: string,
  staffId: string,
  data: {
    customerId?: string;
    serviceIds: string[];
    totalAmount: number;
    notes?: string;
  }
) {
  // Validate services belong to this business
  const services = await prisma.service.findMany({
    where: { id: { in: data.serviceIds }, businessId },
  });
  if (services.length !== data.serviceIds.length) {
    throw new AppError('One or more services not found', 404);
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const t = await tx.transaction.create({
      data: {
        businessId,
        customerId: data.customerId,
        staffId,
        paymentMethod: 'CASH',
        status: 'COMPLETED',
        totalAmount: data.totalAmount,
        receiptNumber: generateReceipt(),
        notes: data.notes,
      },
    });

    await tx.transactionService.createMany({
      data: services.map((s) => ({
        transactionId: t.id,
        serviceId: s.id,
        price: s.price,
      })),
    });

    if (data.customerId) {
      await tx.customer.update({
        where: { id: data.customerId },
        data: { totalVisits: { increment: 1 }, lastVisit: new Date() },
      });
    }

    return t;
  });

  return prisma.transaction.findUnique({
    where: { id: transaction.id },
    include: { services: { include: { service: true } }, customer: true },
  });
}

export async function initiateMpesaPayment(
  businessId: string,
  staffId: string,
  data: {
    customerId?: string;
    serviceIds: string[];
    totalAmount: number;
    mpesaPhone: string;
    notes?: string;
  }
) {
  const services = await prisma.service.findMany({
    where: { id: { in: data.serviceIds }, businessId },
  });
  if (services.length !== data.serviceIds.length) {
    throw new AppError('One or more services not found', 404);
  }

  const transaction = await prisma.transaction.create({
    data: {
      businessId,
      customerId: data.customerId,
      staffId,
      paymentMethod: 'MPESA',
      status: 'PENDING',
      totalAmount: data.totalAmount,
      mpesaPhone: data.mpesaPhone,
      receiptNumber: generateReceipt(),
      notes: data.notes,
    },
  });

  await prisma.transactionService.createMany({
    data: services.map((s) => ({
      transactionId: transaction.id,
      serviceId: s.id,
      price: s.price,
    })),
  });

  try {
    const stkResponse = await initiateStkPush({
      phone: data.mpesaPhone,
      amount: data.totalAmount,
      accountRef: transaction.receiptNumber,
      description: 'BizFlow Payment',
    });
    return { transaction, stkResponse };
  } catch (error) {
    // If M-PESA not configured, return pending transaction (dev mode)
    return { transaction, stkResponse: null, devMode: true };
  }
}

export async function listTransactions(
  businessId: string,
  params: { from?: string; to?: string; page?: number; limit?: number }
) {
  const { from, to, page = 1, limit = 50 } = params;
  const skip = (page - 1) * limit;

  const where: any = { businessId };
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to);
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, phone: true } },
        services: { include: { service: { select: { name: true } } } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return { transactions, total, page, limit };
}

export async function getDailySummary(businessId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const transactions = await prisma.transaction.findMany({
    where: {
      businessId,
      status: 'COMPLETED',
      createdAt: { gte: today, lt: tomorrow },
    },
    include: { services: { include: { service: true } } },
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const cashRevenue = transactions
    .filter((t) => t.paymentMethod === 'CASH')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  const mpesaRevenue = transactions
    .filter((t) => t.paymentMethod === 'MPESA')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  // Top services
  const serviceMap = new Map<string, { name: string; count: number; revenue: number }>();
  for (const t of transactions) {
    for (const ts of t.services) {
      const key = ts.serviceId;
      const existing = serviceMap.get(key) || { name: ts.service.name, count: 0, revenue: 0 };
      serviceMap.set(key, {
        name: ts.service.name,
        count: existing.count + 1,
        revenue: existing.revenue + ts.price,
      });
    }
  }

  const topServices = Array.from(serviceMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Queue count
  const queueCount = await prisma.queueEntry.count({
    where: { businessId, status: 'WAITING' },
  });

  // Today's appointments
  const appointmentCount = await prisma.appointment.count({
    where: {
      businessId,
      scheduledAt: { gte: today, lt: tomorrow },
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
    },
  });

  // Unique customers today
  const customerCount = new Set(transactions.map((t) => t.customerId).filter(Boolean)).size;

  return {
    totalRevenue,
    cashRevenue,
    mpesaRevenue,
    transactionCount: transactions.length,
    customerCount,
    queueCount,
    appointmentCount,
    topServices,
  };
}
