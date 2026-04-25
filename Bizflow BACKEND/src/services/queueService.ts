import { prisma } from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';
import { emitQueueUpdate, emitNowServing } from '../utils/socket';

export async function getActiveQueue(businessId: string) {
  return prisma.queueEntry.findMany({
    where: { businessId, status: { in: ['WAITING', 'SERVING'] } },
    include: { services: { include: { service: true } } },
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
  // Get next position
  const maxPos = await prisma.queueEntry.aggregate({
    where: { businessId, status: { in: ['WAITING', 'SERVING'] } },
    _max: { position: true },
  });
  const position = (maxPos._max.position ?? 0) + 1;

  const entry = await prisma.queueEntry.create({
    data: {
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
    await prisma.queueService.createMany({
      data: data.serviceIds.map((sid) => ({ queueEntryId: entry.id, serviceId: sid })),
    });
  }

  const queue = await getActiveQueue(businessId);
  emitQueueUpdate(businessId, queue);
  return entry;
}

export async function startServing(businessId: string, entryId: string) {
  const entry = await prisma.queueEntry.findFirst({ where: { id: entryId, businessId } });
  if (!entry) throw new AppError('Queue entry not found', 404);

  const updated = await prisma.queueEntry.update({
    where: { id: entryId },
    data: { status: 'SERVING', startedAt: new Date() },
    include: { services: { include: { service: true } } },
  });

  const queue = await getActiveQueue(businessId);
  emitQueueUpdate(businessId, queue);
  emitNowServing(businessId, updated);
  return updated;
}

export async function completeServing(businessId: string, entryId: string) {
  const entry = await prisma.queueEntry.findFirst({ where: { id: entryId, businessId } });
  if (!entry) throw new AppError('Queue entry not found', 404);

  const updated = await prisma.queueEntry.update({
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
  const entry = await prisma.queueEntry.findFirst({ where: { id: entryId, businessId } });
  if (!entry) throw new AppError('Queue entry not found', 404);

  const updated = await prisma.queueEntry.update({
    where: { id: entryId },
    data: { status: 'SKIPPED' },
  });

  await reorderQueue(businessId);
  const queue = await getActiveQueue(businessId);
  emitQueueUpdate(businessId, queue);
  return updated;
}

export async function getPositionByPhone(businessId: string, phone: string) {
  const entry = await prisma.queueEntry.findFirst({
    where: { businessId, customerPhone: phone, status: { in: ['WAITING', 'SERVING'] } },
    orderBy: { position: 'asc' },
  });
  if (!entry) return null;
  return { position: entry.position, status: entry.status };
}

async function reorderQueue(businessId: string) {
  const waiting = await prisma.queueEntry.findMany({
    where: { businessId, status: 'WAITING' },
    orderBy: { position: 'asc' },
  });

  await Promise.all(
    waiting.map((entry, idx) =>
      prisma.queueEntry.update({ where: { id: entry.id }, data: { position: idx + 1 } })
    )
  );
}
