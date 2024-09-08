import { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";
import { isValidId } from "../helpers";


export class TeamController {

    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            if (!email) {
                const error = new Error('El email es requerido');
                res.status(400).json({ error: error.message });
                return;
            }

            const user = await User.findOne({ email }).select('_id name email');

            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

    static addMemberToProject = async (req: Request, res: Response) => {
        const { id } = req.body;
        const project = req.project;
        try {
            if (!isValidId(id)) {
                const error = new Error('Id de usuario no valido');
                res.status(400).json({ error: error.message });
                return;
            }

            const user = await User.findById(id).select('_id');

            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            if (project.team.includes(user.id)) {
                const error = new Error('Usuario ya es miembro del proyecto');
                res.status(400).json({ error: error.message });
                return;
            }

            project.team.push(user.id);

            await project.save();

            res.status(200).json({ message: 'Usuario agregado al proyecto' });

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

    // remove member from project

    static removeMemberFromProject = async (req: Request, res: Response) => {
        const { id } = req.body;
        const project = req.project;
        try {
            if (!isValidId(id)) {
                const error = new Error('Id de usuario no valido');
                res.status(400).json({ error: error.message });
                return;
            }

            const user = await User.findById(id).select('_id');

            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            if (!project.team.includes(user.id)) {
                const error = new Error('Usuario no es miembro del proyecto');
                res.status(400).json({ error: error.message });
                return;
            }

            project.team = project.team.filter((member) => member.toString() !== user.id.toString());

            await project.save();

            res.status(200).json({ message: 'Usuario removido del proyecto' });

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

    static getMembersFromProject = async (req: Request, res: Response) => {
        const project = req.project;
        try {
            const members = await User.find({ _id: { $in: project.team } }).select('_id name email');
            res.status(200).json(members);

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error en el servidor' });
        }
    }

}