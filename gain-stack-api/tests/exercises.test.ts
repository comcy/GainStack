import request from 'supertest';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import exerciseRoutes from '../src/routes/exerciseRoutes';
import { exercisesFilePath } from '../src/utils/dataHandler';

const app = express();
app.use(express.json());
app.use('/api/exercises', exerciseRoutes);

describe('Exercises API', () => {
  const testExercise = {
    name: 'Test Exercise',
    description: 'An exercise for testing',
    muscleGroups: ['TestGroup'],
    equipmentType: 'other'
  };

  it('should create a new exercise', async () => {
    const res = await request(app)
      .post('/api/exercises')
      .send(testExercise);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual(testExercise.name);
  });

  it('should get all exercises', async () => {
    await request(app).post('/api/exercises').send(testExercise);

    const res = await request(app).get('/api/exercises');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toEqual(testExercise.name);
  });

  it('should get an exercise by ID', async () => {
    const postRes = await request(app).post('/api/exercises').send(testExercise);
    const exerciseId = postRes.body.id;

    const getRes = await request(app).get(`/api/exercises/${exerciseId}`);
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body.id).toEqual(exerciseId);
    expect(getRes.body.name).toEqual(testExercise.name);
  });

  it('should return 404 if exercise not found', async () => {
    const res = await request(app).get('/api/exercises/nonexistent-id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Exercise not found');
  });

  it('should update an exercise', async () => {
    const postRes = await request(app).post('/api/exercises').send(testExercise);
    const exerciseId = postRes.body.id;
    const updatedName = 'Updated Test Exercise';

    const putRes = await request(app)
      .put(`/api/exercises/${exerciseId}`)
      .send({ ...testExercise, id: exerciseId, name: updatedName });
    expect(putRes.statusCode).toEqual(200);
    expect(putRes.body.name).toEqual(updatedName);

    const getRes = await request(app).get(`/api/exercises/${exerciseId}`);
    expect(getRes.body.name).toEqual(updatedName);
  });

  it('should return 404 if exercise to update not found', async () => {
    const res = await request(app)
      .put('/api/exercises/nonexistent-id')
      .send({ name: 'Nonexistent' });
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Exercise not found');
  });

  it('should delete an exercise', async () => {
    const postRes = await request(app).post('/api/exercises').send(testExercise);
    const exerciseId = postRes.body.id;

    const deleteRes = await request(app).delete(`/api/exercises/${exerciseId}`);
    expect(deleteRes.statusCode).toEqual(204);

    const getRes = await request(app).get(`/api/exercises/${exerciseId}`);
    expect(getRes.statusCode).toEqual(404);
  });

  it('should return 404 if exercise to delete not found', async () => {
    const res = await request(app).delete('/api/exercises/nonexistent-id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Exercise not found');
  });
});