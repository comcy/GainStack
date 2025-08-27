import request from 'supertest';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import analyticsRoutes from '../src/routes/analyticsRoutes';
import { workoutsFilePath, exercisesFilePath } from '../src/utils/dataHandler';
import { Exercise } from '../src/interfaces/Exercise';
import { Workout } from '../src/interfaces/Workout';

const app = express();
app.use(express.json());
app.use('/api/analytics', analyticsRoutes);

describe('Analytics API', () => {
  let exerciseId1: string;
  let exerciseId2: string;

  beforeAll(async () => {
    // Create dummy exercises
    const dummyExercises: Exercise[] = [
      { id: 'analytics-ex-1', name: 'Analytics Exercise 1' },
      { id: 'analytics-ex-2', name: 'Analytics Exercise 2' }
    ];
    await fs.writeFile(exercisesFilePath, JSON.stringify(dummyExercises, null, 2), 'utf-8');
    exerciseId1 = dummyExercises[0].id!;
    exerciseId2 = dummyExercises[1].id!;

    // Create dummy workouts
    const dummyWorkouts: Workout[] = [
      {
        id: 'w1',
        date: '2025-01-01',
        exercisesPerformed: [
          { exerciseId: exerciseId1, sets: [{ reps: 10, weight: 50 }, { reps: 8, weight: 55 }] },
          { exerciseId: exerciseId2, sets: [{ reps: 5, weight: 20 }] }
        ]
      },
      {
        id: 'w2',
        date: '2025-01-02',
        exercisesPerformed: [
          { exerciseId: exerciseId1, sets: [{ reps: 10, weight: 55 }, { reps: 8, weight: 60 }] }
        ]
      },
      {
        id: 'w3',
        date: '2025-01-03',
        exercisesPerformed: [
          { exerciseId: exerciseId2, sets: [{ reps: 6, weight: 25 }] }
        ]
      }
    ];
    await fs.writeFile(workoutsFilePath, JSON.stringify(dummyWorkouts, null, 2), 'utf-8');
  });

  it('should get historical performance for a specific exercise', async () => {
    console.log('Running analytics test for exerciseId1:', exerciseId1);
    const res = await request(app).get(`/api/analytics/exercise/${exerciseId1}/history`);
    console.log('Analytics response body:', res.body); // Add this
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      { date: '2025-01-01', reps: 10, weight: 50, notes: undefined },
      { date: '2025-01-01', reps: 8, weight: 55, notes: undefined },
      { date: '2025-01-02', reps: 10, weight: 55, notes: undefined },
      { date: '2025-01-02', reps: 8, weight: 60, notes: undefined }
    ]);
  });

  it('should return empty array if exercise has no history', async () => {
    const res = await request(app).get('/api/analytics/exercise/nonexistent-id/history');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});