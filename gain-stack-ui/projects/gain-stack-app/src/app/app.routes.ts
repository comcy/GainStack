import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: () => import('dashboardRemote/Component').then(m => m.DashboardFeatureModule)
    },
    {
        path: 'exercises',
        loadChildren: () => import('exercisesRemote/Component').then(m => m.ExercisesFeatureModule)
    },
    {
        path: 'training-plans',
        loadChildren: () => import('trainingPlansRemote/Component').then(m => m.TrainingPlansFeatureModule)
    },
    {
        path: 'training-plans/:id',
        loadChildren: () => import('trainingPlansRemote/Component').then(m => m.TrainingPlanDetailModule) // Assuming TrainingPlanDetailComponent is exposed as a module
    },
    {
        path: 'workouts',
        loadChildren: () => import('workoutsRemote/Component').then(m => m.WorkoutsFeatureModule)
    },
    {
        path: 'analytics',
        loadChildren: () => import('analyticsRemote/Component').then(m => m.AnalyticsFeatureModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('settingsRemote/Component').then(m => m.SettingsFeatureModule)
    },
];
