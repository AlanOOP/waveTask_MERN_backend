import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";
import { isValidId } from "../helpers";

declare global {
    namespace Express {
        interface Request {
            project?: IProject
        }
    }
}

export async function validateProjectExist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { projectId } = req.params;

        if (!isValidId(projectId)) {
            const error = new Error('Invalid Id Format');
            res.status(404).json({ error: error.message })
            return;
        }
        const project = await Project.findById(projectId);

        if (!project) {
            const error = new Error('Proyecto no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }

        req.project = project;

        next()
    } catch (error) {
        console.log(error);
    }
}