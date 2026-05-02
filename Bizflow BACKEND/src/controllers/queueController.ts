import { Request, Response, NextFunction } from 'express';
import * as queueService from '../services/queueService';

export async function getActiveQueue(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await queueService.getActiveQueue((req as any).businessId!);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function checkIn(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await queueService.checkIn((req as any).businessId!, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
}

export async function startServing(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await queueService.startServing((req as any).businessId!, req.params.id, (req as any).userId!);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function completeServing(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await queueService.completeServing((req as any).businessId!, req.params.id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function skipEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await queueService.skipEntry((req as any).businessId!, req.params.id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getPositionByPhone(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await queueService.getPositionByPhone((req as any).businessId!, req.params.phone);
    if (!data) {
      res.status(404).json({ success: false, message: 'Not in queue' });
      return;
    }
    res.json({ success: true, data });
  } catch (error) { next(error); }
}
