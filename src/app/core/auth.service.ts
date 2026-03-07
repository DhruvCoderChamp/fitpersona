import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';
    private tokenKey = 'fitai_token';
    private userKey = 'fitai_user';

    private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
            tap(res => this.storeAuth(res))
        );
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(res => this.storeAuth(res))
        );
    }

    getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
    }

    updateProfile(request: RegisterRequest): Observable<UserProfile> {
        return this.http.put<UserProfile>(`${this.apiUrl}/profile`, request);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        const user = this.getStoredUser();
        return user?.role === 'ADMIN';
    }

    private storeAuth(res: AuthResponse): void {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res));
        this.currentUserSubject.next(res);
    }

    private getStoredUser(): AuthResponse | null {
        const data = localStorage.getItem(this.userKey);
        return data ? JSON.parse(data) : null;
    }
}
