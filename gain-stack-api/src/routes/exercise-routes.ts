import { Router } from 'express';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import { exercisesFilePath } from '../utils/data-handler';
import { Exercise } from '../interfaces/exercise';

const router = Router();

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(exercisesFilePath, 'utf-8');
    const exercises: Exercise[] = JSON.parse(data);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error reading exercises', error });
  }
});

// Get a single exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercises: Exercise[] = JSON.parse(await fs.readFile(exercisesFilePath, 'utf-8'));
    const exercise = exercises.find(e => e.id === req.params.id);
    if (exercise) {
      res.json(exercise);
    } else {
      res.status(404).json({ message: 'Exercise not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reading exercise', error });
  }
});

// Create a new exercise
router.post('/', async (req, res) => {
  try {
    const exercises: Exercise[] = JSON.parse(await fs.readFile(exercisesFilePath, 'utf-8'));
    const newExercise: Exercise = { id: crypto.randomUUID(), ...req.body };
    exercises.push(newExercise);
    await fs.writeFile(exercisesFilePath, JSON.stringify(exercises, null, 2), 'utf-8');
    res.status(201).json(newExercise);
  } catch (error) {
    res.status(500).json({ message: 'Error creating exercise', error });
  }
});

// Update an exercise by ID
router.put('/:id', async (req, res) => {
  try {
    let exercises: Exercise[] = JSON.parse(await fs.readFile(exercisesFilePath, 'utf-8'));
    const index = exercises.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
      exercises[index] = { id: req.params.id, ...req.body };
      await fs.writeFile(exercisesFilePath, JSON.stringify(exercises, null, 2), 'utf-8');
      res.json(exercises[index]);
    } else {
      res.status(404).json({ message: 'Exercise not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating exercise', error });
  }
});

// Delete an exercise by ID
router.delete('/:id', async (req, res) => {
  try {
    let exercises: Exercise[] = JSON.parse(await fs.readFile(exercisesFilePath, 'utf-8'));
    const initialLength = exercises.length;
    exercises = exercises.filter(e => e.id !== req.params.id);
    if (exercises.length < initialLength) {
      await fs.writeFile(exercisesFilePath, JSON.stringify(exercises, null, 2), 'utf-8');
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Exercise not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exercise', error });
  }
});

export default router;