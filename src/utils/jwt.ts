import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

interface UserPayload {
    id: mongoose.Schema.Types.ObjectId
}

export const generateToken = (payload: UserPayload): string => {

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    });

    return token;
}