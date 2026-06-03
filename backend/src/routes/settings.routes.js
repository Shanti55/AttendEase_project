import { Router } from 'express';
import { getOfficeSettingsPublic } from '../controllers/settings.controller.js';

const router = Router();

router.get('/office', getOfficeSettingsPublic);

export default router;
