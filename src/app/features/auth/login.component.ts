import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
          <span class="auth-icon">⚡</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your FitPersona account</p>
        </div>

        <div class="alert alert-error" *ngIf="error">{{error}}</div>

        <form (ngSubmit)="onSubmit(loginForm)" #loginForm="ngForm" novalidate>

          <div class="form-group">
            <label for="email">Email <span class="req">*</span></label>
            <input type="email" id="email" class="form-control"
                   placeholder="your@email.com"
                   [(ngModel)]="email" name="email"
                   required email
                   #emailRef="ngModel"
                   [class.input-error]="emailRef.invalid && emailRef.touched">
            <span class="err-msg" *ngIf="emailRef.invalid && emailRef.touched">
              Please enter a valid email address.
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password <span class="req">*</span></label>
            <div class="pw-wrap">
              <input [type]="showPassword ? 'text' : 'password'"
                     id="password" class="form-control"
                     placeholder="Enter your password"
                     [(ngModel)]="password" name="password"
                     required
                     #pw="ngModel"
                     [class.input-error]="pw.invalid && pw.touched">
              <button type="button" class="pw-toggle" (click)="showPassword = !showPassword">
                {{showPassword ? '🙈' : '👁️'}}
              </button>
            </div>
            <span class="err-msg" *ngIf="pw.invalid && pw.touched">
              Password is required.
            </span>
          </div>

          <button type="submit" class="btn btn-primary btn-full"
                  [disabled]="loading">
            <span *ngIf="!loading">🔐 Sign In</span>
            <span *ngIf="loading">⏳ Signing in...</span>
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Create one free</a>
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
      background: radial-gradient(circle at 50% 0%, rgba(0,230,118,0.05) 0%, transparent 60%);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .auth-header h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }

    .form-group { margin-bottom: 1.25rem; }
    .form-group label {
      display: block; margin-bottom: 0.4rem;
      font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;
    }
    .req { color: #ff5252; }

    .form-control {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.85rem 1rem;
      color: white;
      transition: all 0.3s;
      box-sizing: border-box;
      font-size: 0.9rem;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--accent);
      background: rgba(255,255,255,0.08);
      box-shadow: 0 0 0 2px rgba(0,230,118,0.1);
    }
    .input-error { border-color: #ff5252 !important; }
    .err-msg { font-size: 0.75rem; color: #ff5252; margin-top: 0.3rem; display: block; }

    .pw-wrap { position: relative; }
    .pw-wrap .form-control { padding-right: 3rem; }
    .pw-toggle {
      position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0;
    }

    .btn-full { width: 100%; padding: 0.9rem; margin-top: 0.25rem; font-size: 1rem; }
    .auth-footer {
      text-align: center; margin-top: 1.5rem;
      color: var(--text-secondary); font-size: 0.9rem;
    }
    .auth-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
    .auth-footer a:hover { text-decoration: underline; }

    .alert { margin-bottom: 1rem; padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.9rem; }
    .alert-error { background: rgba(255,82,82,0.1); color: #ff5252; border: 1px solid rgba(255,82,82,0.25); }
  `]
})
export class LoginComponent {
    @ViewChild('loginForm') loginForm!: NgForm;

    email = '';
    password = '';
    error = '';
    loading = false;
    showPassword = false;

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit(form: NgForm) {
        // Mark all as touched so error messages appear immediately
        Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());

        // ✅ Guard: block API call if required fields are empty
        if (!this.email.trim() || !this.password.trim()) {
            this.error = 'Please enter your email and password.';
            return;
        }
        if (form.invalid) {
            this.error = 'Please enter a valid email address.';
            return;
        }

        this.error = '';
        this.loading = true;

        this.auth.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.error || err.error?.message || 'Login failed. Please check your credentials.';
            }
        });
    }
}
