import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TrainingPlan {
  id?: string;
  name: string;
  description?: string;
  days?: {
    name: string;
    exercises: {
      exerciseId: string;
      sets: string;
      reps: string;
      name?: string;
    }[];
  }[];
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingPlanService {
  private apiUrl = '/api/training-plans'; // Use proxy for /api

  constructor(private http: HttpClient) { }

  getTrainingPlans(): Observable<TrainingPlan[]> {
    return this.http.get<TrainingPlan[]>(this.apiUrl);
  }

  getActiveTrainingPlan(): Observable<TrainingPlan> {
    return this.http.get<TrainingPlan>(`${this.apiUrl}/active`);
  }

  getTrainingPlan(id: string): Observable<TrainingPlan> {
    return this.http.get<TrainingPlan>(`${this.apiUrl}/${id}`);
  }

  createTrainingPlan(plan: TrainingPlan): Observable<TrainingPlan> {
    return this.http.post<TrainingPlan>(this.apiUrl, plan);
  }

  updateTrainingPlan(plan: TrainingPlan): Observable<TrainingPlan> {
    return this.http.put<TrainingPlan>(`${this.apiUrl}/${plan.id}`, plan);
  }

  activateTrainingPlan(id: string): Observable<TrainingPlan> {
    return this.http.patch<TrainingPlan>(`${this.apiUrl}/${id}/activate`, {});
  }

  deleteTrainingPlan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}