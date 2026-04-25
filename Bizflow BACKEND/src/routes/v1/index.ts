import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { tenantIsolation } from '../../middlewares/tenantIsolation';

import authRoutes from './auth';
import businessRoutes from './business';
import staffRoutes from './staff';
import customerRoutes from './customers';
import transactionRoutes from './transactions';
import queueRoutes from './queue';
import appointmentRoutes from './appointments';
import aiRoutes from './ai';
import webhookRoutes from './webhooks';
import reportRoutes from './reports';
import syncRoutes from './sync';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/webhooks', webhookRoutes);

// Protected routes (require auth + tenant isolation)
router.use('/business', authenticate, tenantIsolation, businessRoutes);
router.use('/staff', authenticate, tenantIsolation, staffRoutes);
router.use('/customers', authenticate, tenantIsolation, customerRoutes);
router.use('/transactions', authenticate, tenantIsolation, transactionRoutes);
router.use('/queue', authenticate, tenantIsolation, queueRoutes);
router.use('/appointments', authenticate, tenantIsolation, appointmentRoutes);
router.use('/ai', authenticate, tenantIsolation, aiRoutes);
router.use('/reports', authenticate, tenantIsolation, reportRoutes);
router.use('/sync', authenticate, tenantIsolation, syncRoutes);

export default router;
