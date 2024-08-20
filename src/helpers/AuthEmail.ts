import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {

    static sendConfirmationEmail = async (user: IEmail) => {

        const info = await transporter.sendMail({
            from: 'WaveTask <admin@wavetask.com>',
            to: user.email,
            subject: 'WaveTask - Confirma tu Cuenta',
            text: 'Wave Task - Confirma tu cuenta',
            html: `
                <p>
                    Hola : ${user.name}, has creado tu cuenta en WaveTask, ya casi esta todo listo, solo debes de confirmar tu cuenta.
                </p>
                <hr/>
                <p>Visita el siguiente enlace</p>
                <a href=${process.env.FRONTEND_URL}/auth/confirm-account>Confirmar cuenta</a>
                <p>E ingresa el código : <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })

    }

    static sendForgotPasswordEmail = async (user: IEmail) => {

        await transporter.sendMail({
            from: 'WaveTask <admin@wavetask.com>',
            to: user.email,
            subject: 'WaveTask - Restablecer Contraseña',
            text: 'Wave Task - Restablecer Contraseña',
            html: `
                    <p>
                        Hola : ${user.name}, hemos recibido una solicitud para restablecer tu contraseña.
                    </p>
                    <hr/>
                    <p>Visita el siguiente enlace</p>
                    <a href=${process.env.FRONTEND_URL}/auth/new-password>Restablecer Contraseña</a>
                    <p>E ingresa el código : <b>${user.token}</b></p>
                    <p>Este token expira en 10 minutos</p>
                `
        })
    }


}