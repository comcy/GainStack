import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { TrainingPlan, TrainingPlanService } from '../training-plan.service';

@Component({
  selector: 'app-training-plans',
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
    MatDatepickerModule
  ],
  templateUrl: './training-plans.component.html',
  styleUrls: ['./training-plans.component.scss']
})
export class TrainingPlansComponent implements OnInit {
  trainingPlans$: Observable<TrainingPlan[]> | undefined;
  showCreateForm = false;
  newPlanForm: FormGroup;

  constructor(
    private trainingPlanService: TrainingPlanService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.newPlanForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadTrainingPlans();
  }

  loadTrainingPlans(): void {
    this.trainingPlans$ = this.trainingPlanService.getTrainingPlans();
  }

  activatePlan(id: string | undefined): void {
    if (!id) return;
    this.trainingPlanService.activateTrainingPlan(id).subscribe(() => {
      this.snackBar.open('Trainingsplan aktiviert', 'Schließen', { duration: 3000 });
      this.loadTrainingPlans(); // Reload to reflect the change in isActive status
    });
  }

  deletePlan(id: string | undefined): void {
    if (!id) return;
    this.trainingPlanService.deleteTrainingPlan(id).subscribe(() => {
      this.snackBar.open('Trainingsplan gelöscht', 'Schließen', { duration: 3000 });
      this.loadTrainingPlans(); // Reload the list
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  createPlan(): void {
    if (this.newPlanForm.invalid) {
      return;
    }

    this.trainingPlanService.createTrainingPlan(this.newPlanForm.value).subscribe(() => {
      this.snackBar.open('Trainingsplan erstellt', 'Schließen', { duration: 3000 });
      this.loadTrainingPlans();
      this.showCreateForm = false;
      this.newPlanForm.reset();
    });
  }
}
