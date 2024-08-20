import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";

const router: Router = Router();

router.get('/project', ProjectController.getAllProjects);
router.get('/project/:id', ProjectController.getProjectById);
router.post('/project', ProjectController.createProject);
router.put('/project/:id', ProjectController.updateProject);
router.delete('/project/:id', ProjectController.deleteProject);

export default router;