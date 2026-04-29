import { Router } from 'express';
import * as ctrl from '../../controllers/staffController';
import { checkRole } from '../../middlewares/roleCheck';

const router = Router();

router.get('/', checkRole(['OWNER', 'MANAGER']), ctrl.listStaff);
router.post('/', checkRole(['OWNER']), ctrl.createStaff);
router.get('/:id', checkRole(['OWNER', 'MANAGER']), ctrl.getStaff);
router.put('/:id', checkRole(['OWNER', 'MANAGER']), ctrl.updateStaff);
router.delete('/:id', checkRole(['OWNER']), ctrl.deactivateStaff);
router.post('/:id/reset-password', checkRole(['OWNER', 'MANAGER']), ctrl.resetStaffPassword);
router.put('/:id/schedule', checkRole(['OWNER', 'MANAGER']), ctrl.updateSchedule);
router.get('/:id/report', checkRole(['OWNER', 'MANAGER']), ctrl.listStaffReport);

export default router;
