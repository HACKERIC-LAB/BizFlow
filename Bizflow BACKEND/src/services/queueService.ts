import { prisma } from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';
import { emitQueueUpdate, emitNowServing } from '../utils/socket';

export async function getActiveQueue(businessId: string) {
  return (prisma.queueentry as any).findMany({
    where: { businessId, status: { in: ['WAITING', 'SERVING'] } },
    include: { 
      services: { include: { service: true } },
      servedBy: { select: { id: true, name: true, phone: true } }
    },
    orderBy: { position: 'asc' },
  });
}

export async function checkIn(
  businessId: string,
  data: {
    customerName: string;
    customerPhone: string;
    customerId?: string;
    serviceIds?: string[];
    notes?: string;
  }
) {
  const entry = await prisma.$transaction(async (tx) => {
    const maxPos = await tx.queueentry.aggregate({
      where: { businessId, status: { in: ['WAITING', 'SERVING'] } },
      _max: { position: true },
    });
    const position = (maxPos._max.position ?? 0) + 1;

    const createdEntry = await tx.queueentry.create({
      data: {
        id: `qe_${Math.random().toString(36).slice(2, 11)}`,
        updatedAt: new Date(),
        businessId,
        customerId: data.customerId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        position,
        notes: data.notes,
      },
      include: { services: { include: { service: true } } },
    });

    if (data.serviceIds && data.serviceIds.length > 0) {
      await tx.queueservice.createMany({
        data: data.serviceIds.map((sid) => ({
          id: `qs_${Math.random().toString(36).slice(2, 11)}`,
          queueEntryId: createdEntry.id,
          serviceId: sid,
        })),
      });
    }
    
    return createdEntry;
  });

  const queue = await getActiveQueue(businessId);
  emitQueueUpdate(businessId, queue);
  return entry;
}

export async function startServing(businessId: string, entryId: string, userId: string) {
  const entry = await prisma.queueentry.findFirst({ where: { id: entryId, businessId } });
  if (!entry) throw new AppError('Queue entry not found', 404);

  const updated = await (prisma.queueentry as any).update({
    where: { id: entryId },
    data: { 
      status: 'SERVING', 
      startedAt: new Date(),
      servedById: userId
    },
    include: { 
      services: { include: { service: true } },
      servedBy: { select: { id: true, name: true, phone: true } }
    },
  });

  const queue = await getActiveQueue(businessId);
  emitQueueUpdate(businessId, queue);
  emitNowServing(businessId, updated);
  return updated;
}

export async function completeServing(businessId: string, entryId: string) {
  const entry = await prisma.queueentry.findFirst({ where: { id: entryId, businessId } });
  if (!entry) throw new AppError('Queue entry not found', 404);

  const updated = await prisma.queueentry.update({
    where: { id: entryId },
    data: { status: 'COMPLETED', completedAt: new Date() },
  });

  // Reorder remaining
  await reorderQueue(businessId);
  const queue = await getActiveQueue(businessId);
  emitQueueUpdate(businessId, queue);
  return updated;
}

export async function skipEntry(businessId: string, entryId: string) {
  const entry = await prisma.queueentry.findFirst({ where: { id: entryId, businessId } });
  if (!entry) throw new AppError('Queue entry not found', 404);

  const updated = await prisma.queueentry.update({
    where: { id: entryId },
    data: { status: 'SKIPPED' },
  });

  await reorderQueue(businessId);
  const queue = await getActiveQueue(businessId);
  emitQueueUpdate(businessId, queue);
  return updated;
}

export async function getPositionByPhone(businessId: string, phone: string) {
  const entry = await prisma.queueentry.findFirst({
    where: { businessId, customerPhone: phone, status: { in: ['WAITING', 'SERVING'] } },
    orderBy: { position: 'asc' },
  });
  if (!entry) return null;
  return { position: entry.position, status: entry.status };
}

async function reorderQueue(businessId: string) {
  await prisma.$transaction(async (tx) => {
    const waiting = await tx.queueentry.findMany({
      where: { businessId, status: 'WAITING' },
      orderBy: { position: 'asc' },
    });

    for (let idx = 0; idx < waiting.length; idx++) {
      await tx.queueentry.update({
        where: { id: waiting[idx].id },
        data: { position: idx + 1 }
      });
    }
  });
}

