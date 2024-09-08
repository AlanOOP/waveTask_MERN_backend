import { Request, Response } from "express"
import Task, { ITask } from "../models/Task";
import { isValidId } from "../helpers";

export class TaskController {

    static getTasksByProject = async (req: Request, res: Response): Promise<void> => {

        const project = req.project;

        try {

            const tasks = await Task.find({ project: project.id }).populate('project');
            res.status(200).json(tasks);

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

    static getTaskById = async (req: Request, res: Response): Promise<void> => {

        const { taskId } = req.params;

        try {

            if (!isValidId(taskId)) {
                const error = new Error('Id de la tarea no valido');
                res.status(400).json({ error: error.message });
                return
            }

            const task = await Task.findById(taskId).populate({ path: 'completedBy', select: 'id name email' });

            if (!task) {
                const error = new Error('Tarea no encontrado');
                res.status(404).json({ error: error.message });
                return
            }
            if (task.project.toString() !== req.project.id) {
                const error = new Error('Acción no valida');
                res.status(401).json({ error: error.message });
                return
            }

            res.status(200).json(task);

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

    static createTask = async (req: Request, res: Response): Promise<void> => {

        const { name, description }: ITask = req.body;
        const project = req.project;
        try {

            if (!name || !description) {
                const error = new Error('Todos los campos son obligatorios');
                res.status(404).json({ error: error.message });
                return;
            }

            const task = new Task({
                name,
                description,
                project: project.id
            });

            project.tasks.push(task.id);

            await task.save();
            await project.save();

            res.status(201).json({ message: 'Tarea Creada correctamente' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

    static updateTask = async (req: Request, res: Response): Promise<void> => {

        const { taskId } = req.params;
        const { name, description }: ITask = req.body;

        try {

            if (!isValidId(taskId)) {
                const error = new Error('Id no valido');
                res.status(400).json({ error: error.message });
                return;
            }

            if (!name || !description) {
                const error = new Error('Todos los campos son obligatorios');
                res.status(400).json({ error: error.message });
                return;
            }

            const task = await Task.findById(taskId)

            if (!task) {
                const error = new Error('Tarea no encontrada');
                res.status(404).json({ error: error.message });
                return;
            }

            if (task.project.toString() !== req.project.id) {
                const error = new Error('Acción no valida');
                res.status(401).json({ error: error.message });
                return;
            }

            task.name = name;
            task.description = description;

            await task.save();

            res.status(200).json({ message: 'Tarea actualizada correctamente' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

    static deleteTask = async (req: Request, res: Response): Promise<void> => {
        const { taskId } = req.params;
        try {
            if (!isValidId(taskId)) {
                const error = new Error('Id no valido');
                res.status(400).json({ error: error.message });
                return;
            }
            const task = await Task.findById(taskId);

            if (!task) {
                const error = new Error('Tarea no encontrada');
                res.status(404).json({ error: error.message });
                return;
            }

            if (task.project.toString() !== req.project.id) {
                const error = new Error('Acción no valida');
                res.status(401).json({ error: error.message });
                return;
            }

            req.project.tasks = req.project.tasks.filter(task => task.toString() !== taskId);

            await Promise.allSettled([task.deleteOne(), req.project.save()])

            res.status(200).json({ message: 'Tarea eliminada correctamente' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

    static updateStatus = async (req: Request, res: Response): Promise<void> => {

        const { taskId } = req.params;
        const { status } = req.body;

        try {

            if (!isValidId(taskId)) {
                const error = new Error('Id no valido');
                res.status(400).json({ error: error.message });
                return;
            }

            if (!status) {
                const error = new Error('El status es obligatorio');
                res.status(400).json({ error: error.message });
                return;
            }

            const task = await Task.findById(taskId);

            if (!task) {
                const error = new Error('Tarea no encontrada');
                res.status(404).json({ error: error.message });
                return
            }

            task.status = status;

            if (status === 'pending') {
                task.completedBy = null
            } else {
                task.completedBy = req.user.id
            }


            await task.save();

            res.status(200).json({ message: 'Status Actualizado Correctamente' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

}