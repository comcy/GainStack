import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit {
  exercises$: Observable<Exercise[]> | undefined;
  showForm = false;
  exerciseForm: FormGroup;
  editingExerciseId: string | null = null;

  equipmentTypes = ['free weights', 'machine', 'bodyweight', 'other'];

  constructor(
    private exerciseService: ExerciseService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.exerciseForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      muscleGroups: [[]],
      equipmentType: ['']
    });
  }

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.exercises$ = this.exerciseService.getExercises();
  }

  toggleForm(exercise?: Exercise): void {
    this.showForm = !this.showForm;
    if (this.showForm && exercise) {
      this.editingExerciseId = exercise.id || null;
      this.exerciseForm.patchValue(exercise);
    } else {
      this.editingExerciseId = null;
      this.exerciseForm.reset();
    }
  }

  saveExercise(): void {
    if (this.exerciseForm.invalid) {
      return;
    }

    const exercise: Exercise = this.exerciseForm.value;

    if (this.editingExerciseId) {
      // Update existing exercise
      this.exerciseService.updateExercise(exercise).subscribe(() => {
        this.snackBar.open('Übung aktualisiert', 'Schließen', { duration: 3000 });
        this.loadExercises();
        this.toggleForm();
      });
    } else {
      // Create new exercise
      this.exerciseService.createExercise(exercise).subscribe(() => {
        this.snackBar.open('Übung erstellt', 'Schließen', { duration: 3000 });
        this.loadExercises();
        this.toggleForm();
      });
    }
  }

  deleteExercise(id: string | undefined): void {
    if (!id) return;
    this.exerciseService.deleteExercise(id).subscribe(() => {
      this.snackBar.open('Übung gelöscht', 'Schließen', { duration: 3000 });
      this.loadExercises();
    });
  }

  cancelEdit(): void {
    this.toggleForm();
  }

  onMuscleGroupsInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const muscleGroups = inputElement.value.split(',').map(s => s.trim());
    this.exerciseForm.get('muscleGroups')?.setValue(muscleGroups);
  }
}
