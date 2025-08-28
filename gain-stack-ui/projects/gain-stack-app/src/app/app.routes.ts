import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { TrainingPlansComponent } from './training-plans/training-plans.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SettingsComponent } from './settings/settings.component';
import { TrainingPlanDetailComponent } from './training-plan-detail/training-plan-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'exercises', component: ExercisesComponent },
    { path: 'training-plans', component: TrainingPlansComponent },
    { path: 'training-plans/:id', component: TrainingPlanDetailComponent },
    { path: 'workouts', component: WorkoutsComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: 'settings', component: SettingsComponent },
];
