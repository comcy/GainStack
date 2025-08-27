import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Added for *ngFor, *ngIf
import { TrainingPlan, TrainingPlanService } from './training-plan.service'; // Import service and interface
import { FormsModule } from '@angular/forms'; // For ngModel

@Component({
  selector: 'app-root',
  standalone: true, // Ensure it's standalone
  imports: [RouterOutlet, CommonModule, FormsModule], // Added CommonModule and FormsModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'gain-stack-app';
  trainingPlans: TrainingPlan[] = [];
  newPlanName: string = '';
  newPlanDescription: string = '';

  constructor(private trainingPlanService: TrainingPlanService) { }

  ngOnInit(): void {
    this.loadTrainingPlans();
  }

  loadTrainingPlans(): void {
    this.trainingPlanService.getTrainingPlans().subscribe(plans => {
      this.trainingPlans = plans;
    });
  }

  createTrainingPlan(): void {
    const newPlan: TrainingPlan = { name: this.newPlanName, description: this.newPlanDescription };
    this.trainingPlanService.createTrainingPlan(newPlan).subscribe(plan => {
      this.trainingPlans.push(plan);
      this.newPlanName = '';
      this.newPlanDescription = '';
    });
  }

  deleteTrainingPlan(id: string | undefined): void {
    if (id) {
      this.trainingPlanService.deleteTrainingPlan(id).subscribe(() => {
        this.trainingPlans = this.trainingPlans.filter(p => p.id !== id);
      });
    }
  }
}