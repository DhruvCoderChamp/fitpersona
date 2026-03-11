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

        <!-- ── STEP 1: Gender Selection ── -->
        <div class="form-section">
          <h3 class="section-label">👤 I am a...</h3>
          <div class="gender-grid">
            <div class="gender-card" [class.selected]="form.gender === 'MALE'" (click)="selectGender('MALE')">
              <span class="gender-icon">♂️</span>
              <span class="gender-title">Male</span>
              <span class="gender-desc">Beginner · Intermediate · Professional</span>
            </div>
            <div class="gender-card female" [class.selected]="form.gender === 'FEMALE'" (click)="selectGender('FEMALE')">
              <span class="gender-icon">♀️</span>
              <span class="gender-title">Female</span>
              <span class="gender-desc">Toning · Flexibility · Strength · More</span>
            </div>
          </div>
        </div>

        <!-- ── STEP 2: Fitness Level ── -->
        <div class="form-section" *ngIf="form.gender">
          <h3 class="section-label">
            <span *ngIf="form.gender === 'MALE'">💪 Your Fitness Level</span>
            <span *ngIf="form.gender === 'FEMALE'">🌸 Your Fitness Level</span>
          </h3>
          <div class="option-grid">
            <div *ngFor="let l of levels"
                 class="option-card" [class.selected]="form.level === l.value"
                 (click)="form.level = l.value">
              <span class="option-icon">{{l.icon}}</span>
              <span class="option-name">{{l.label}}</span>
              <span class="option-desc">{{l.desc}}</span>
            </div>
          </div>
        </div>

        <!-- ── STEP 3: Goal — Gender Specific ── -->
        <div class="form-section" *ngIf="form.gender && form.level">
          <h3 class="section-label">🎯 Your Goal</h3>

          <!-- Male Goals -->
          <div *ngIf="form.gender === 'MALE'" class="option-grid">
            <div *ngFor="let g of maleGoals"
                 class="option-card" [class.selected]="form.goal === g.value"
                 (click)="form.goal = g.value">
              <span class="option-icon">{{g.icon}}</span>
              <span class="option-name">{{g.label}}</span>
              <span class="option-desc">{{g.desc}}</span>
            </div>
          </div>

          <!-- Female Goals -->
          <div *ngIf="form.gender === 'FEMALE'" class="option-grid female-grid">
            <div *ngFor="let g of femaleGoals"
                 class="option-card female-goal" [class.selected]="form.goal === g.value"
                 (click)="form.goal = g.value">
              <span class="option-icon">{{g.icon}}</span>
              <span class="option-name">{{g.label}}</span>
              <span class="option-desc">{{g.desc}}</span>
            </div>
          </div>
        </div>

        <!-- ── STEP 4: Days Per Week ── -->
        <div class="form-section" *ngIf="form.goal">
          <h3 class="section-label">📅 Days Per Week</h3>
          <div class="option-grid days-grid">
            <div *ngFor="let d of [3,4,5,6]"
                 class="option-card small" [class.selected]="form.daysPerWeek === d"
                 (click)="form.daysPerWeek = d">
              <span class="option-name">{{d}} Days</span>
              <span class="option-desc">{{getDayDesc(d)}}</span>
            </div>
          </div>
        </div>

        <!-- ── STEP 5: Equipment ── -->
        <div class="form-section" *ngIf="form.goal">
          <h3 class="section-label">🏋️ Equipment Available</h3>
          <div class="option-grid">
            <div *ngFor="let e of equipment"
                 class="option-card" [class.selected]="form.equipment === e.value"
                 (click)="form.equipment = e.value">
              <span class="option-icon">{{e.icon}}</span>
              <span class="option-name">{{e.label}}</span>
              <span class="option-desc">{{e.desc}}</span>
            </div>
          </div>
        </div>

        <!-- ── STEP 6: Muscle Groups ── -->
        <div class="form-section" *ngIf="form.equipment">
          <h3 class="section-label">
            <span *ngIf="form.gender === 'MALE'">🎯 Target Muscle Groups</span>
            <span *ngIf="form.gender === 'FEMALE'">🌺 Focus Areas</span>
          </h3>
          <div class="option-grid muscle-grid">
            <div *ngFor="let m of getMusclelist()"
                 class="option-card muscle-card" [class.selected]="isMuscleSelected(m.value)"
                 (click)="toggleMuscle(m.value)">
              <span class="option-icon">{{m.icon}}</span>
              <span class="option-name">{{m.label}}</span>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <button type="submit" class="btn btn-primary btn-full btn-generate"
                [disabled]="loading || !isValid()" *ngIf="form.equipment">
          <span *ngIf="!loading">
            <span *ngIf="form.gender === 'MALE'">⚡ Generate My Workout Plan</span>
            <span *ngIf="form.gender === 'FEMALE'">🌸 Generate My Personalized Plan</span>
          </span>
          <span *ngIf="loading">✨ Generating Plan...</span>
        </button>
      </form>
    </div>
  `,
    styles: [`
    .pref-form { max-width: 860px; margin: 0 auto; }
    .form-section { margin-bottom: 2.5rem; }
    .section-label {
      font-size: 1.1rem;
      margin-bottom: 1.2rem;
      color: var(--text-primary);
      font-weight: 700;
    }

    /* Gender Cards */
    .gender-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .gender-card {
      background: var(--bg-card);
      border: 2px solid var(--border);
      border-radius: var(--radius-md);
      padding: 2rem 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }
    .gender-card:hover { transform: translateY(-4px); border-color: rgba(0,230,118,0.4); }
    .gender-card.selected {
      border-color: var(--accent);
      background: rgba(0,230,118,0.08);
      box-shadow: 0 0 30px rgba(0,230,118,0.15);
      transform: translateY(-4px);
    }
    .gender-card.female:hover { border-color: rgba(255,105,180,0.5); }
    .gender-card.female.selected {
      border-color: #ff69b4;
      background: rgba(255,105,180,0.08);
      box-shadow: 0 0 30px rgba(255,105,180,0.15);
    }
    .gender-icon { font-size: 3rem; }
    .gender-title { font-size: 1.3rem; font-weight: 800; }
    .gender-desc { font-size: 0.8rem; color: var(--text-muted); }

    /* Option Cards */
    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.75rem;
    }
    .female-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
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
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      align-items: center;
    }
    .option-card:hover { border-color: rgba(0,230,118,0.3); transform: translateY(-2px); }
    .option-card.selected {
      border-color: var(--accent);
      background: rgba(0,230,118,0.08);
      box-shadow: 0 0 20px rgba(0,230,118,0.15);
    }
    .female-goal:hover { border-color: rgba(255,105,180,0.4); }
    .female-goal.selected {
      border-color: #ff69b4;
      background: rgba(255,105,180,0.08);
      box-shadow: 0 0 20px rgba(255,105,180,0.12);
    }
    .muscle-card { padding: 1rem 0.75rem; }
    .option-card.small { padding: 1rem; }
    .option-icon { font-size: 1.8rem; }
    .option-name { font-weight: 700; font-size: 0.9rem; }
    .option-desc { font-size: 0.72rem; color: var(--text-muted); line-height: 1.3; }

    .btn-generate { margin-top: 1rem; padding: 1rem; font-size: 1.05rem; }
    .btn-full { width: 100%; }
    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @media (max-width: 600px) {
      .gender-grid { grid-template-columns: 1fr; }
      .days-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
      .days-grid .option-card { padding: 0.5rem; }
      .option-grid { grid-template-columns: 1fr; }
      .muscle-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
    }
  `]
})
export class PreferencesComponent {
    form: WorkoutPreferenceRequest = {
        gender: '' as any,
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
        { value: 'BEGINNER' as const, label: 'Beginner', icon: '🌱', desc: 'Just starting out' },
        { value: 'INTERMEDIATE' as const, label: 'Intermediate', icon: '🔥', desc: '6+ months experience' },
        { value: 'PROFESSIONAL' as const, label: 'Professional', icon: '🏆', desc: 'Advanced athlete' }
    ];

    maleGoals = [
        { value: 'MUSCLE_GAIN' as const, label: 'Muscle Gain', icon: '💪', desc: 'Build size & mass' },
        { value: 'FAT_LOSS' as const, label: 'Fat Loss', icon: '🔥', desc: 'Burn fat, get lean' },
        { value: 'STRENGTH' as const, label: 'Strength', icon: '🏋️', desc: 'Lift heavier, get stronger' },
        { value: 'ENDURANCE' as const, label: 'Endurance', icon: '🏃', desc: 'Stamina & cardio' }
    ];

    femaleGoals = [
        { value: 'FAT_LOSS' as const, label: 'Weight Loss', icon: '🔥', desc: 'Burn fat, feel lighter' },
        { value: 'TONING' as const, label: 'Toning', icon: '✨', desc: 'Lean & sculpted body' },
        { value: 'MUSCLE_GAIN' as const, label: 'Strength Gain', icon: '💪', desc: 'Build functional strength' },
        { value: 'FLEXIBILITY' as const, label: 'Flexibility', icon: '🧘', desc: 'Yoga-style mobility' },
        { value: 'POSTURE' as const, label: 'Posture & Core', icon: '🌿', desc: 'Spine health & core strength' },
        { value: 'ENDURANCE' as const, label: 'Endurance', icon: '🏃', desc: 'Cardio & stamina' },
        { value: 'STRENGTH' as const, label: 'Powerlifting', icon: '🏋️', desc: 'Serious strength training' },
        { value: 'PRENATAL_SAFE' as const, label: 'Prenatal Safe', icon: '🤰', desc: 'Safe for pregnancy' }
    ];

    equipment = [
        { value: 'GYM' as const, label: 'Full Gym', icon: '🏢', desc: 'All machines & weights' },
        { value: 'HOME' as const, label: 'Home Gym', icon: '🏠', desc: 'Dumbbells & bands' },
        { value: 'NO_EQUIPMENT' as const, label: 'No Equipment', icon: '🤸', desc: 'Bodyweight only' }
    ];

    maleMuscles = [
        { value: 'CHEST', label: 'Chest', icon: '🫁' },
        { value: 'BACK', label: 'Back', icon: '🔙' },
        { value: 'LEGS', label: 'Legs', icon: '🦵' },
        { value: 'SHOULDERS', label: 'Shoulders', icon: '🏔️' },
        { value: 'BICEPS', label: 'Biceps', icon: '💪' },
        { value: 'TRICEPS', label: 'Triceps', icon: '🦾' },
        { value: 'CORE', label: 'Core', icon: '🎯' }
    ];

    femaleMuscles = [
        { value: 'LEGS', label: 'Legs & Glutes', icon: '🍑' },
        { value: 'CORE', label: 'Core & Abs', icon: '🎯' },
        { value: 'BACK', label: 'Back', icon: '🌿' },
        { value: 'SHOULDERS', label: 'Shoulders', icon: '💫' },
        { value: 'BICEPS', label: 'Arms', icon: '💪' },
        { value: 'CHEST', label: 'Chest', icon: '🫁' },
        { value: 'TRICEPS', label: 'Triceps', icon: '🦾' }
    ];

    constructor(private api: ApiService, private router: Router) { }

    selectGender(gender: 'MALE' | 'FEMALE') {
        this.form.gender = gender;
        // Reset goal when switching gender
        this.form.goal = gender === 'MALE' ? 'MUSCLE_GAIN' : 'FAT_LOSS';
        // Reset muscle groups based on gender
        this.form.targetMuscleGroups = gender === 'MALE'
            ? ['CHEST', 'BACK', 'LEGS', 'SHOULDERS']
            : ['LEGS', 'CORE', 'BACK'];
    }

    getMusclelist() {
        return this.form.gender === 'FEMALE' ? this.femaleMuscles : this.maleMuscles;
    }

    getDayDesc(d: number): string {
        if (d === 3) return 'Good for beginners';
        if (d === 4) return 'Balanced split';
        if (d === 5) return 'Serious training';
        return 'Advanced athlete';
    }

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
        return !!this.form.gender && !!this.form.level && !!this.form.goal
            && !!this.form.equipment
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
