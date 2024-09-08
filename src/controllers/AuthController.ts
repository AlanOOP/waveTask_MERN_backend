import User, { IUser } from "../models/User";
import Token from "../models/Token";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/auth";
import { generateCodeOTP } from "../utils/token";
import { AuthEmail } from "../helpers/AuthEmail";
import { generateToken } from "../utils/jwt";

export class AuthController {

    static singUp = async (req: Request, res: Response): Promise<void> => {

        const { name, email, password }: IUser = req.body

        try {

            if (!name || !email || !password) {
                const error = new Error('Todos los campos son obligatorios');
                res.status(400).json({ error: error.message })
                return;
            }

            if (password.length < 9) {
                const error = new Error('El password es muy corto, minimo 8 caracteres.');
                res.status(400).json({ error: error.message })
                return;
            }

            const userExist = await User.findOne({ email })

            if (userExist) {
                const error = new Error('El usuario ya existe.');
                res.status(409).json({ error: error.message })
                return;
            }

            const user = new User(req.body)
            const token = new Token();
            user.password = await hashPassword(password);
            token.token = generateCodeOTP();
            token.user = user.id;

            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.status(200).json({ message: 'Usuario Creado Correctamente Revisa tu email para confirmar.' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

    static confirmAccount = async (req: Request, res: Response): Promise<void> => {
        const { token } = req.body;

        try {
            if (!token) {
                const error = new Error('El token es necesario.');
                res.status(400).json({ error: error.message })
                return;
            }

            const tokenExist = await Token.findOne({ token });
            if (!tokenExist) {
                const error = new Error('Token no válido');
                res.status(401).json({ error: error.message })
                return;
            }

            const user = await User.findById(tokenExist.user);

            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message })
                return;
            }

            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.status(200).json({ message: `Cuenta Confirmada Correctamente ${user.name}` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

    static singIn = async (req: Request, res: Response) => {
        const { email, password }: IUser = req.body;
        try {
            if (!email || !password) {
                const error = new Error('Todos los campos son obligatorios');
                res.status(400).json({ error: error.message })
                return;
            }

            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message })
                return;
            }

            const isMatch = await comparePassword(password, user.password);

            if (!isMatch) {
                const error = new Error('Contraseña incorrecta');
                res.status(401).json({ error: error.message })
                return;
            }

            if (!user.confirmed) {
                const error = new Error('Confirma tu cuenta');
                res.status(401).json({ error: error.message })
                return;
            }

            const token = generateToken({
                id: user.id
            });

            res.status(200).json({ token });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

    //solicitar confirmacion de cuenta
    static resendConfirmationEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;

            if (!email) {
                const error = new Error('El email es necesario');
                res.status(400).json({ error: error.message })
                return;
            }

            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message })
                return;
            }

            if (user.confirmed) {
                const error = new Error('El usuario ya esta confirmado');
                res.status(403).json({ error: error.message })
                return;
            }

            const token = new Token();
            token.token = generateCodeOTP();
            token.user = user.id;

            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await token.save();

            res.status(200).json({ message: 'Email de confirmación enviado' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

    static forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;

            if (!email) {
                const error = new Error('El email es necesario');
                res.status(400).json({ error: error.message })
                return;
            }

            const user = await User.findOne({ email });

            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message })
                return;
            }

            const token = new Token();
            token.token = generateCodeOTP();
            token.user = user.id;

            await AuthEmail.sendForgotPasswordEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await token.save();

            res.status(200).json({ message: 'Revisa tu email para instrucciones.' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

    static validateToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.body;

            if (!token) {
                const error = new Error('El token es necesario');
                res.status(400).json({ error: error.message })
                return;
            }

            const tokenExist = await Token.findOne({ token });

            if (!tokenExist) {
                const error = new Error('Token no válido');
                res.status(401).json({ error: error.message })
                return;
            }

            res.status(200).json({ message: 'Token válido, Define tu nueva Contraseña' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

    static updatePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            if (!token || !password) {
                const error = new Error('El token y password son necesarios');
                res.status(400).json({ error: error.message })
                return;
            }

            if (password.length < 9) {
                const error = new Error('El password es muy corto, minimo 8 caracteres.');
                res.status(400).json({ error: error.message })
                return;
            }

            const tokenExist = await Token.findOne({ token });

            if (!tokenExist) {
                const error = new Error('Token no válido');
                res.status(401).json({ error: error.message })
                return;
            }

            const user = await User.findById(tokenExist.user);

            if (!user) {
                const error = new Error('Usuario no encontrado');
                res.status(404).json({ error: error.message })
                return;
            }

            user.password = await hashPassword(password);

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            res.status(200).json({ message: 'Contraseña actualizada correctamente' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user);
    }
}
