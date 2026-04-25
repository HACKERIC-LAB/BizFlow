import { Router } from 'express';
import * as ctrl from '../../controllers/transactionController';

const router = Router();

router.post('/cash', ctrl.recordCash);
router.post('/mpesa/stk', ctrl.initiateMpesa);
router.get('/', ctrl.listTransactions);
router.get('/daily-summary', ctrl.getDailySummary);

export default router;
