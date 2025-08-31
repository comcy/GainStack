import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-exercise-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule
  ],
  templateUrl: './exercise-selection-dialog.component.html',
  styleUrls: ['./exercise-selection-dialog.component.scss']
})
export class ExerciseSelectionDialogComponent implements OnInit {
  allExercises$: Observable<Exercise[]> | undefined;
  selectedExerciseIds: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ExerciseSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedExercises: string[] },
    private exerciseService: ExerciseService
  ) {
    this.selectedExerciseIds = [...data.selectedExercises];
  }

  ngOnInit(): void {
    this.allExercises$ = this.exerciseService.getExercises();
  }

  onSelectionChange(event: MatSelectionListChange): void {
    this.selectedExerciseIds = event.source.selectedOptions.selected.map(option => option.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.selectedExerciseIds);
  }
}
