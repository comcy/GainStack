"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const workoutRoutes_1 = __importDefault(require("../src/routes/workoutRoutes"));
const dataHandler_1 = require("../src/utils/dataHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/workouts', workoutRoutes_1.default);
describe('Workouts API', () => {
    let testExerciseId;
    beforeAll(async () => {
        // Create a dummy exercise for workout tests
        const dummyExercise = {
            id: 'test-exercise-123',
            name: 'Dummy Test Exercise',
            description: 'For workout tests',
            muscleGroups: ['Test'],
            equipmentType: 'other'
        };
        await fs_1.promises.writeFile(dataHandler_1.exercisesFilePath, JSON.stringify([dummyExercise], null, 2), 'utf-8');
        testExerciseId = dummyExercise.id;
    });
    const testWorkout = {
        date: '2025-01-01',
        exercisesPerformed: [
            {
                exerciseId: 'test-exercise-123',
                sets: [{ reps: 10, weight: 100 }, { reps: 8, weight: 110 }]
            }
        ]
    };
    it('should create a new workout', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/workouts')
            .send(testWorkout);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.date).toEqual(testWorkout.date);
        expect(res.body.exercisesPerformed[0].exerciseId).toEqual(testExerciseId);
    });
    it('should get all workouts', async () => {
        await (0, supertest_1.default)(app).post('/api/workouts').send(testWorkout);
        const res = await (0, supertest_1.default)(app).get('/api/workouts');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].date).toEqual(testWorkout.date);
    });
    it('should get a workout by ID', async () => {
        const postRes = await (0, supertest_1.default)(app).post('/api/workouts').send(testWorkout);
        const workoutId = postRes.body.id;
        const getRes = await (0, supertest_1.default)(app).get(`/api/workouts/${workoutId}`);
        expect(getRes.statusCode).toEqual(200);
        expect(getRes.body.id).toEqual(workoutId);
        expect(getRes.body.date).toEqual(testWorkout.date);
    });
    it('should return 404 if workout not found', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/workouts/nonexistent-id');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Workout not found');
    });
    it('should update a workout', async () => {
        const postRes = await (0, supertest_1.default)(app).post('/api/workouts').send(testWorkout);
        const workoutId = postRes.body.id;
        const updatedDate = '2025-01-02';
        const putRes = await (0, supertest_1.default)(app)
            .put(`/api/workouts/${workoutId}`)
            .send({ ...testWorkout, id: workoutId, date: updatedDate });
        expect(putRes.statusCode).toEqual(200);
        expect(putRes.body.date).toEqual(updatedDate);
        const getRes = await (0, supertest_1.default)(app).get(`/api/workouts/${workoutId}`);
        expect(getRes.body.date).toEqual(updatedDate);
    });
    it('should return 404 if workout to update not found', async () => {
        const res = await (0, supertest_1.default)(app)
            .put('/api/workouts/nonexistent-id')
            .send({ date: 'Nonexistent' });
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Workout not found');
    });
    it('should delete a workout', async () => {
        const postRes = await (0, supertest_1.default)(app).post('/api/workouts').send(testWorkout);
        const workoutId = postRes.body.id;
        const deleteRes = await (0, supertest_1.default)(app).delete(`/api/workouts/${workoutId}`);
        expect(deleteRes.statusCode).toEqual(204);
        const getRes = await (0, supertest_1.default)(app).get(`/api/workouts/${workoutId}`);
        expect(getRes.statusCode).toEqual(404);
    });
    it('should return 404 if workout to delete not found', async () => {
        const res = await (0, supertest_1.default)(app).delete('/api/workouts/nonexistent-id');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('Workout not found');
    });
});
