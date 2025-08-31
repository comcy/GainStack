import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { TrainingPlan, Workout } from 'domain';
import { TrainingPlanService } from 'training-plans-feature';
import { WorkoutService } from 'workouts-feature';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  activePlan$: Observable<TrainingPlan | null> | undefined;
  recentWorkouts$: Observable<Workout[]> | undefined;

  constructor(
    private trainingPlanService: TrainingPlanService,
    private workoutService: WorkoutService
  ) { }

  ngOnInit(): void {
    this.activePlan$ = this.trainingPlanService.getActiveTrainingPlan();
    this.recentWorkouts$ = this.workoutService.getRecentWorkouts(2);
  }

  startWorkout(): void {
    // Placeholder for starting a workout
    console.log('Starting a new workout...');
  }
}
