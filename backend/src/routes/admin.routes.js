import { Router } from 'express';
import {
  getTodayAttendanceOverview,
  setManualAttendance,
} from '../controllers/admin.controller.js';
import { updateOfficeSettings } from '../controllers/settings.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { adminAttendanceSchema, officeSettingsSchema } from '../validators/schemas.js';

const router = Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/attendance/today', getTodayAttendanceOverview);
router.put(
  '/attendance/:userId',
  validate(adminAttendanceSchema),
  setManualAttendance
);
router.put('/settings/office', validate(officeSettingsSchema), updateOfficeSettings);

export default router;
