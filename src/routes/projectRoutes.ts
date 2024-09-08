import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { authenticate } from "../middlewares/auth";
import { TeamController } from "../controllers/TeamController";
import { validateProjectExist } from "../middlewares/project";

const router: Router = Router();

router.get('/project', authenticate, ProjectController.getAllProjects);
router.get('/project/:id', authenticate, ProjectController.getProjectById);
router.post('/project', authenticate, ProjectController.createProject);
router.put('/project/:id', authenticate, ProjectController.updateProject);
router.delete('/project/:id', authenticate, ProjectController.deleteProject);

// Routes for team

router.post('/project/:projectId/team/find', authenticate, validateProjectExist, TeamController.findMemberByEmail);
router.post('/project/:projectId/team', authenticate, validateProjectExist, TeamController.addMemberToProject);
router.delete('/project/:projectId/team', authenticate, validateProjectExist, TeamController.removeMemberFromProject);
router.get('/project/:projectId/team', authenticate, validateProjectExist, TeamController.getMembersFromProject);

export default router;