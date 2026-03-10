import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { WorkoutPlanResponse, WorkoutLogRequest } from '../../models/models';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <div class="plan-header animate-fade-in-up" *ngIf="plan">
        <h1 class="page-title">📋 {{plan.planName}}</h1>
        <p class="page-subtitle">Generated on {{plan.generatedDate | date:'mediumDate'}}</p>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading your workout plan...</p>
      </div>

      <div class="no-plan" *ngIf="!loading && !plan">
        <div class="no-plan-icon">🏋️</div>
        <h2>No Workout Plan Yet</h2>
        <p>Create your first personalized workout plan!</p>
        <a routerLink="/workout/preferences" class="btn btn-primary">Create Plan →</a>
      </div>

      <div *ngIf="plan" class="plan-content">
        <!-- Warmup -->
        <div class="suggestion-card warmup animate-fade-in-up">
          <div class="suggestion-label">🔥 Warm-up</div>
          <p>{{plan.warmupSuggestion}}</p>
        </div>

        <!-- Day Cards -->
        <div class="days-grid">
          <div *ngFor="let day of plan.days; let i = index"
               class="day-card animate-fade-in-up" [class.completed]="day.completed"
               [style.animation-delay]="(i * 0.1) + 's'">

            <div class="day-header">
              <h3>{{day.muscleGroupLabel}}</h3>
              <button class="toggle-btn" [class.done]="day.completed"
                      (click)="toggleDay(day)">
                {{ day.completed ? '✅ Done' : '⬜ Mark Done' }}
              </button>
            </div>

            <div class="exercises-list">
              <div *ngFor="let ex of day.exercises; let j = index" class="exercise-card">
                <div class="exercise-main">
                  <div class="ex-info">
                    <h4 class="ex-name">{{ex.exerciseName}}</h4>
                    <p class="ex-meta">{{ex.sets}} Sets × {{ex.reps}} Reps</p>
                  </div>
                  <div class="ex-actions">
                    <button class="btn-sm" (click)="toggleLog(ex.id)" [class.active]="showLog[ex.id]">📝 Log</button>
                    <button *ngIf="ex.gifUrl" class="btn-sm" (click)="toggleGif(ex.id)" [class.active]="showGif[ex.id]">🎬 View GIF</button>
                  </div>
                </div>

                <div *ngIf="showGif[ex.id]" class="ex-gif-preview animate-slide-down">
                  <img [src]="ex.gifUrl" [alt]="ex.exerciseName">
                </div>

                <div *ngIf="showLog[ex.id]" class="ex-log-inline animate-slide-down">
                  <div class="log-row">
                    <input type="number" [(ngModel)]="logFormData[ex.id].setNumber" placeholder="Set" class="sm-input">
                    <input type="number" [(ngModel)]="logFormData[ex.id].reps" placeholder="Reps" class="sm-input">
                    <input type="number" [(ngModel)]="logFormData[ex.id].weightLifted" placeholder="kg" class="sm-input">
                    <button class="btn-save" (click)="submitLog(ex.id, day.id, ex.baseExerciseId)">Save</button>
                  </div>
                  <div *ngIf="prMessage[ex.id]" class="pr-badge">{{prMessage[ex.id]}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cooldown -->
        <div class="suggestion-card cooldown animate-fade-in-up">
          <div class="suggestion-label">❄️ Cool-down</div>
          <p>{{plan.cooldownSuggestion}}</p>
        </div>

        <div class="plan-actions">
          <a routerLink="/workout/builder" class="btn btn-primary">
            ➕ Create Custom Plan
          </a>
          <a routerLink="/progress" class="btn btn-info" style="margin-left: 10px;">
            📈 View Progress
          </a>
          <a routerLink="/workout/preferences" class="btn btn-secondary" style="margin-left: 10px;">
            🔄 Generate New Plan
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .loading {
      text-align: center;
      padding: 4rem;
      color: var(--text-secondary);
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .no-plan {
      text-align: center;
      padding: 5rem 2rem;
    }
    .no-plan-icon { font-size: 4rem; margin-bottom: 1rem; }
    .no-plan h2 { margin-bottom: 0.5rem; }
    .no-plan p { color: var(--text-secondary); margin-bottom: 2rem; }

    .suggestion-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .suggestion-card.warmup { border-left: 3px solid #ff9800; }
    .suggestion-card.cooldown { border-left: 3px solid #42a5f5; }
    .suggestion-label {
      font-weight: 700;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .suggestion-card p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .days-grid {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .day-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
      transition: all 0.3s;
      opacity: 0;
      margin-bottom: 2.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .day-card.completed {
      border-color: #00e676;
      background: rgba(0, 230, 118, 0.08);
    }
    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--border);
    }
    .day-header h3 {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--accent);
      margin: 0;
    }
    .toggle-btn {
      background: var(--accent);
      border: none;
      color: #000;
      padding: 0.5rem 1.25rem;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 700;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 10px rgba(0,230,118,0.3);
    }
    .toggle-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 15px rgba(0,230,118,0.4);
    }
    .toggle-btn.done {
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid var(--border);
      box-shadow: none;
    }
    .exercise-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      margin: 0.5rem 1.25rem;
    }
    .exercise-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ex-name { font-size: 1rem; font-weight: 700; color: white; margin: 0; }
    .ex-meta { font-size: 0.8rem; color: var(--text-muted); margin: 0; }
    .ex-actions { display: flex; gap: 0.5rem; }
    
    .btn-sm {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .btn-sm.active { background: var(--accent); color: black; border-color: var(--accent); }

    .ex-gif-preview {
      margin-top: 1rem;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: black;
    }
    .ex-gif-preview img { width: 100%; max-height: 300px; object-fit: contain; display: block; }

    .ex-log-inline {
      margin-top: 1rem;
      padding: 0.75rem;
      background: rgba(0,0,0,0.2);
      border-radius: 8px;
    }
    .log-row { display: flex; gap: 8px; align-items: center; }
    .sm-input {
      width: 60px;
      padding: 0.4rem;
      border-radius: 4px;
      background: #000;
      border: 1px solid var(--border);
      color: white;
      text-align: center;
      font-size: 0.8rem;
    }
    .btn-save {
      background: var(--accent);
      color: black;
      border: none;
      padding: 0.4rem 1rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
      cursor: pointer;
    }
    .pr-badge {
      margin-top: 0.5rem;
      color: var(--accent);
      font-size: 0.75rem;
      font-weight: bold;
      text-align: center;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-down { animation: slideDown 0.3s ease-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeIn 0.5s ease-out forwards;
    }

    @media (max-width: 600px) {
      .day-header { flex-direction: column; gap: 1rem; text-align: center; }
      .toggle-btn { width: 100%; justify-content: center; }
      .exercise-card { margin: 0.5rem; }
      .exercise-main { flex-direction: column; gap: 1rem; align-items: flex-start; }
      .ex-actions { width: 100%; justify-content: space-between; }
      .btn-sm { flex: 1; text-align: center; padding: 0.6rem; }
      .log-row { flex-wrap: wrap; }
      .sm-input { flex: 1; min-width: 70px; }
      .btn-save { width: 100%; margin-top: 0.5rem; }
    }
  `]
})
export class PlanComponent implements OnInit {
  plan: WorkoutPlanResponse | null = null;
  loading = true;
  showGif: { [key: number]: boolean } = {};
  showLog: { [key: number]: boolean } = {};
  logFormData: { [key: number]: { setNumber: number, reps: number, weightLifted: number } } = {};
  prMessage: { [key: number]: string } = {};

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadPlan();
  }

  loadPlan() {
    this.loading = true;
    this.api.getLatestPlan().subscribe({
      next: (plan) => {
        this.plan = plan;
        this.initializeLogForms();
        this.loading = false;
      },
      error: () => {
        this.plan = null;
        this.loading = false;
      }
    });
  }

  initializeLogForms() {
    if (!this.plan || !this.plan.days) return;
    this.plan.days.forEach(day => {
      day.exercises.forEach(ex => {
        if (!this.logFormData[ex.id]) {
          this.logFormData[ex.id] = {
            setNumber: 1,
            reps: ex.reps || 10,
            weightLifted: 0
          };
        }
      });
    });
  }

  toggleDay(day: any) {
    this.api.toggleDay(day.id).subscribe({
      next: () => {
        day.completed = !day.completed;
      }
    });
  }

  toggleGif(exerciseId: number) {
    this.showGif[exerciseId] = !this.showGif[exerciseId];
    if (this.showGif[exerciseId]) this.showLog[exerciseId] = false;
  }

  toggleLog(exerciseId: number) {
    this.showLog[exerciseId] = !this.showLog[exerciseId];
    if (this.showLog[exerciseId]) this.showGif[exerciseId] = false;
  }

  submitLog(uiExerciseId: number, dayId: number, baseExerciseId: number) {
    const data = this.logFormData[uiExerciseId];
    const logReq: WorkoutLogRequest = {
      date: new Date().toISOString().split('T')[0],
      workoutDayId: dayId,
      exerciseId: baseExerciseId,
      sets: [
        {
          setNumber: data.setNumber,
          reps: data.reps,
          weightLifted: data.weightLifted
        }
      ]
    };

    this.api.logWorkout(logReq).subscribe({
      next: (res) => {
        const setRes = res.sets[0];
        if (setRes && setRes.isPersonalRecord) {
          this.prMessage[uiExerciseId] = `🎉 Great job! That's a new Personal Record! 🎉`;
          setTimeout(() => delete this.prMessage[uiExerciseId], 5000);
        }

        // Setup for next set
        this.logFormData[uiExerciseId].setNumber++;
      },
      error: (err) => {
        console.error('Error logging workout', err);
      }
    });
  }
}
