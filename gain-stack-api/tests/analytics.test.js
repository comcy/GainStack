"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const analyticsRoutes_1 = __importDefault(require("../src/routes/analyticsRoutes"));
const dataHandler_1 = require("../src/utils/dataHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/analytics', analyticsRoutes_1.default);
describe('Analytics API', () => {
    let exerciseId1;
    let exerciseId2;
    beforeAll(async () => {
        // Create dummy exercises
        const dummyExercises = [
            { id: 'analytics-ex-1', name: 'Analytics Exercise 1' },
            { id: 'analytics-ex-2', name: 'Analytics Exercise 2' }
        ];
        await fs_1.promises.writeFile(dataHandler_1.exercisesFilePath, JSON.stringify(dummyExercises, null, 2), 'utf-8');
        exerciseId1 = dummyExercises[0].id;
        exerciseId2 = dummyExercises[1].id;
        // Create dummy workouts
        const dummyWorkouts = [
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
        await fs_1.promises.writeFile(dataHandler_1.workoutsFilePath, JSON.stringify(dummyWorkouts, null, 2), 'utf-8');
    });
    it('should get historical performance for a specific exercise', async () => {
        console.log('Running analytics test for exerciseId1:', exerciseId1);
        const res = await (0, supertest_1.default)(app).get(`/api/analytics/exercise/${exerciseId1}/history`);
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
        const res = await (0, supertest_1.default)(app).get('/api/analytics/exercise/nonexistent-id/history');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
});
