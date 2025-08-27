import { Router } from 'express';
import { promises as fs } from 'fs';
import { workoutsFilePath } from '../utils/dataHandler';
import { Workout } from '../interfaces/Workout';

const router = Router();

// Get historical performance for a specific exercise
router.get('/exercise/:exerciseId/history', async (req, res) => {
  try {
    const targetExerciseId = req.params.exerciseId;
    const workouts: Workout[] = JSON.parse(await fs.readFile(workoutsFilePath, 'utf-8'));

    const exerciseHistory: { date: string; reps: number; weight: number; notes?: string }[] = [];

    workouts.forEach(workout => {
      workout.exercisesPerformed.forEach(exercisePerformed => {
        if (exercisePerformed.exerciseId === targetExerciseId) {
          exercisePerformed.sets.forEach(set => {
            exerciseHistory.push({
              date: workout.date,
              reps: set.reps,
              weight: set.weight,
              notes: set.notes
            });
          });
        }
      });
    });

    // Sort by date (oldest first)
    exerciseHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.json(exerciseHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercise history', error });
  }
});

export default router;