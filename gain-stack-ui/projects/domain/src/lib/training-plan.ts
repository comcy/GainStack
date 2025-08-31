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
