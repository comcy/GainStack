import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../../data'); // Adjust path to data directory
const trainingPlansFilePath = path.join(dataPath, 'training-plans.json');
const exercisesFilePath = path.join(dataPath, 'exercises.json');
const workoutsFilePath = path.join(dataPath, 'workouts.json');

export { trainingPlansFilePath, exercisesFilePath, workoutsFilePath };

export async function initializeData(): Promise<void> {
  try {
    await fs.mkdir(dataPath, { recursive: true });
    // Check and create training-plans.json
    try {
      await fs.access(trainingPlansFilePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(trainingPlansFilePath, '[]', 'utf-8');
      } else {
        throw error; // Re-throw if it's not a file not found error
      }
    }
    // Check and create exercises.json
    try {
      await fs.access(exercisesFilePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(exercisesFilePath, '[]', 'utf-8');
      } else {
        throw error; // Re-throw if it's not a file not found error
      }
    }
    // Check and create workouts.json
    try {
      await fs.access(workoutsFilePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(workoutsFilePath, '[]', 'utf-8');
      } else {
        throw error; // Re-throw if it's not a file not found error
      }
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}