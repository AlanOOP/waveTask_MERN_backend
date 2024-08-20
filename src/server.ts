import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotvenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db';

import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';

import { corsConfig } from './config/cors';

dotvenv.config();
const app: Express = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Routing
app.get("/", (req: Request, res: Response) => {
    res.json('Hola Mundo')
});

app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', authRoutes);

export default app;