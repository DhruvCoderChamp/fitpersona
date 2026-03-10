import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    WorkoutPreferenceRequest, WorkoutPlanResponse,
    DashboardResponse, Exercise,
    DietPlanRequest, DietPlanResponse,
    WorkoutLogRequest, WorkoutLogResponse,
    UserProfile, UserProfileUpdateRequest,
    ProgressPhotoResponse, FeedbackRequest
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private baseUrl = '/api';

    constructor(private http: HttpClient) { }

    // Workout
    savePreferences(req: WorkoutPreferenceRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/workout/preferences`, req);
    }

    generatePlan(): Observable<WorkoutPlanResponse> {
        return this.http.post<WorkoutPlanResponse>(`${this.baseUrl}/workout/generate`, {});
    }

    getLatestPlan(): Observable<WorkoutPlanResponse> {
        return this.http.get<WorkoutPlanResponse>(`${this.baseUrl}/workout/plan`);
    }

    createManualPlan(req: any): Observable<WorkoutPlanResponse> {
        return this.http.post<WorkoutPlanResponse>(`${this.baseUrl}/workout/manual`, req);
    }

    getAllPlans(): Observable<WorkoutPlanResponse[]> {
        return this.http.get<WorkoutPlanResponse[]>(`${this.baseUrl}/workout/plans`);
    }

    toggleDay(dayId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/workout/day/${dayId}/toggle`, {});
    }

    logWorkout(req: WorkoutLogRequest): Observable<WorkoutLogResponse> {
        return this.http.post<WorkoutLogResponse>(`${this.baseUrl}/workout/log`, req);
    }

    getWorkoutHistory(date: string): Observable<WorkoutLogResponse[]> {
        return this.http.get<WorkoutLogResponse[]>(`${this.baseUrl}/workout/history?date=${date}`);
    }

    getExerciseProgress(exerciseId: number): Observable<WorkoutLogResponse[]> {
        return this.http.get<WorkoutLogResponse[]>(`${this.baseUrl}/workout/progress/${exerciseId}`);
    }

    getWorkoutDates(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/workout/dates`);
    }

    // Dashboard
    getDashboard(): Observable<DashboardResponse> {
        return this.http.get<DashboardResponse>(`${this.baseUrl}/dashboard`);
    }

    // Exercises
    getAllExercises(): Observable<Exercise[]> {
        return this.http.get<Exercise[]>(`${this.baseUrl}/exercises`);
    }

    createExercise(ex: any): Observable<Exercise> {
        return this.http.post<Exercise>(`${this.baseUrl}/exercises`, ex);
    }

    updateExercise(id: number, ex: any): Observable<Exercise> {
        return this.http.put<Exercise>(`${this.baseUrl}/exercises/${id}`, ex);
    }

    deleteExercise(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/exercises/${id}`);
    }

    // Diet Plan
    generateDietPlan(req: DietPlanRequest): Observable<DietPlanResponse> {
        return this.http.post<DietPlanResponse>(`${this.baseUrl}/diet/generate`, req);
    }

    // User Profile
    getUserProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.baseUrl}/user/profile`);
    }

    updateProfile(req: UserProfileUpdateRequest): Observable<UserProfile> {
        return this.http.put<UserProfile>(`${this.baseUrl}/user/profile`, req);
    }

    // Progress Photos
    getPhotos(): Observable<ProgressPhotoResponse[]> {
        return this.http.get<ProgressPhotoResponse[]>(`${this.baseUrl}/progress/photos`);
    }

    uploadPhoto(file: File, notes?: string): Observable<ProgressPhotoResponse> {
        const formData = new FormData();
        formData.append('file', file);
        if (notes) formData.append('notes', notes);
        return this.http.post<ProgressPhotoResponse>(`${this.baseUrl}/progress/photos/upload`, formData);
    }

    // Feedback
    submitFeedback(req: FeedbackRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/feedback`, req);
    }
}
