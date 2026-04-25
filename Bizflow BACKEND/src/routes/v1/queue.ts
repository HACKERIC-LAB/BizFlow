import { Router } from 'express';
import * as ctrl from '../../controllers/queueController';

const router = Router();

router.get('/active', ctrl.getActiveQueue);
router.post('/checkin', ctrl.checkIn);
router.get('/position/:phone', ctrl.getPositionByPhone);
router.put('/:id/start-serving', ctrl.startServing);
router.put('/:id/complete', ctrl.completeServing);
router.put('/:id/skip', ctrl.skipEntry);

export default router;
