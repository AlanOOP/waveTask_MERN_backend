import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middlewares/project";
import { authenticate } from "../middlewares/auth";
import { hasAuthorization } from "../middlewares/task";

const router: Router = Router();

router.get('/projects/:projectId/tasks', authenticate, validateProjectExist, TaskController.getTasksByProject);
router.get('/projects/:projectId/tasks/:taskId', authenticate, validateProjectExist, TaskController.getTaskById);
router.post('/projects/:projectId/tasks', authenticate, validateProjectExist, hasAuthorization, TaskController.createTask);
router.put('/projects/:projectId/tasks/:taskId', authenticate, validateProjectExist, hasAuthorization, TaskController.updateTask);
router.delete('/projects/:projectId/tasks/:taskId', authenticate, validateProjectExist, hasAuthorization, TaskController.deleteTask);
router.post('/projects/:projectId/tasks/:taskId/status', authenticate, validateProjectExist, TaskController.updateStatus);


export default router;