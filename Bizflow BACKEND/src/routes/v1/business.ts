import { Router } from 'express';
import * as ctrl from '../../controllers/businessController';
import { checkRole } from '../../middlewares/roleCheck';

const router = Router();

router.get('/current', ctrl.getCurrent);
router.put('/current', checkRole(['OWNER', 'MANAGER']), ctrl.updateCurrent);
router.get('/services', ctrl.getServices);
router.post('/services/bulk', checkRole(['OWNER', 'MANAGER']), ctrl.bulkUpsertServices);
router.put('/services/:id', checkRole(['OWNER', 'MANAGER']), ctrl.updateService);
router.delete('/services/:id', checkRole(['OWNER']), ctrl.deleteService);

export default router;
