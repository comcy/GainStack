import express, { Request, Response } from 'express';
import cors from 'cors';
import { initializeData } from './utils/data-handler';
import trainingPlanRoutes from './routes/training-plan-routes';
import exerciseRoutes from './routes/exercise-routes';
import workoutRoutes from './routes/workout-routes';
import analyticsRoutes from './routes/analytics-routes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize data files
initializeData();

app.get('/api', (req: Request, res: Response) => {
  res.send('Welcome to the Gain-Stack API!');
});

// Use routes
app.use('/api/training-plans', trainingPlanRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(port, () => {
  console.log(`Gain-Stack API listening at http://localhost:${port}`);
});