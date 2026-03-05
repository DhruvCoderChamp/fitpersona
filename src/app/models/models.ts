export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
}

export interface AuthResponse {
    token: string;
    email: string;
    name: string;
    role: string;
    userId: number;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    role: string;
}

export interface WorkoutPreferenceRequest {
    level: 'BEGINNER' | 'INTERMEDIATE' | 'PROFESSIONAL';
    goal: 'MUSCLE_GAIN' | 'FAT_LOSS' | 'STRENGTH' | 'ENDURANCE';
    daysPerWeek: number;
    equipment: 'GYM' | 'HOME' | 'NO_EQUIPMENT';
    targetMuscleGroups: string[];
}

export interface WorkoutPlanResponse {
    id: number;
    planName: string;
    generatedDate: string;
    warmupSuggestion: string;
    cooldownSuggestion: string;
    days: WorkoutDayResponse[];
}

export interface WorkoutDayResponse {
    id: number;
    dayNumber: number;
    muscleGroupLabel: string;
    completed: boolean;
    exercises: WorkoutExerciseResponse[];
}

export interface WorkoutExerciseResponse {
    id: number;
    exerciseName: string;
    muscleGroup: string;
    difficulty: string;
    description: string;
    sets: number;
    reps: number;
    restTimeSeconds: number;
}

export interface DashboardResponse {
    bmi: number;
    bmiCategory: string;
    height: number;
    weight: number;
    totalWorkoutDays: number;
    completedDays: number;
    completionPercentage: number;
    estimatedCaloriesBurned: number;
    waterIntakeLiters: number;
    userName: string;
}

export interface Exercise {
    id: number;
    name: string;
    muscleGroup: string;
    difficulty: string;
    equipment: string;
    description: string;
    defaultSets: number;
    defaultReps: number;
    defaultRestSeconds: number;
}

export interface DietPlanRequest {
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: 'SEDENTARY' | 'MODERATE' | 'ACTIVE';
    goal: 'FAT_LOSS' | 'WEIGHT_GAIN' | 'MUSCLE_GAIN' | 'MAINTENANCE';
}

export interface DietPlanResponse {
    dailyCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
    goal: string;
    days: DietDayResponse[];
}

export interface DietDayResponse {
    dayNumber: number;
    dayName: string;
    meals: MealResponse[];
}

export interface MealResponse {
    mealType: string;
    description: string;
    calories: number;
    items: string[];
}
