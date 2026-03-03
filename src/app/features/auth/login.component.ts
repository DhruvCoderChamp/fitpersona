import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-page">
      <div class="auth-card animate-fade-in-up">
        <div class="auth-header">
          <span class="auth-icon">🏋️</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your FitAI account</p>
        </div>

        <div class="alert alert-error" *ngIf="error">{{error}}</div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" class="form-control" placeholder="your@email.com"
                   [(ngModel)]="email" name="email" required email>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Enter your password"
                   [(ngModel)]="password" name="password" required>
          </div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Create one</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: radial-gradient(circle at 50% 0%, rgba(0, 230, 118, 0.05) 0%, transparent 60%);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .auth-header h1 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    .btn-full { width: 100%; padding: 0.85rem; margin-top: 0.5rem; }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .auth-footer a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
    email = '';
    password = '';
    error = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit() {
        this.error = '';
        this.loading = true;
        this.auth.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.error || 'Login failed. Please check your credentials.';
            }
        });
    }
}
