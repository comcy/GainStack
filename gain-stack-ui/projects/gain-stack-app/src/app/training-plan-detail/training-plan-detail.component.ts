import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Observable, switchMap } from 'rxjs';
import { TrainingPlan, TrainingPlanService } from '../training-plan.service';
import { Exercise } from '../exercise';
import { ExerciseService } from '../exercise.service';
import { ExerciseSelectionDialogComponent } from '../exercise-selection-dialog/exercise-selection-dialog.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training-plan-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatListModule
  ],
  templateUrl: './training-plan-detail.component.html',
  styleUrls: ['./training-plan-detail.component.scss']
})
export class TrainingPlanDetailComponent implements OnInit {
  trainingPlan$: Observable<TrainingPlan> | undefined;
  trainingPlan: TrainingPlan | undefined;
  dayForm: FormGroup;
  showDayForm = false;
  editingDayIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingPlanService: TrainingPlanService,
    private exerciseService: ExerciseService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.dayForm = this.fb.group({
      name: ['', Validators.required],
      exercises: [[]]
    });
  }

  ngOnInit(): void {
    this.trainingPlan$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.trainingPlanService.getTrainingPlan(id);
        } else {
          // Handle case where ID is not present (e.g., navigate back or show error)
          throw new Error('Training Plan ID not found');
        }
      })
    );

    this.trainingPlan$.subscribe(plan => {
      this.trainingPlan = plan;
    });

    // Subscribe to query params for deep linking
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'add-day') {
        this.showDayForm = true;
      }
    });
  }

  toggleDayForm(day?: { name: string; exercises: any[] }, index?: number): void {
    this.showDayForm = !this.showDayForm;
    if (this.showDayForm) {
      // Add query param
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { action: 'add-day' },
        queryParamsHandling: 'merge' // Keep existing query params
      });
      if (day && index !== undefined) {
        this.editingDayIndex = index;
        this.dayForm.patchValue(day);
      } else {
        this.editingDayIndex = null;
        this.dayForm.reset();
      }
    } else {
      // Remove query param
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { action: null }, // Set action to null to remove it
        queryParamsHandling: 'merge'
      });
      this.editingDayIndex = null;
      this.dayForm.reset();
    }
  }

  saveDay(): void {
    if (this.dayForm.invalid || !this.trainingPlan) {
      return;
    }

    const newDay = this.dayForm.value;

    if (this.editingDayIndex !== null) {
      // Update existing day
      this.trainingPlan.days![this.editingDayIndex] = newDay;
    } else {
      // Add new day
      if (!this.trainingPlan.days) {
        this.trainingPlan.days = [];
      }
      this.trainingPlan.days.push(newDay);
    }

    this.updateTrainingPlan();
    // Do not call toggleDayForm here, it's called by updateTrainingPlan's subscription
  }

  deleteDay(index: number): void {
    if (!this.trainingPlan || !this.trainingPlan.days) return;
    this.trainingPlan.days.splice(index, 1);
    this.updateTrainingPlan();
  }

  addExerciseToDay(dayIndex: number): void {
    if (!this.trainingPlan || !this.trainingPlan.days) return;

    const dialogRef = this.dialog.open(ExerciseSelectionDialogComponent, {
      width: '400px',
      data: { selectedExercises: this.trainingPlan.days[dayIndex].exercises.map(e => e.exerciseId) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Result is an array of selected exercise IDs
        // You need to fetch the full exercise objects or just store IDs
        // For now, let's assume we store IDs and some basic info
        const selectedExerciseIds: string[] = result;
        this.exerciseService.getExercises().subscribe(allExercises => {
          const exercisesForDay = selectedExerciseIds.map(id => {
            const exercise = allExercises.find(ex => ex.id === id);
            return { exerciseId: id, sets: '', reps: '', name: exercise?.name || '' }; // Add name for display
          });
          this.trainingPlan!.days![dayIndex].exercises = exercisesForDay;
          this.updateTrainingPlan();
        });
      }
    });
  }

  removeExerciseFromDay(dayIndex: number, exerciseIndex: number): void {
    if (!this.trainingPlan || !this.trainingPlan.days) return;
    this.trainingPlan.days[dayIndex].exercises.splice(exerciseIndex, 1);
    this.updateTrainingPlan();
  }

  updateTrainingPlan(): void {
    if (!this.trainingPlan) return;
    this.trainingPlanService.updateTrainingPlan(this.trainingPlan).subscribe(() => {
      this.snackBar.open('Trainingsplan aktualisiert', 'Schließen', { duration: 3000 });
      // Re-fetch the training plan to ensure the local object is updated
      // This will trigger the trainingPlan$ observable to emit a new value
      // and update the template.
      this.route.paramMap.pipe(
        switchMap(params => {
          const id = params.get('id');
          if (id) {
            return this.trainingPlanService.getTrainingPlan(id);
          } else {
            throw new Error('Training Plan ID not found');
          }
        })
      ).subscribe(plan => {
        this.trainingPlan = plan;
        // Close the form after successful update and re-fetch
        this.toggleDayForm(); // This will also remove the query param
      });
    });
  }
}
