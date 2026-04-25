import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../services/appointmentService';

export async function listAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await appointmentService.listAppointments((req as any).businessId!, req.query as any);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getAvailableSlots(req: Request, res: Response, next: NextFunction) {
  try {
    const { staffId, date, duration } = req.query;
    const data = await appointmentService.getAvailableSlots(
      (req as any).businessId!, staffId as string, date as string, Number(duration) || 30
    );
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function createAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await appointmentService.createAppointment((req as any).businessId!, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
}

export async function updateAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await appointmentService.updateAppointment((req as any).businessId!, req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function cancelAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    await appointmentService.cancelAppointment((req as any).businessId!, req.params.id);
    res.json({ success: true, message: 'Appointment cancelled' });
  } catch (error) { next(error); }
}

export async function sendReminder(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await appointmentService.sendReminder((req as any).businessId!, req.params.id);
    res.json({ success: true, ...data });
  } catch (error) { next(error); }
}
