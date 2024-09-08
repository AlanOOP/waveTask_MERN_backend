import { Request, Response, NextFunction } from "express";

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.user.id.toString() !== req.project.manager.toString()) {
            const error = new Error('No tienes permisos para realizar esta acción');
            res.status(401).json({ error: error.message });
            return
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error en el servidor' });
    }
}