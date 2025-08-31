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
