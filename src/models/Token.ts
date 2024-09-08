import mongoose, { Document, Schema } from "mongoose";

export interface IToken extends Document {
    token: string
    user: mongoose.Schema.Types.ObjectId,
    createdAt: Date
}

const tokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: "10m"
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;