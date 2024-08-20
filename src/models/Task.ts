import mongoose, { Document, Schema } from "mongoose";

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'on_hold',
    IN_PROGRESS: 'in_progress',
    UNDER_REVIEW: 'under_review',
    COMPLETED: 'completed'
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export interface ITask extends Document {
    name: string
    description: string
    project: mongoose.Schema.Types.ObjectId
    status: TaskStatus
}

const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    }
}, {
    timestamps: true
});

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;