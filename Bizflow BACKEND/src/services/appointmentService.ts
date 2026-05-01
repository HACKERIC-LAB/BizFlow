import { prisma } from '../utils/prisma';
import { AppError } from '../middlewares/errorHandler';
import { sendTextMessage } from '../utils/whatsAppClient';
import { format } from 'date-fns';

export async function listAppointments(
  businessId: string,
  params: { from?: string; to?: string; staffId?: string }
) {
  const where: any = { businessId };
  if (params.from || params.to) {
    where.scheduledAt = {};
    if (params.from) where.scheduledAt.gte = new Date(params.from);
    if (params.to) where.scheduledAt.lte = new Date(params.to);
  }
  if (params.staffId) where.staffId = params.staffId;

  return prisma.appointment.findMany({
    where,
    include: {
      appointmentservice: { include: { service: true } },
      staff: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  });
}

export async function createAppointment(
  businessId: string,
  data: {
    customerName: string;
    customerPhone: string;
    customerId?: string;
    staffId?: string;
    serviceIds: string[];
    scheduledAt: string;
    duration: number;
    notes?: string;
  }
) {
  const appointment = await prisma.appointment.create({
    data: {
      businessId,
      customerId: data.customerId,
      staffId: data.staffId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      scheduledAt: new Date(data.scheduledAt),
      duration: data.duration,
      notes: data.notes,
    },
    include: { appointmentservice: { include: { service: true } } },
  });

  if (data.serviceIds.length > 0) {
    await prisma.appointmentservice.createMany({
      data: data.serviceIds.map((sid) => ({ appointmentId: appointment.id, serviceId: sid })),
    });
  }

  // Send WhatsApp confirmation
  const dateStr = format(new Date(data.scheduledAt), 'PPp');
  await sendTextMessage(
    data.customerPhone,
    `Hi ${data.customerName}! Your appointment at ${dateStr} has been confirmed. Reply STOP to cancel.`
  );

  return appointment;
}

export async function updateAppointment(
  businessId: string,
  appointmentId: string,
  data: { status?: string; scheduledAt?: string; notes?: string; staffId?: string }
) {
  const appt = await prisma.appointment.findFirst({ where: { id: appointmentId, businessId } });
  if (!appt) throw new AppError('Appointment not found', 404);

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      ...data,
      status: data.status as any,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
  });
}

export async function cancelAppointment(businessId: string, appointmentId: string) {
  const appt = await prisma.appointment.findFirst({ where: { id: appointmentId, businessId } });
  if (!appt) throw new AppError('Appointment not found', 404);

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: 'CANCELLED' },
  });

  await sendTextMessage(
    appt.customerPhone,
    `Hi ${appt.customerName}, your appointment has been cancelled. Contact us to reschedule.`
  );

  return updated;
}

export async function sendReminder(businessId: string, appointmentId: string) {
  const appt = await prisma.appointment.findFirst({
    where: { id: appointmentId, businessId },
    include: { appointmentservice: { include: { service: true } } },
  });
  if (!appt) throw new AppError('Appointment not found', 404);

  const dateStr = format(appt.scheduledAt, 'PPp');
  await sendTextMessage(
    appt.customerPhone,
    `Reminder: Hi ${appt.customerName}! You have an appointment tomorrow at ${dateStr}. We look forward to seeing you!`
  );

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { reminderSent: true },
  });

  return { message: 'Reminder sent' };
}

export async function getAvailableSlots(
  businessId: string,
  staffId: string,
  date: string,
  duration: number
) {
  const dateStart = new Date(date);
  dateStart.setHours(0, 0, 0, 0);
  const dateEnd = new Date(date);
  dateEnd.setHours(23, 59, 59, 999);

  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      businessId,
      staffId,
      scheduledAt: { gte: dateStart, lte: dateEnd },
      status: { in: ['SCHEDULED', 'CONFIRMED'] },
    },
    select: { scheduledAt: true, duration: true },
  });

  // Generate 30-min slots from 8am to 6pm
  const slots: string[] = [];
  const slotDate = new Date(date);
  slotDate.setHours(8, 0, 0, 0);
  const endHour = new Date(date);
  endHour.setHours(18, 0, 0, 0);

  while (slotDate < endHour) {
    const slotEnd = new Date(slotDate.getTime() + duration * 60 * 1000);
    const isBooked = bookedAppointments.some((a) => {
      const aEnd = new Date(a.scheduledAt.getTime() + a.duration * 60 * 1000);
      return slotDate < aEnd && slotEnd > a.scheduledAt;
    });

    if (!isBooked) {
      slots.push(slotDate.toISOString());
    }

    slotDate.setMinutes(slotDate.getMinutes() + 30);
  }

  return slots;
}
