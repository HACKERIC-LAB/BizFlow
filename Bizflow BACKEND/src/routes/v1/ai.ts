import { Router } from 'express';
import * as ctrl from '../../controllers/aiController';

const router = Router();

router.post('/suggest-reply', ctrl.suggestReply);
router.post('/chat', ctrl.chat);
router.get('/weekly-summary', ctrl.getWeeklySummary);
router.get('/revenue-insights', ctrl.getRevenueInsights);
router.post('/feedback', ctrl.recordFeedback);

export default router;
