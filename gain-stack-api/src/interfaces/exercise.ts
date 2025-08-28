export interface Exercise {
  id?: string;
  name: string;
  description?: string;
  muscleGroups?: string[];
  equipmentType?: 'free weights' | 'machine' | 'bodyweight' | 'other';
}