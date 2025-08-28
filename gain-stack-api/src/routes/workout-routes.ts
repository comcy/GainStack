import { Router } from 'express';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import { workoutsFilePath } from '../utils/data-handler';
import { Workout } from '../interfaces/workout';

const router = Router();

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(workoutsFilePath, 'utf-8');
    const workouts: Workout[] = JSON.parse(data);
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error reading workouts', error });
  }
});

// Get a single workout by ID
router.get('/:id', async (req, res) => {
  try {
    const workouts: Workout[] = JSON.parse(await fs.readFile(workoutsFilePath, 'utf-8'));
    const workout = workouts.find(w => w.id === req.params.id);
    if (workout) {
      res.json(workout);
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reading workout', error });
  }
});

// Create a new workout
router.post('/', async (req, res) => {
  try {
    const workouts: Workout[] = JSON.parse(await fs.readFile(workoutsFilePath, 'utf-8'));
    const newWorkout: Workout = { id: crypto.randomUUID(), ...req.body };
    workouts.push(newWorkout);
    await fs.writeFile(workoutsFilePath, JSON.stringify(workouts, null, 2), 'utf-8');
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Error creating workout', error });
  }
});

// Update a workout by ID
router.put('/:id', async (req, res) => {
  try {
    let workouts: Workout[] = JSON.parse(await fs.readFile(workoutsFilePath, 'utf-8'));
    const index = workouts.findIndex(w => w.id === req.params.id);
    if (index !== -1) {
      workouts[index] = { id: req.params.id, ...req.body };
      await fs.writeFile(workoutsFilePath, JSON.stringify(workouts, null, 2), 'utf-8');
      res.json(workouts[index]);
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout', error });
  }
});

// Delete a workout by ID
router.delete('/:id', async (req, res) => {
  try {
    let workouts: Workout[] = JSON.parse(await fs.readFile(workoutsFilePath, 'utf-8'));
    const initialLength = workouts.length;
    workouts = workouts.filter(w => w.id !== req.params.id);
    if (workouts.length < initialLength) {
      await fs.writeFile(workoutsFilePath, JSON.stringify(workouts, null, 2), 'utf-8');
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout', error });
  }
});

export default router;