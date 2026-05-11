import { Router } from 'express';
import * as ctrl from '../../controllers/queueController';
import { validate } from '../../middlewares/validation';
import { z } from 'zod';

const router = Router();

const checkInSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(9),
  customerId: z.string().optional(),
  serviceIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

router.get('/active', ctrl.getActiveQueue);
router.post('/checkin', validate(checkInSchema), ctrl.checkIn);
router.get('/position/:phone', ctrl.getPositionByPhone);
router.put('/:id/start-serving', ctrl.startServing);
router.put('/:id/complete', ctrl.completeServing);
router.put('/:id/skip', ctrl.skipEntry);

export default router;
