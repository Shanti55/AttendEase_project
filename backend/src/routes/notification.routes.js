import { Router } from 'express';
import {
  getMyNotifications,
  markAllRead,
} from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllRead);

export default router;
