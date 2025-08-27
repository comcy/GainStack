import request from 'supertest';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import trainingPlanRoutes from '../src/routes/trainingPlanRoutes';
import { trainingPlansFilePath } from '../src/utils/dataHandler';

const app = express();
app.use(express.json());
app.use('/api/training-plans', trainingPlanRoutes);

describe('Training Plans API', () => {
  const testTrainingPlan = {
    name: 'Test Plan',
    description: 'A plan for testing'
  };

  it('should create a new training plan', async () => {
    const res = await request(app)
      .post('/api/training-plans')
      .send(testTrainingPlan);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toEqual(testTrainingPlan.name);
  });

  it('should get all training plans', async () => {
    // Create a plan first
    await request(app).post('/api/training-plans').send(testTrainingPlan);

    const res = await request(app).get('/api/training-plans');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toEqual(testTrainingPlan.name);
  });

  it('should get a training plan by ID', async () => {
    const postRes = await request(app).post('/api/training-plans').send(testTrainingPlan);
    const planId = postRes.body.id;

    const getRes = await request(app).get(`/api/training-plans/${planId}`);
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body.id).toEqual(planId);
    expect(getRes.body.name).toEqual(testTrainingPlan.name);
  });

  it('should return 404 if training plan not found', async () => {
    const res = await request(app).get('/api/training-plans/nonexistent-id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Training plan not found');
  });

  it('should update a training plan', async () => {
    const postRes = await request(app).post('/api/training-plans').send(testTrainingPlan);
    const planId = postRes.body.id;
    const updatedName = 'Updated Test Plan';

    const putRes = await request(app)
      .put(`/api/training-plans/${planId}`)
      .send({ ...testTrainingPlan, id: planId, name: updatedName });
    expect(putRes.statusCode).toEqual(200);
    expect(putRes.body.name).toEqual(updatedName);

    const getRes = await request(app).get(`/api/training-plans/${planId}`);
    expect(getRes.body.name).toEqual(updatedName);
  });

  it('should return 404 if training plan to update not found', async () => {
    const res = await request(app)
      .put('/api/training-plans/nonexistent-id')
      .send({ name: 'Nonexistent' });
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Training plan not found');
  });

  it('should delete a training plan', async () => {
    const postRes = await request(app).post('/api/training-plans').send(testTrainingPlan);
    const planId = postRes.body.id;
    console.log('Plan created for delete test, ID:', planId); // Add this

    const deleteRes = await request(app).delete(`/api/training-plans/${planId}`);
    console.log('Delete response status:', deleteRes.statusCode); // Add this
    expect(deleteRes.statusCode).toEqual(204);

    const getRes = await request(app).get(`/api/training-plans/${planId}`);
    console.log('Get after delete status:', getRes.statusCode); // Add this
    expect(getRes.statusCode).toEqual(404);
  });

  it('should return 404 if training plan to delete not found', async () => {
    const res = await request(app).delete('/api/training-plans/nonexistent-id');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Training plan not found');
  });
});