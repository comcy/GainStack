"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const trainingPlanRoutes_1 = __importDefault(require("../src/routes/trainingPlanRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/training-plans', trainingPlanRoutes_1.default);
describe('Training Plans API', () => {
    const testTrainingPlan = {
        name: 'Test Plan',
        description: 'A plan for testing'
    };
    it('should create a new training plan', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/training-plans')
            .send(testTrainingPlan);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toEqual(testTrainingPlan.name);
    });
    it('should get all training plans', async () => {
        // Create a plan first
        await (0, supertest_1.default)(app).post('/api/training-plans').send(testTrainingPlan);
        const res = await (0, supertest_1.default)(app).get('/api/training-plans');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toEqual(testTrainingPlan.name);
    });
    it('should get a training plan by ID', async () => {
        const postRes = await (0, supertest_1.default)(app).post('/api/training-plans').send(testTrainingPlan);
        const planId = postRes.body.id;
        const getRes = await (0, supertest_1.default)(app).get(`/api/training-plans/${planId}`);
        expect(getRes.statusCode).toEqual(200);
        expect(getRes.body.id).toEqual(planId);
        expect(getRes.body.name).toEqual(testTrainingPlan.name);
    });
    it('should return 404 if training plan not found', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/training-plans/nonexistent-id');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Training plan not found');
    });
    it('should update a training plan', async () => {
        const postRes = await (0, supertest_1.default)(app).post('/api/training-plans').send(testTrainingPlan);
        const planId = postRes.body.id;
        const updatedName = 'Updated Test Plan';
        const putRes = await (0, supertest_1.default)(app)
            .put(`/api/training-plans/${planId}`)
            .send({ ...testTrainingPlan, id: planId, name: updatedName });
        expect(putRes.statusCode).toEqual(200);
        expect(putRes.body.name).toEqual(updatedName);
        const getRes = await (0, supertest_1.default)(app).get(`/api/training-plans/${planId}`);
        expect(getRes.body.name).toEqual(updatedName);
    });
    it('should return 404 if training plan to update not found', async () => {
        const res = await (0, supertest_1.default)(app)
            .put('/api/training-plans/nonexistent-id')
            .send({ name: 'Nonexistent' });
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Training plan not found');
    });
    it('should delete a training plan', async () => {
        const postRes = await (0, supertest_1.default)(app).post('/api/training-plans').send(testTrainingPlan);
        const planId = postRes.body.id;
        console.log('Plan created for delete test, ID:', planId); // Add this
        const deleteRes = await (0, supertest_1.default)(app).delete(`/api/training-plans/${planId}`);
        console.log('Delete response status:', deleteRes.statusCode); // Add this
        expect(deleteRes.statusCode).toEqual(204);
        const getRes = await (0, supertest_1.default)(app).get(`/api/training-plans/${planId}`);
        console.log('Get after delete status:', getRes.statusCode); // Add this
        expect(getRes.statusCode).toEqual(404);
    });
    it('should return 404 if training plan to delete not found', async () => {
        const res = await (0, supertest_1.default)(app).delete('/api/training-plans/nonexistent-id');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Training plan not found');
    });
});
