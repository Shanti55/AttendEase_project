import { Router } from 'express';
import {
  createTask,
  getTasks,
  getOneTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { taskSchema, taskUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', validate(taskSchema), createTask);
router.get('/:id', getOneTask);
router.patch('/:id', validate(taskUpdateSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
