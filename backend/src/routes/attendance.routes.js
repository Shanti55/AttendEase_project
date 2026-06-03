import { Router } from 'express';
import {
  markAttendance,
  checkOut,
  getMyAttendance,
  getAttendanceStats,
} from '../controllers/attendance.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.post('/mark', markAttendance);
router.post('/checkout', checkOut);
router.get('/stats', getAttendanceStats);
router.get('/', getMyAttendance);

export default router;
