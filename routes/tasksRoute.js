import { Router } from 'express';
import {
  createTask,
  updateTask,
  getAllTasks,
  getTask,
  deleteTask,
  getTaskStats,
} from './../controllers/tasksController.js';
import { protect } from './../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.route('/').get(getAllTasks).post(createTask);
router.route('/stats').get(getTaskStats);

router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);

export default router;
