"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const dataPath = path_1.default.join(__dirname, '../data');
const trainingPlansFilePath = path_1.default.join(dataPath, 'training-plans.json');
const exercisesFilePath = path_1.default.join(dataPath, 'exercises.json');
const workoutsFilePath = path_1.default.join(dataPath, 'workouts.json');
// Store original data content
let originalTrainingPlans;
let originalExercises;
let originalWorkouts;
beforeAll(async () => {
    // Read original data before any tests run
    originalTrainingPlans = await fs_1.promises.readFile(trainingPlansFilePath, 'utf-8');
    originalExercises = await fs_1.promises.readFile(exercisesFilePath, 'utf-8');
    originalWorkouts = await fs_1.promises.readFile(workoutsFilePath, 'utf-8');
    // Clear data once before all tests run
    await fs_1.promises.writeFile(trainingPlansFilePath, '[]', 'utf-8');
    await fs_1.promises.writeFile(exercisesFilePath, '[]', 'utf-8');
    await fs_1.promises.writeFile(workoutsFilePath, '[]', 'utf-8');
});
// beforeEach is removed, as each test will create its own data
afterAll(async () => {
    // Restore original data after all tests are done
    await fs_1.promises.writeFile(trainingPlansFilePath, originalTrainingPlans, 'utf-8');
    await fs_1.promises.writeFile(exercisesFilePath, originalExercises, 'utf-8');
    await fs_1.promises.writeFile(workoutsFilePath, originalWorkouts, 'utf-8');
});
