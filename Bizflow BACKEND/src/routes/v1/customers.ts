import { Router } from 'express';
import * as ctrl from '../../controllers/customerController';
import { validate } from '../../middlewares/validation';
import { z } from 'zod';

const router = Router();

const createSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
});

const updateSchema = createSchema.partial();

router.get('/', ctrl.listCustomers);
router.post('/', validate(createSchema), ctrl.createCustomer);
router.get('/:id', ctrl.getCustomer);
router.put('/:id', validate(updateSchema), ctrl.updateCustomer);
router.delete('/:id', ctrl.deleteCustomer);

export default router;
