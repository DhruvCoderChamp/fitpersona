import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProgress, UserProgressRequest } from '../../models/user-progress.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserProgressService {
    private apiUrl = `${environment.apiUrl}/progress`;

    constructor(private http: HttpClient) { }

    logProgress(request: UserProgressRequest): Observable<UserProgress> {
        return this.http.post<UserProgress>(this.apiUrl, request);
    }

    getProgress(): Observable<UserProgress[]> {
        return this.http.get<UserProgress[]>(this.apiUrl);
    }
}
