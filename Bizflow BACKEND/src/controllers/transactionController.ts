import { Request, Response, NextFunction } from 'express';
import * as transactionService from '../services/transactionService';

export async function recordCash(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await transactionService.recordCashTransaction(
      (req as any).businessId!, (req as any).user!.userId, req.body
    );
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
}

export async function initiateMpesa(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await transactionService.initiateMpesaPayment(
      (req as any).businessId!, (req as any).user!.userId, req.body
    );
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function listTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await transactionService.listTransactions((req as any).businessId!, req.query as any);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}

export async function getDailySummary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await transactionService.getDailySummary((req as any).businessId!);
    res.json({ success: true, data });
  } catch (error) { next(error); }
}
