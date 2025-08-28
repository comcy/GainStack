import { Router } from 'express';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import { trainingPlansFilePath } from '../utils/data-handler';
import { TrainingPlan } from '../interfaces/training-plan';

const router = Router();

// Get active training plan
router.get('/active', async (req, res) => {
  try {
    const data = await fs.readFile(trainingPlansFilePath, 'utf-8');
    const trainingPlans: TrainingPlan[] = JSON.parse(data);
    const activePlan = trainingPlans.find(p => p.isActive);
    if (activePlan) {
      res.json(activePlan);
    } else {
      // If no plan is active, maybe return a specific status or message
      res.status(404).json({ message: 'No active training plan found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reading training plans', error });
  }
});

// Activate a training plan by ID
router.patch('/:id/activate', async (req, res) => {
  try {
    let trainingPlans: TrainingPlan[] = JSON.parse(await fs.readFile(trainingPlansFilePath, 'utf-8'));
    const index = trainingPlans.findIndex(p => p.id === req.params.id);

    if (index !== -1) {
      // Set all other plans to inactive
      trainingPlans.forEach(p => p.isActive = false);
      // Set the selected plan to active
      trainingPlans[index].isActive = true;

      await fs.writeFile(trainingPlansFilePath, JSON.stringify(trainingPlans, null, 2), 'utf-8');
      res.json(trainingPlans[index]);
    } else {
      res.status(404).json({ message: 'Training plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error activating training plan', error });
  }
});

// Get all training plans
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(trainingPlansFilePath, 'utf-8');
    const trainingPlans: TrainingPlan[] = JSON.parse(data);
    res.json(trainingPlans);
  } catch (error) {
    res.status(500).json({ message: 'Error reading training plans', error });
  }
});

// Create a new training plan
router.post('/', async (req, res) => {
  try {
    const trainingPlans: TrainingPlan[] = JSON.parse(await fs.readFile(trainingPlansFilePath, 'utf-8'));
    const newTrainingPlan: TrainingPlan = { id: crypto.randomUUID(), ...req.body };
    trainingPlans.push(newTrainingPlan);
    await fs.writeFile(trainingPlansFilePath, JSON.stringify(trainingPlans, null, 2), 'utf-8');
    res.status(201).json(newTrainingPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating training plan', error });
  }
});

// Get a single training plan by ID
router.get('/:id', async (req, res) => {
  try {
    const trainingPlans: TrainingPlan[] = JSON.parse(await fs.readFile(trainingPlansFilePath, 'utf-8'));
    const trainingPlan = trainingPlans.find(p => p.id === req.params.id);
    if (trainingPlan) {
      res.json(trainingPlan);
    } else {
      res.status(404).json({ message: 'Training plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reading training plan', error });
  }
});

// Update a training plan by ID
router.put('/:id', async (req, res) => {
  try {
    let trainingPlans: TrainingPlan[] = JSON.parse(await fs.readFile(trainingPlansFilePath, 'utf-8'));
    const index = trainingPlans.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
      trainingPlans[index] = { id: req.params.id, ...req.body };
      await fs.writeFile(trainingPlansFilePath, JSON.stringify(trainingPlans, null, 2), 'utf-8');
      res.json(trainingPlans[index]);
    } else {
      res.status(404).json({ message: 'Training plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating training plan', error });
  }
});

// Delete a training plan by ID
router.delete('/:id', async (req, res) => {
  try {
    let trainingPlans: TrainingPlan[] = JSON.parse(await fs.readFile(trainingPlansFilePath, 'utf-8'));
    const initialLength = trainingPlans.length;
    trainingPlans = trainingPlans.filter(p => p.id !== req.params.id);
    if (trainingPlans.length < initialLength) {
      await fs.writeFile(trainingPlansFilePath, JSON.stringify(trainingPlans, null, 2), 'utf-8');
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Training plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting training plan', error });
  }
});

export default router;