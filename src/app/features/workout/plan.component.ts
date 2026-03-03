import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { WorkoutPlanResponse } from '../../models/models';

@Component({
    selector: 'app-plan',
    standalone: true,
    imports: [CommonModule, RouterLink],
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
              <div *ngFor="let ex of day.exercises; let j = index" class="exercise-item">
                <div class="ex-info">
                  <span class="ex-name">{{ex.exerciseName}}</span>
                  <span class="ex-desc">{{ex.description}}</span>
                </div>
                <div class="ex-details">
                  <span class="ex-badge sets">{{ex.sets}} sets</span>
                  <span class="ex-badge reps">{{ex.reps}} reps</span>
                  <span class="ex-badge rest">{{ex.restTimeSeconds}}s rest</span>
                </div>
                <div class="ex-meta">
                  <span class="difficulty" [attr.data-level]="ex.difficulty">{{ex.difficulty}}</span>
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
          <a routerLink="/workout/preferences" class="btn btn-secondary">
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
      margin-bottom: 1.5rem;
    }

    .day-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
      transition: all 0.3s;
      opacity: 0;
    }
    .day-card.completed {
      border-color: rgba(0, 230, 118, 0.3);
      background: rgba(0, 230, 118, 0.03);
    }
    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--border);
    }
    .day-header h3 {
      font-size: 1rem;
      font-weight: 700;
    }
    .toggle-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.3s;
    }
    .toggle-btn:hover { border-color: var(--accent); color: var(--accent); }
    .toggle-btn.done {
      background: rgba(0,230,118,0.1);
      border-color: var(--accent);
      color: var(--accent);
    }

    .exercises-list { padding: 0.5rem 0; }
    .exercise-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1rem;
      align-items: center;
      padding: 0.85rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      transition: background 0.2s;
    }
    .exercise-item:last-child { border-bottom: none; }
    .exercise-item:hover { background: rgba(255,255,255,0.02); }

    .ex-name {
      font-weight: 600;
      font-size: 0.9rem;
      display: block;
    }
    .ex-desc {
      font-size: 0.78rem;
      color: var(--text-muted);
      display: block;
      margin-top: 2px;
    }
    .ex-details {
      display: flex;
      gap: 0.5rem;
    }
    .ex-badge {
      background: rgba(255,255,255,0.06);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .ex-badge.sets { color: var(--accent); }
    .ex-badge.reps { color: var(--info); }
    .ex-badge.rest { color: var(--warning); }

    .difficulty {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .difficulty[data-level="BEGINNER"] { color: var(--success); background: rgba(105,240,174,0.1); }
    .difficulty[data-level="INTERMEDIATE"] { color: var(--warning); background: rgba(255,171,64,0.1); }
    .difficulty[data-level="ADVANCED"] { color: var(--danger); background: rgba(255,82,82,0.1); }

    .plan-actions {
      text-align: center;
      padding: 2rem 0;
    }

    @media (max-width: 768px) {
      .exercise-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      .ex-details { flex-wrap: wrap; }
      .day-header { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
    }
  `]
})
export class PlanComponent implements OnInit {
    plan: WorkoutPlanResponse | null = null;
    loading = true;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadPlan();
    }

    loadPlan() {
        this.loading = true;
        this.api.getLatestPlan().subscribe({
            next: (plan) => {
                this.plan = plan;
                this.loading = false;
            },
            error: () => {
                this.plan = null;
                this.loading = false;
            }
        });
    }

    toggleDay(day: any) {
        this.api.toggleDay(day.id).subscribe({
            next: () => {
                day.completed = !day.completed;
            }
        });
    }
}
