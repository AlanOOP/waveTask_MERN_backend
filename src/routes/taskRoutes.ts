import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExist } from "../middlewares/project";

const router: Router = Router();

router.get('/projects/:projectId/tasks', validateProjectExist, TaskController.getTasksByProject);
router.get('/projects/:projectId/tasks/:taskId', validateProjectExist, TaskController.getTaskById);
router.post('/projects/:projectId/tasks', validateProjectExist, TaskController.createTask);
router.put('/projects/:projectId/tasks/:taskId', validateProjectExist, TaskController.updateTask);
router.delete('/projects/:projectId/tasks/:taskId', validateProjectExist, TaskController.deleteTask);
router.post('/projects/:projectId/tasks/:taskId/status', validateProjectExist, TaskController.updateStatus);


export default router;