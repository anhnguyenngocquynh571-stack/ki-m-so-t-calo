export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  category: 'vietnamese_main' | 'vietnamese_noodles' | 'healthy_staple' | 'protein_rich' | 'fruit_snack' | 'beverage' | 'street_food';
  categoryLabel: string;
  servingUnit: string;
  servingWeightGrams?: number;
  calories: number; // kcal
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  fiber?: number;   // grams
  isCustom?: boolean;
  emoji?: string;
}

export interface LoggedMealItem {
  id: string;
  foodId: string;
  name: string;
  servingAmount: number;
  servingUnit: string;
  baseCalories: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealType;
  loggedAt: string;
  emoji?: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'daily_activity' | 'sports';
  met: number; // Metabolic Equivalent of Task
  description?: string;
  iconName?: string;
}

export interface LoggedExercise {
  id: string;
  exerciseId: string;
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  loggedAt: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type CalorieGoal = 'lose_fast' | 'lose_slow' | 'maintain' | 'gain_muscle';

export interface UserProfile {
  gender: 'male' | 'female';
  age: number;
  height: number; // cm
  weight: number; // kg
  targetWeight?: number;
  activityLevel: ActivityLevel;
  goal: CalorieGoal;
  bmr: number;
  tdee: number;
  calorieTarget: number;
  carbTargetGrams: number;
  proteinTargetGrams: number;
  fatTargetGrams: number;
  waterTargetMl: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: {
    breakfast: LoggedMealItem[];
    lunch: LoggedMealItem[];
    dinner: LoggedMealItem[];
    snack: LoggedMealItem[];
  };
  exercises: LoggedExercise[];
  waterIntakeMl: number;
  weightRecord?: number;
  notes?: string;
}
