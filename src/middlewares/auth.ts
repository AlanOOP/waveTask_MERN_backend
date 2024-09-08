import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        const error = new Error('No autorizado');
        res.status(401).json({ error: error.message });
        return;
    }

    const token = bearer.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email');

            if (user) {
                req.user = user;
            } else {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }
        }

        next();
    } catch (error) {
        res.status(401).json({ error: 'Token no válido' });
    }
}