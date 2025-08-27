import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TrainingPlan {
  id?: string;
  name: string;
  description?: string;
  // Add other properties as needed, e.g., exercises: Exercise[];
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

  getTrainingPlan(id: string): Observable<TrainingPlan> {
    return this.http.get<TrainingPlan>(`${this.apiUrl}/${id}`);
  }

  createTrainingPlan(plan: TrainingPlan): Observable<TrainingPlan> {
    return this.http.post<TrainingPlan>(this.apiUrl, plan);
  }

  updateTrainingPlan(plan: TrainingPlan): Observable<TrainingPlan> {
    return this.http.put<TrainingPlan>(`${this.apiUrl}/${plan.id}`, plan);
  }

  deleteTrainingPlan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}