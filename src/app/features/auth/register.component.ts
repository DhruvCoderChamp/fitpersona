import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-page">
      <div class="auth-card animate-fade-in-up">
        <div class="auth-header">
          <span class="auth-icon">💪</span>
          <h1>Create Account</h1>
          <p>Start your fitness journey today</p>
        </div>

        <div class="alert alert-error" *ngIf="error">{{error}}</div>

        <form (ngSubmit)="onSubmit()" #regForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" class="form-control" placeholder="John Doe"
                     [(ngModel)]="form.name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" placeholder="your@email.com"
                     [(ngModel)]="form.email" name="email" required email>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Min 6 characters"
                   [(ngModel)]="form.password" name="password" required minlength="6">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="age">Age</label>
              <input type="number" id="age" class="form-control" placeholder="25"
                     [(ngModel)]="form.age" name="age">
            </div>
            <div class="form-group">
              <label for="gender">Gender</label>
              <select id="gender" class="form-control" [(ngModel)]="form.gender" name="gender">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="height">Height (cm)</label>
              <input type="number" id="height" class="form-control" placeholder="175"
                     [(ngModel)]="form.height" name="height">
            </div>
            <div class="form-group">
              <label for="weight">Weight (kg)</label>
              <input type="number" id="weight" class="form-control" placeholder="70"
                     [(ngModel)]="form.weight" name="weight">
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
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
      max-width: 500px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .auth-header h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
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
    @media (max-width: 500px) {
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
    form = { name: '', email: '', password: '', age: null as any, gender: '', height: null as any, weight: null as any };
    error = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit() {
        this.error = '';
        this.loading = true;
        this.auth.register(this.form).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/workout/preferences']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.error || 'Registration failed.';
            }
        });
    }
}
