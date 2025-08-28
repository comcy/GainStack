import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Workout {
  id?: string;
  date: string;
  trainingPlanId?: string;
  exercisesPerformed: {
    exerciseId: string;
    sets: {
      reps: number;
      weight: number;
      notes?: string;
    }[];
    notes?: string;
  }[];
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = '/api/workouts'; // Use proxy for /api

  constructor(private http: HttpClient) { }

  getWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(this.apiUrl);
  }

  getRecentWorkouts(limit: number = 2): Observable<Workout[]> {
    return this.http.get<Workout[]>(this.apiUrl).pipe(
      map(workouts => workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit))
    );
  }
}