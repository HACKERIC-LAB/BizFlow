import { Router } from 'express';
import * as ctrl from '../../controllers/userController';
import { upload } from '../../middlewares/upload';

const router = Router();

router.get('/me', ctrl.getMe);
router.patch('/me', ctrl.updateMe);
router.patch('/change-password', ctrl.changePassword);
router.post('/photo', upload.single('photo'), ctrl.uploadPhoto);

export default router;
