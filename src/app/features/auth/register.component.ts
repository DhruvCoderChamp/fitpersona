import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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

        <form (ngSubmit)="onSubmit(regForm)" #regForm="ngForm" novalidate>

          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name <span class="req">*</span></label>
              <input type="text" id="name" class="form-control"
                     placeholder="John Doe"
                     [(ngModel)]="form.name" name="name"
                     required minlength="2"
                     #name="ngModel"
                     [class.input-error]="name.invalid && name.touched">
              <span class="err-msg" *ngIf="name.invalid && name.touched">
                Please enter your full name (min 2 characters).
              </span>
            </div>

            <div class="form-group">
              <label for="email">Email <span class="req">*</span></label>
              <input type="email" id="email" class="form-control"
                     placeholder="your@email.com"
                     [(ngModel)]="form.email" name="email"
                     required email
                     #emailRef="ngModel"
                     [class.input-error]="emailRef.invalid && emailRef.touched">
              <span class="err-msg" *ngIf="emailRef.invalid && emailRef.touched">
                Please enter a valid email address.
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password <span class="req">*</span></label>
            <div class="pw-wrap">
              <input [type]="showPassword ? 'text' : 'password'"
                     id="password" class="form-control"
                     placeholder="Min 6 characters"
                     [(ngModel)]="form.password" name="password"
                     required minlength="6"
                     #pw="ngModel"
                     [class.input-error]="pw.invalid && pw.touched">
              <button type="button" class="pw-toggle" (click)="showPassword = !showPassword">
                {{showPassword ? '🙈' : '👁️'}}
              </button>
            </div>
            <span class="err-msg" *ngIf="pw.invalid && pw.touched">
              Password must be at least 6 characters.
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="age">Age <span class="optional">(optional)</span></label>
              <input type="number" id="age" class="form-control"
                     placeholder="25" min="10" max="100"
                     [(ngModel)]="form.age" name="age"
                     #ageRef="ngModel"
                     [class.input-error]="ageRef.invalid && ageRef.touched">
            </div>
            <div class="form-group">
              <label for="gender">Gender <span class="optional">(optional)</span></label>
              <select id="gender" class="form-control" [(ngModel)]="form.gender" name="gender">
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="height">Height (cm) <span class="optional">(optional)</span></label>
              <input type="number" id="height" class="form-control"
                     placeholder="175" min="100" max="250"
                     [(ngModel)]="form.height" name="height">
            </div>
            <div class="form-group">
              <label for="weight">Weight (kg) <span class="optional">(optional)</span></label>
              <input type="number" id="weight" class="form-control"
                     placeholder="70" min="30" max="300"
                     [(ngModel)]="form.weight" name="weight">
            </div>
          </div>

          <div class="strength-bar" *ngIf="form.password">
            <div class="strength-fill" [style.width.%]="passwordStrength" [attr.data-s]="strengthLabel"></div>
          </div>
          <span class="strength-label" *ngIf="form.password">Password strength: <strong>{{strengthLabel}}</strong></span>

          <button type="submit" class="btn btn-primary btn-full"
                  [disabled]="loading">
            <span *ngIf="!loading">🚀 Create Account</span>
            <span *ngIf="loading">⏳ Creating Account...</span>
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
      background: radial-gradient(circle at 50% 0%, rgba(0,230,118,0.05) 0%, transparent 60%);
    }
    .auth-card {
      width: 100%;
      max-width: 520px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .auth-header h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .auth-header p { color: var(--text-secondary); font-size: 0.9rem; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.1rem; }
    .form-group label {
      display: block; margin-bottom: 0.4rem;
      font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;
    }
    .req { color: #ff5252; }
    .optional { color: var(--text-muted); font-size: 0.75rem; font-weight: 400; }

    .form-control {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.8rem 1rem;
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
    .form-control option { color: #000; background: #fff; }
    .input-error { border-color: #ff5252 !important; }
    .err-msg { font-size: 0.75rem; color: #ff5252; margin-top: 0.3rem; display: block; }

    .pw-wrap { position: relative; }
    .pw-wrap .form-control { padding-right: 3rem; }
    .pw-toggle {
      position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0;
    }

    /* Password strength bar */
    .strength-bar {
      height: 4px; background: rgba(255,255,255,0.08);
      border-radius: 2px; margin: 0.5rem 0 0.25rem; overflow: hidden;
    }
    .strength-fill {
      height: 100%; border-radius: 2px; transition: width 0.4s;
    }
    .strength-fill[data-s="Weak"] { background: #ff5252; }
    .strength-fill[data-s="Fair"] { background: #ffa726; }
    .strength-fill[data-s="Good"] { background: #66bb6a; }
    .strength-fill[data-s="Strong"] { background: #00e676; }
    .strength-label { font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 1rem; }

    .btn-full { width: 100%; padding: 0.9rem; margin-top: 0.5rem; }
    .auth-footer {
      text-align: center; margin-top: 1.5rem;
      color: var(--text-secondary); font-size: 0.9rem;
    }
    .auth-footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
    .auth-footer a:hover { text-decoration: underline; }

    .alert { margin-bottom: 1rem; padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.9rem; }
    .alert-error { background: rgba(255,82,82,0.1); color: #ff5252; border: 1px solid rgba(255,82,82,0.25); }

    @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class RegisterComponent {
    @ViewChild('regForm') regForm!: NgForm;

    form: {
        name: string;
        email: string;
        password: string;
        age?: number;
        gender?: string;
        height?: number;
        weight?: number;
    } = {
        name: '',
        email: '',
        password: '',
        age: undefined,
        gender: '',
        height: undefined,
        weight: undefined
    };
    error = '';
    loading = false;
    showPassword = false;

    constructor(private auth: AuthService, private router: Router) { }

    get passwordStrength(): number {
        const p = this.form.password;
        if (!p) return 0;
        let score = 0;
        if (p.length >= 6) score += 25;
        if (p.length >= 10) score += 25;
        if (/[A-Z]/.test(p)) score += 25;
        if (/[0-9!@#$%^&*]/.test(p)) score += 25;
        return score;
    }

    get strengthLabel(): string {
        const s = this.passwordStrength;
        if (s <= 25) return 'Weak';
        if (s <= 50) return 'Fair';
        if (s <= 75) return 'Good';
        return 'Strong';
    }

    onSubmit(form: NgForm) {
        // Mark all fields as touched so validation messages appear
        Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());

        // ✅ Guard: don't call API if required fields are missing
        if (!this.form.name.trim() || !this.form.email.trim() || !this.form.password.trim()) {
            this.error = 'Please fill in all required fields (Name, Email, Password).';
            return;
        }
        if (form.invalid) {
            this.error = 'Please fix the highlighted errors before continuing.';
            return;
        }

        this.error = '';
        this.loading = true;

        this.auth.register(this.form).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/workout/preferences']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.error || err.error?.message || 'Registration failed. Please try again.';
            }
        });
    }
}
