import { Request, Response } from "express"
import Project, { IProject } from "../models/Project";
import { isValidId } from "../helpers";

export class ProjectController {


    static getAllProjects = async (req: Request, res: Response): Promise<void> => {
        try {
            const projects = await Project.find().populate('tasks');
            res.status(200).json(projects);
            return;
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response): Promise<void> => {

        const { id } = req.params;

        if (!isValidId(id)) {
            res.status(400).json({ error: "Invalid ID format" });
            return;
        }

        try {
            const project = await Project.findById(id).populate('tasks');
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            res.status(200).json(project)

        } catch (error) {
            console.log(error)
        }
    }

    static createProject = async (req: Request, res: Response): Promise<void> => {

        const { projectName, clientName, description }: IProject = req.body;

        try {

            if (!projectName || !clientName || !description) {
                const error = new Error('Todos los campos son requeridos')
                res.status(400).json({ error: error.message });
                return;
            }

            const project = new Project({
                projectName,
                clientName,
                description
            });

            await project.save();

            res.status(201).json({ message: 'Proyecto Actualizado correctamente' });
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { projectName, clientName, description }: IProject = req.body;

        try {

            if (!isValidId(id)) {
                const error = new Error('Invalid ID format')
                res.status(400).json({ error: error.message });
                return;
            }
            if (!projectName || !clientName || !description) {
                const error = new Error('Todos los campos son requeridos')
                res.status(400).json({ error: error.message });
                return;
            }

            const project = await Project.findById(id);

            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            project.projectName = projectName;
            project.clientName = clientName;
            project.description = description;

            await project.save();

            res.status(200).json({ message: 'Proyecto Actualizado correctamente' })


        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        try {
            if (!isValidId(id)) {
                const error = new Error('Invalid Id Format');
                res.status(400).json({ error: error.message });
                return;
            }

            const project = await Project.findByIdAndDelete(id);

            if (!project) {
                const error = new Error('Proyecto no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            res.status(200).json({ message: 'Proyecto eliminado correctamente' });
        } catch (error) {
            console.log(error);
        }
    }

}