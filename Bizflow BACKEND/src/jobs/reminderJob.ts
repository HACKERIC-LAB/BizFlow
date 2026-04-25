import cron from 'node-cron';
import { prisma } from '../utils/prisma';
import { sendTextMessage } from '../utils/whatsAppClient';
import { logger } from '../utils/logger';
import { format, subHours } from 'date-fns';

// Run every 5 minutes — check for appointments needing reminders
export function startReminderJob(): void {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const in24hEnd = new Date(in24h.getTime() + 5 * 60 * 1000); // 5-min window
      const in1h = new Date(now.getTime() + 60 * 60 * 1000);
      const in1hEnd = new Date(in1h.getTime() + 5 * 60 * 1000);

      const appointments = await prisma.appointment.findMany({
        where: {
          status: { in: ['SCHEDULED', 'CONFIRMED'] },
          reminderSent: false,
          scheduledAt: {
            gte: in1h,
            lte: in24hEnd,
          },
        },
      });

      for (const appt of appointments) {
        const dateStr = format(appt.scheduledAt, 'PPp');
        const hoursUntil = Math.round((appt.scheduledAt.getTime() - now.getTime()) / 3600000);
        const msg = `Reminder: Hi ${appt.customerName}! You have an appointment in ${hoursUntil} hour(s) at ${dateStr}. Reply STOP to cancel.`;

        await sendTextMessage(appt.customerPhone, msg);
        await prisma.appointment.update({
          where: { id: appt.id },
          data: { reminderSent: true },
        });
        logger.info('Reminder sent', { appointmentId: appt.id });
      }
    } catch (error) {
      logger.error('Reminder job error', error);
    }
  });

  logger.info('📅 Appointment reminder job started (every 5 min)');
}
