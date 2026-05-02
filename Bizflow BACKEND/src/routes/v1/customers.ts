import { Router } from 'express';
import * as ctrl from '../../controllers/customerController';

const router = Router();

router.get('/', ctrl.listCustomers);
router.post('/', ctrl.createCustomer);
router.get('/:id', ctrl.getCustomer);
router.put('/:id', ctrl.updateCustomer);
router.delete('/:id', ctrl.deleteCustomer);

export default router;
