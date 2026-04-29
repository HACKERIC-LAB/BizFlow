import { prisma } from '../utils/prisma';
import bcrypt from 'bcrypt';
import { AppError } from '../middlewares/errorHandler';
import { sendSMS } from '../utils/africasTalking';

const SALT_ROUNDS = 12;

export async function listStaff(businessId: string) {
  return prisma.user.findMany({
    where: { businessId, role: { not: 'OWNER' } },
    select: {
      id: true, name: true, phone: true, email: true,
      role: true, isActive: true, commission: true, createdAt: true,
      schedules: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function getStaffMember(businessId: string, userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, businessId },
    select: {
      id: true, name: true, phone: true, email: true,
      role: true, isActive: true, commission: true, createdAt: true,
      schedules: true,
    },
  });
  if (!user) throw new AppError('Staff member not found', 404);
  return user;
}

export async function createStaff(businessId: string, data: {
  name: string; phone: string; email?: string;
  role: string; commission?: number; password: string;
}) {
  const existing = await prisma.user.findFirst({ where: { phone: data.phone, businessId } });
  if (existing) throw new AppError('A user with this phone already exists', 409);

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      businessId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      passwordHash,
      role: data.role as any,
      commission: data.commission ?? 0,
    },
    select: {
      id: true, name: true, phone: true, role: true,
      isActive: true, commission: true,
    },
  });

  // Send SMS invite
  await sendSMS(data.phone, `You've been added to BizFlow. Login with phone: ${data.phone} and password: ${data.password}`);
  return user;
}

export async function updateStaff(businessId: string, userId: string, data: {
  name?: string; role?: string; commission?: number; isActive?: boolean;
}) {
  const user = await prisma.user.findFirst({ where: { id: userId, businessId } });
  if (!user) throw new AppError('Staff member not found', 404);

  return prisma.user.update({
    where: { id: userId },
    data: { ...data, role: data.role as any },
    select: { id: true, name: true, phone: true, role: true, isActive: true, commission: true },
  });
}

export async function deactivateStaff(businessId: string, userId: string) {
  const user = await prisma.user.findFirst({ where: { id: userId, businessId } });
  if (!user) throw new AppError('Staff member not found', 404);
  if (user.role === 'OWNER') throw new AppError('Cannot deactivate the owner', 403);
  return prisma.user.update({ where: { id: userId }, data: { isActive: false } });
}

export async function resetStaffPassword(businessId: string, userId: string) {
  const user = await prisma.user.findFirst({ where: { id: userId, businessId } });
  if (!user) throw new AppError('Staff member not found', 404);

  const tempPassword = Math.random().toString(36).slice(-8);
  const passwordHash = await bcrypt.hash(tempPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  await sendSMS(user.phone, `BizFlow: Your password has been reset. Temp password: ${tempPassword}`);
  return { message: 'Password reset and sent via SMS' };
}

export async function updateSchedule(
  businessId: string,
  userId: string,
  schedule: { dayOfWeek: number; isOff: boolean; startTime?: string; endTime?: string }[]
) {
  const user = await prisma.user.findFirst({ where: { id: userId, businessId } });
  if (!user) throw new AppError('Staff member not found', 404);

  await prisma.staffSchedule.deleteMany({ where: { userId } });
  return prisma.staffSchedule.createMany({
    data: schedule.map((s) => ({ userId, ...s })),
  });
}

export async function getStaffReport(businessId: string, staffId: string) {
  const user = await prisma.user.findFirst({
    where: { id: staffId, businessId },
    select: { name: true, schedules: true }
  });

  if (!user) throw new AppError('Staff member not found', 404);

  // Get transactions for this staff member (Completed only)
  const transactions = await prisma.transaction.findMany({
    where: { 
      staffId, 
      businessId,
      status: 'COMPLETED'
    },
    include: {
      services: {
        include: { service: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const revenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const customerCount = new Set(transactions.filter(t => t.customerId).map(t => t.customerId)).size;
  
  // Calculate Off Days vs Active Days (for last 30 days)
  let offDaysCount = 0;
  let activeDaysCount = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    const sch = user.schedules.find(s => s.dayOfWeek === dayOfWeek);
    if (sch && sch.isOff) {
      offDaysCount++;
    } else {
      activeDaysCount++;
    }
  }

  // Top Services
  const serviceCounts: Record<string, number> = {};
  transactions.forEach(t => {
    t.services.forEach(ts => {
      serviceCounts[ts.service.name] = (serviceCounts[ts.service.name] || 0) + 1;
    });
  });

  const topServices = Object.entries(serviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Daily Performance (Last 7 days)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyPerformance = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = days[d.getDay()];
    const dayRevenue = transactions
      .filter(t => new Date(t.createdAt).toDateString() === d.toDateString())
      .reduce((sum, t) => sum + t.totalAmount, 0);
    
    return { day: dayName, revenue: dayRevenue };
  });

  return {
    name: user.name,
    period: 'Last 30 Days',
    revenue,
    customerCount,
    offDaysCount,
    activeDaysCount,
    avgServiceTime: 45,
    topServices,
    dailyPerformance
  };
}
