import { Request, Response, NextFunction } from 'express';
import * as businessService from '../services/businessService';

export async function getCurrent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await businessService.getBusiness((req as any).businessId!);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function updateCurrent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await businessService.updateBusiness((req as any).businessId!, req.body);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getServices(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await businessService.getServices((req as any).businessId!);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function bulkUpsertServices(req: Request, res: Response, next: NextFunction) {
  try {
    const { services } = req.body;
    const data = await businessService.bulkUpsertServices((req as any).businessId!, services);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await businessService.updateService((req as any).businessId!, req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    await businessService.deleteService((req as any).businessId!, req.params.id);
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) { next(error); }
}
