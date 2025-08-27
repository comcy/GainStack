import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, '../data');
const trainingPlansFilePath = path.join(dataPath, 'training-plans.json');
const exercisesFilePath = path.join(dataPath, 'exercises.json');
const workoutsFilePath = path.join(dataPath, 'workouts.json');

// Store original data content
let originalTrainingPlans: string;
let originalExercises: string;
let originalWorkouts: string;

beforeAll(async () => {
  // Read original data before any tests run
  originalTrainingPlans = await fs.readFile(trainingPlansFilePath, 'utf-8');
  originalExercises = await fs.readFile(exercisesFilePath, 'utf-8');
  originalWorkouts = await fs.readFile(workoutsFilePath, 'utf-8');

  // Clear data once before all tests run
  await fs.writeFile(trainingPlansFilePath, '[]', 'utf-8');
  await fs.writeFile(exercisesFilePath, '[]', 'utf-8');
  await fs.writeFile(workoutsFilePath, '[]', 'utf-8');
});

// beforeEach is removed, as each test will create its own data

afterAll(async () => {
  // Restore original data after all tests are done
  await fs.writeFile(trainingPlansFilePath, originalTrainingPlans, 'utf-8');
  await fs.writeFile(exercisesFilePath, originalExercises, 'utf-8');
  await fs.writeFile(workoutsFilePath, originalWorkouts, 'utf-8');
});