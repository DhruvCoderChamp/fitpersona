import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    WorkoutPreferenceRequest, WorkoutPlanResponse,
    DashboardResponse, Exercise
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

    getAllPlans(): Observable<WorkoutPlanResponse[]> {
        return this.http.get<WorkoutPlanResponse[]>(`${this.baseUrl}/workout/plans`);
    }

    toggleDay(dayId: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/workout/day/${dayId}/toggle`, {});
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
}
