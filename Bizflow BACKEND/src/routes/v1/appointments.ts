import { Router } from 'express';
import * as ctrl from '../../controllers/appointmentController';

const router = Router();

router.get('/', ctrl.listAppointments);
router.get('/available-slots', ctrl.getAvailableSlots);
router.post('/', ctrl.createAppointment);
router.put('/:id', ctrl.updateAppointment);
router.delete('/:id', ctrl.cancelAppointment);
router.post('/:id/send-reminder', ctrl.sendReminder);

export default router;
