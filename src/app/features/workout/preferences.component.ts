import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { WorkoutPreferenceRequest } from '../../models/models';

@Component({
    selector: 'app-preferences',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <h1 class="page-title">🎯 Build Your <span class="gradient-text">Workout Plan</span></h1>
      <p class="page-subtitle">Tell us about your goals and preferences</p>

      <div class="alert alert-error" *ngIf="error">{{error}}</div>
      <div class="alert alert-success" *ngIf="success">{{success}}</div>

      <form (ngSubmit)="onSubmit()" class="pref-form animate-fade-in-up">

        <div class="form-section">
          <h3 class="section-label">Fitness Level</h3>
          <div class="option-grid">
            <div *ngFor="let l of levels"
                 class="option-card" [class.selected]="form.level === l.value"
                 (click)="form.level = l.value">
              <span class="option-icon">{{l.icon}}</span>
              <span class="option-name">{{l.label}}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-label">Your Goal</h3>
          <div class="option-grid">
            <div *ngFor="let g of goals"
                 class="option-card" [class.selected]="form.goal === g.value"
                 (click)="form.goal = g.value">
              <span class="option-icon">{{g.icon}}</span>
              <span class="option-name">{{g.label}}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-label">Days Per Week</h3>
          <div class="option-grid days-grid">
            <div *ngFor="let d of [3,4,5,6]"
                 class="option-card small" [class.selected]="form.daysPerWeek === d"
                 (click)="form.daysPerWeek = d">
              <span class="option-name">{{d}} Days</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-label">Equipment</h3>
          <div class="option-grid">
            <div *ngFor="let e of equipment"
                 class="option-card" [class.selected]="form.equipment === e.value"
                 (click)="form.equipment = e.value">
              <span class="option-icon">{{e.icon}}</span>
              <span class="option-name">{{e.label}}</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-label">Target Muscle Groups</h3>
          <div class="option-grid muscle-grid">
            <div *ngFor="let m of muscles"
                 class="option-card" [class.selected]="isMuscleSelected(m.value)"
                 (click)="toggleMuscle(m.value)">
              <span class="option-icon">{{m.icon}}</span>
              <span class="option-name">{{m.label}}</span>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-full btn-generate" [disabled]="loading || !isValid()">
          {{ loading ? 'Generating Plan...' : '⚡ Generate My Workout Plan' }}
        </button>
      </form>
    </div>
  `,
    styles: [`
    .pref-form { max-width: 800px; margin: 0 auto; }
    .form-section { margin-bottom: 2.5rem; }
    .section-label {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }
    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.75rem;
    }
    .days-grid { grid-template-columns: repeat(4, 1fr); }
    .muscle-grid { grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); }
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
    .option-card.small { padding: 1rem; }
    .option-icon {
      display: block;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    .option-name {
      font-weight: 600;
      font-size: 0.85rem;
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
      .days-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class PreferencesComponent {
    form: WorkoutPreferenceRequest = {
        level: 'INTERMEDIATE',
        goal: 'MUSCLE_GAIN',
        daysPerWeek: 4,
        equipment: 'GYM',
        targetMuscleGroups: ['CHEST', 'BACK', 'LEGS', 'SHOULDERS']
    };

    error = '';
    success = '';
    loading = false;

    levels = [
        { value: 'BEGINNER' as const, label: 'Beginner', icon: '🌱' },
        { value: 'INTERMEDIATE' as const, label: 'Intermediate', icon: '🔥' },
        { value: 'PROFESSIONAL' as const, label: 'Professional', icon: '🏆' }
    ];

    goals = [
        { value: 'MUSCLE_GAIN' as const, label: 'Muscle Gain', icon: '💪' },
        { value: 'FAT_LOSS' as const, label: 'Fat Loss', icon: '🔥' },
        { value: 'STRENGTH' as const, label: 'Strength', icon: '🏋️' },
        { value: 'ENDURANCE' as const, label: 'Endurance', icon: '🏃' }
    ];

    equipment = [
        { value: 'GYM' as const, label: 'Gym', icon: '🏢' },
        { value: 'HOME' as const, label: 'Home', icon: '🏠' },
        { value: 'NO_EQUIPMENT' as const, label: 'No Equipment', icon: '🤸' }
    ];

    muscles = [
        { value: 'CHEST', label: 'Chest', icon: '🫁' },
        { value: 'BACK', label: 'Back', icon: '🔙' },
        { value: 'LEGS', label: 'Legs', icon: '🦵' },
        { value: 'SHOULDERS', label: 'Shoulders', icon: '🏔️' },
        { value: 'BICEPS', label: 'Biceps', icon: '💪' },
        { value: 'TRICEPS', label: 'Triceps', icon: '🦾' },
        { value: 'CORE', label: 'Core', icon: '🎯' }
    ];

    constructor(private api: ApiService, private router: Router) { }

    isMuscleSelected(value: string): boolean {
        return this.form.targetMuscleGroups.includes(value);
    }

    toggleMuscle(value: string) {
        const idx = this.form.targetMuscleGroups.indexOf(value);
        if (idx >= 0) {
            this.form.targetMuscleGroups.splice(idx, 1);
        } else {
            this.form.targetMuscleGroups.push(value);
        }
    }

    isValid(): boolean {
        return !!this.form.level && !!this.form.goal && !!this.form.equipment
            && this.form.daysPerWeek >= 3 && this.form.targetMuscleGroups.length > 0;
    }

    onSubmit() {
        this.error = '';
        this.success = '';
        this.loading = true;

        this.api.savePreferences(this.form).subscribe({
            next: () => {
                this.api.generatePlan().subscribe({
                    next: () => {
                        this.loading = false;
                        this.router.navigate(['/workout/plan']);
                    },
                    error: (err) => {
                        this.loading = false;
                        this.error = err.error?.error || 'Failed to generate plan.';
                    }
                });
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.error || 'Failed to save preferences.';
            }
        });
    }
}
