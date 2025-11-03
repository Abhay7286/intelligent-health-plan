export interface UserData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  fitnessLevel: string;
  workoutLocation: string;
  dietaryPreference: string;
  medicalHistory?: string;
  stressLevel?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface WorkoutDay {
  day: number;
  focus: string;
  exercises: Exercise[];
}

export interface Meal {
  name: string;
  calories: number;
  items: string[];
}

export interface DailyMeals {
  day: number;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack1: Meal;
  snack2: Meal;
}

export interface FitnessPlan {
  workoutPlan: {
    weeklyPlan: WorkoutDay[];
  };
  dietPlan: {
    dailyCalories: number;
    dailyMacros: {
      protein: number;
      carbs: number;
      fats: number;
    };
    weeklyMeals: DailyMeals[];
  };
  tips: string[];
}
