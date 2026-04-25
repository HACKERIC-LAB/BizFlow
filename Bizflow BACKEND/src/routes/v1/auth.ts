import { Router } from 'express';
import * as ctrl from '../../controllers/authController';
import { authLimiter } from '../../middlewares/rateLimit';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.post('/register-owner', authLimiter, ctrl.registerOwner);
router.post('/login', authLimiter, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', authenticate, ctrl.logout);
router.post('/forgot-password', authLimiter, ctrl.forgotPassword);
router.post('/reset-password', authLimiter, ctrl.resetPassword);

export default router;
