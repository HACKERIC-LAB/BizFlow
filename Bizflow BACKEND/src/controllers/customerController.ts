import { Request, Response, NextFunction } from 'express';
import * as customerService from '../services/customerService';

export async function listCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, page, limit } = req.query;
    const data = await customerService.listCustomers((req as any).businessId!, {
      search: search as string,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await customerService.getCustomer((req as any).businessId!, req.params.id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await customerService.createCustomer((req as any).businessId!, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await customerService.updateCustomer((req as any).businessId!, req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}
