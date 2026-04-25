import { Router } from 'express';
import * as ctrl from '../../controllers/webhookController';

const router = Router();

router.post('/mpesa/callback', ctrl.mpesaCallback);
router.get('/whatsapp', ctrl.whatsappWebhook);
router.post('/whatsapp', ctrl.whatsappWebhook);

export default router;
