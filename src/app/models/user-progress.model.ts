export interface UserProgress {
    id?: number;
    weight: number;
    caloriesBurned: number;
    workoutsCompleted: number;
    date: string;
}

export interface UserProgressRequest {
    weight: number;
    caloriesBurned: number;
    workoutsCompleted: number;
    date?: string;
}
