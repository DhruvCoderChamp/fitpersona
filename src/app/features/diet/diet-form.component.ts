import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DietPlanRequest, DietPlanResponse } from '../../models/models';

@Component({
    selector: 'app-diet-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <h1 class="page-title animate-fade-in-up">🥗 Build Your <span class="gradient-text">Diet Plan</span></h1>
      <p class="page-subtitle animate-fade-in-up">Tell us about yourself and your nutrition goals</p>

      <div class="alert alert-error" *ngIf="error">{{error}}</div>

      <form (ngSubmit)="onSubmit()" class="diet-form animate-fade-in-up">

        <!-- Personal Info -->
        <div class="form-section">
          <h3 class="section-label">📋 Personal Information</h3>
          <div class="info-grid">
            <div class="form-group">
              <label for="age">Age</label>
              <input id="age" type="number" class="form-control" [(ngModel)]="form.age" name="age"
                     placeholder="e.g. 26" min="10" max="100">
            </div>
            <div class="form-group">
              <label for="height">Height (cm)</label>
              <input id="height" type="number" class="form-control" [(ngModel)]="form.height" name="height"
                     placeholder="e.g. 175" min="100" max="250">
            </div>
            <div class="form-group">
              <label for="weight">Weight (kg)</label>
              <input id="weight" type="number" class="form-control" [(ngModel)]="form.weight" name="weight"
                     placeholder="e.g. 72" min="30" max="300">
            </div>
          </div>
        </div>

        <!-- Gender -->
        <div class="form-section">
          <h3 class="section-label">Gender</h3>
          <div class="option-grid gender-grid">
            <div *ngFor="let g of genders"
                 class="option-card" [class.selected]="form.gender === g.value"
                 (click)="form.gender = g.value">
              <span class="option-icon">{{g.icon}}</span>
              <span class="option-name">{{g.label}}</span>
            </div>
          </div>
        </div>

        <!-- Activity Level -->
        <div class="form-section">
          <h3 class="section-label">🏃 Activity Level</h3>
          <div class="option-grid">
            <div *ngFor="let a of activityLevels"
                 class="option-card" [class.selected]="form.activityLevel === a.value"
                 (click)="form.activityLevel = a.value">
              <span class="option-icon">{{a.icon}}</span>
              <span class="option-name">{{a.label}}</span>
              <span class="option-desc">{{a.desc}}</span>
            </div>
          </div>
        </div>

        <!-- Fitness Goal -->
        <div class="form-section">
          <h3 class="section-label">🎯 Fitness Goal</h3>
          <div class="option-grid">
            <div *ngFor="let g of goals"
                 class="option-card" [class.selected]="form.goal === g.value"
                 (click)="form.goal = g.value">
              <span class="option-icon">{{g.icon}}</span>
              <span class="option-name">{{g.label}}</span>
              <span class="option-desc">{{g.desc}}</span>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-generate" [disabled]="loading || !isValid()">
          {{ loading ? 'Generating Your Plan...' : '⚡ Generate My Diet Plan' }}
        </button>
      </form>
    </div>
  `,
    styles: [`
    .diet-form { max-width: 800px; margin: 0 auto; }
    .form-section { margin-bottom: 2.5rem; }
    .section-label {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
    }
    .gender-grid { grid-template-columns: repeat(2, 1fr); }
    .option-card {
      background: var(--bg-card);
      border: 2px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    .option-card:hover {
      border-color: rgba(0, 230, 118, 0.3);
      transform: translateY(-2px);
    }
    .option-card.selected {
      border-color: var(--accent);
      background: rgba(0, 230, 118, 0.08);
      box-shadow: 0 0 20px rgba(0, 230, 118, 0.15);
    }
    .option-icon {
      display: block;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    .option-name {
      font-weight: 600;
      font-size: 0.9rem;
      display: block;
    }
    .option-desc {
      font-size: 0.72rem;
      color: var(--text-muted);
      display: block;
      margin-top: 0.3rem;
    }
    .btn-generate {
      margin-top: 1rem;
      padding: 1rem;
      font-size: 1.05rem;
    }
    .btn-full { width: 100%; }
    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @media (max-width: 600px) {
      .info-grid { grid-template-columns: 1fr; }
      .gender-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DietFormComponent {
    form: DietPlanRequest = {
        age: 25,
        gender: 'male',
        height: 175,
        weight: 70,
        activityLevel: 'MODERATE',
        goal: 'FAT_LOSS'
    };

    error = '';
    loading = false;

    genders = [
        { value: 'male', label: 'Male', icon: '👨' },
        { value: 'female', label: 'Female', icon: '👩' }
    ];

    activityLevels = [
        { value: 'SEDENTARY' as const, label: 'Sedentary', icon: '🪑', desc: 'Little or no exercise' },
        { value: 'MODERATE' as const, label: 'Moderate', icon: '🚶', desc: '3-5 days/week exercise' },
        { value: 'ACTIVE' as const, label: 'Active', icon: '🏋️', desc: '6-7 days/week intense' }
    ];

    goals = [
        { value: 'FAT_LOSS' as const, label: 'Fat Loss', icon: '🔥', desc: '~500 cal deficit/day' },
        { value: 'WEIGHT_GAIN' as const, label: 'Weight Gain', icon: '📈', desc: '~400 cal surplus/day' },
        { value: 'MUSCLE_GAIN' as const, label: 'Muscle Gain', icon: '💪', desc: 'High protein surplus' },
        { value: 'MAINTENANCE' as const, label: 'Maintenance', icon: '⚖️', desc: 'Maintain current weight' }
    ];

    constructor(private api: ApiService, private router: Router) { }

    isValid(): boolean {
        return !!this.form.gender && !!this.form.activityLevel && !!this.form.goal
            && this.form.age >= 10 && this.form.age <= 100
            && this.form.height >= 100 && this.form.height <= 250
            && this.form.weight >= 30 && this.form.weight <= 300;
    }

    onSubmit() {
        this.error = '';
        this.loading = true;

        this.api.generateDietPlan(this.form).subscribe({
            next: (plan) => {
                this.loading = false;
                // Store the plan in sessionStorage for the plan view
                sessionStorage.setItem('dietPlan', JSON.stringify(plan));
                this.router.navigate(['/diet/plan']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || err.error?.error || 'Failed to generate diet plan. Please try again.';
            }
        });
    }
}
