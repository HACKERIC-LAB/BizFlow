import { Router, Request, Response, NextFunction } from 'express';
import * as queueService from '../../services/queueService';
import * as transactionService from '../../services/transactionService';

const router = Router();

// POST /v1/sync/pending — accepts offline actions from frontend IndexedDB
router.post('/pending', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { actions } = req.body as {
      actions: Array<{
        type: 'CHECKIN' | 'CASH_TRANSACTION';
        idempotencyKey: string;
        payload: any;
        timestamp: string;
      }>;
    };

    if (!Array.isArray(actions)) {
      res.status(400).json({ success: false, message: 'actions must be an array' });
      return;
    }

    const results: { idempotencyKey: string; status: string; data?: any; error?: string }[] = [];

    for (const action of actions) {
      try {
        if (action.type === 'CHECKIN') {
          const data = await queueService.checkIn((req as any).businessId!, action.payload);
          results.push({ idempotencyKey: action.idempotencyKey, status: 'synced', data });
        } else if (action.type === 'CASH_TRANSACTION') {
          const data = await transactionService.recordCashTransaction(
            (req as any).businessId!, (req as any).user!.userId, action.payload
          );
          results.push({ idempotencyKey: action.idempotencyKey, status: 'synced', data });
        } else {
          results.push({ idempotencyKey: action.idempotencyKey, status: 'unknown_type' });
        }
      } catch (err: any) {
        results.push({
          idempotencyKey: action.idempotencyKey,
          status: 'conflict',
          error: err.message,
        });
      }
    }

    res.json({ success: true, results });
  } catch (error) { next(error); }
});

export default router;
