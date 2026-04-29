import { Request, Response, NextFunction } from 'express';
import * as staffService from '../services/staffService';

export async function listStaff(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await staffService.listStaff((req as any).businessId!);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getStaff(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await staffService.getStaffMember((req as any).businessId!, req.params.id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function createStaff(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await staffService.createStaff((req as any).businessId!, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
}

export async function updateStaff(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await staffService.updateStaff((req as any).businessId!, req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function deactivateStaff(req: Request, res: Response, next: NextFunction) {
  try {
    await staffService.deactivateStaff((req as any).businessId!, req.params.id);
    res.json({ success: true, message: 'Staff deactivated' });
  } catch (error) { next(error); }
}

export async function resetStaffPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await staffService.resetStaffPassword((req as any).businessId!, req.params.id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function updateSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await staffService.updateSchedule((req as any).businessId!, req.params.id, req.body.schedule);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}
