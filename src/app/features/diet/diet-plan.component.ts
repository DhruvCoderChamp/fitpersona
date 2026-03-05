import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DietPlanResponse } from '../../models/models';

@Component({
    selector: 'app-diet-plan',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="page-container">
      <div class="plan-header animate-fade-in-up">
        <div>
          <h1 class="page-title">🥗 Your <span class="gradient-text">Diet Plan</span></h1>
          <p class="page-subtitle" *ngIf="plan">{{plan.goal}} • {{plan.dailyCalories}} kcal/day</p>
        </div>
        <a routerLink="/diet/form" class="btn btn-secondary">✏️ New Plan</a>
      </div>

      <div *ngIf="!plan" class="empty-state animate-fade-in-up">
        <div class="empty-icon">🍽️</div>
        <h3>No diet plan generated yet</h3>
        <p>Go to the diet form to generate your personalized plan</p>
        <a routerLink="/diet/form" class="btn btn-primary">Generate Plan</a>
      </div>

      <div *ngIf="plan" class="plan-content">
        <!-- Macro Summary -->
        <div class="macro-card card animate-fade-in-up">
          <h3>📊 Daily Nutritional Target</h3>
          <div class="macro-grid">
            <div class="macro-item">
              <div class="macro-circle cal-circle">
                <span class="macro-value">{{plan.dailyCalories}}</span>
                <span class="macro-unit">kcal</span>
              </div>
              <span class="macro-label">Calories</span>
            </div>
            <div class="macro-item">
              <div class="macro-circle protein-circle">
                <span class="macro-value">{{plan.proteinGrams}}g</span>
              </div>
              <span class="macro-label">Protein</span>
            </div>
            <div class="macro-item">
              <div class="macro-circle carbs-circle">
                <span class="macro-value">{{plan.carbsGrams}}g</span>
              </div>
              <span class="macro-label">Carbs</span>
            </div>
            <div class="macro-item">
              <div class="macro-circle fats-circle">
                <span class="macro-value">{{plan.fatsGrams}}g</span>
              </div>
              <span class="macro-label">Fats</span>
            </div>
          </div>
          <!-- Macro Bars -->
          <div class="macro-bars">
            <div class="macro-bar-row">
              <span class="bar-label">Protein</span>
              <div class="bar-track">
                <div class="bar-fill protein-fill" [style.width.%]="getProteinPct()"></div>
              </div>
              <span class="bar-pct">{{getProteinPct()}}%</span>
            </div>
            <div class="macro-bar-row">
              <span class="bar-label">Carbs</span>
              <div class="bar-track">
                <div class="bar-fill carbs-fill" [style.width.%]="getCarbsPct()"></div>
              </div>
              <span class="bar-pct">{{getCarbsPct()}}%</span>
            </div>
            <div class="macro-bar-row">
              <span class="bar-label">Fats</span>
              <div class="bar-track">
                <div class="bar-fill fats-fill" [style.width.%]="getFatsPct()"></div>
              </div>
              <span class="bar-pct">{{getFatsPct()}}%</span>
            </div>
          </div>
        </div>

        <!-- Day Tabs -->
        <div class="day-tabs animate-fade-in-up">
          <button *ngFor="let day of plan.days"
                  class="day-tab" [class.active]="selectedDay === day.dayNumber"
                  (click)="selectedDay = day.dayNumber">
            <span class="day-num">Day {{day.dayNumber}}</span>
            <span class="day-name">{{day.dayName}}</span>
          </button>
        </div>

        <!-- Selected Day Meals -->
        <div *ngIf="getSelectedDay()" class="meals-grid animate-fade-in-up">
          <div *ngFor="let meal of getSelectedDay()!.meals" class="meal-card card">
            <div class="meal-header">
              <span class="meal-icon">{{getMealIcon(meal.mealType)}}</span>
              <div class="meal-title-group">
                <h4 class="meal-type">{{meal.mealType}}</h4>
                <span class="meal-cal">{{meal.calories}} kcal</span>
              </div>
            </div>
            <p class="meal-desc">{{meal.description}}</p>
            <ul class="meal-items">
              <li *ngFor="let item of meal.items.slice(1)">{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-state h3 { margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; }

    /* Macro Summary Card */
    .macro-card { margin-bottom: 2rem; }
    .macro-card h3 { margin-bottom: 1.5rem; }
    .macro-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .macro-item { text-align: center; }
    .macro-circle {
      width: 90px; height: 90px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.5rem;
      border: 3px solid;
    }
    .cal-circle { border-color: var(--accent); background: rgba(0,230,118,0.08); }
    .protein-circle { border-color: #ff6b6b; background: rgba(255,107,107,0.08); }
    .carbs-circle { border-color: #ffd93d; background: rgba(255,217,61,0.08); }
    .fats-circle { border-color: #6bcbff; background: rgba(107,203,255,0.08); }
    .macro-value {
      font-weight: 800;
      font-size: 1.1rem;
      font-family: 'Outfit', sans-serif;
    }
    .macro-unit { font-size: 0.7rem; color: var(--text-muted); }
    .macro-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 600;
    }

    /* Macro Bars */
    .macro-bars { display: flex; flex-direction: column; gap: 0.75rem; }
    .macro-bar-row { display: flex; align-items: center; gap: 0.75rem; }
    .bar-label { width: 60px; font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; }
    .bar-track {
      flex: 1; height: 10px;
      background: var(--bg-secondary);
      border-radius: 5px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%; border-radius: 5px;
      transition: width 0.8s ease-out;
    }
    .protein-fill { background: linear-gradient(90deg, #ff6b6b, #ee5a24); }
    .carbs-fill { background: linear-gradient(90deg, #ffd93d, #f0c929); }
    .fats-fill { background: linear-gradient(90deg, #6bcbff, #45b1e8); }
    .bar-pct { font-size: 0.8rem; font-weight: 700; width: 40px; text-align: right; color: var(--text-secondary); }

    /* Day Tabs */
    .day-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }
    .day-tab {
      background: var(--bg-card);
      border: 2px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      text-align: center;
      transition: all 0.3s;
      min-width: 90px;
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
    }
    .day-tab:hover {
      border-color: rgba(0, 230, 118, 0.3);
      transform: translateY(-2px);
    }
    .day-tab.active {
      border-color: var(--accent);
      background: rgba(0, 230, 118, 0.08);
      box-shadow: 0 0 20px rgba(0, 230, 118, 0.15);
    }
    .day-num { display: block; font-weight: 700; font-size: 0.9rem; }
    .day-name { display: block; font-size: 0.7rem; color: var(--text-muted); margin-top: 0.15rem; }

    /* Meals Grid */
    .meals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    .meal-card {
      padding: 1.25rem;
      transition: all 0.3s;
    }
    .meal-card:hover {
      border-color: rgba(0,230,118,0.25);
      transform: translateY(-3px);
      box-shadow: var(--shadow-glow);
    }
    .meal-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .meal-icon { font-size: 2rem; }
    .meal-title-group { flex: 1; }
    .meal-type {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
    }
    .meal-cal {
      font-size: 0.8rem;
      color: var(--accent);
      font-weight: 700;
    }
    .meal-desc {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
      font-style: italic;
    }
    .meal-items {
      list-style: none;
      padding: 0;
    }
    .meal-items li {
      color: var(--text-secondary);
      font-size: 0.82rem;
      padding: 0.3rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .meal-items li::before {
      content: '•';
      color: var(--accent);
      font-weight: 700;
    }
    .meal-items li:last-child { border-bottom: none; }

    @media (max-width: 768px) {
      .plan-header { flex-direction: column; gap: 1rem; }
      .macro-grid { grid-template-columns: repeat(2, 1fr); }
      .day-tabs { flex-wrap: nowrap; }
    }
  `]
})
export class DietPlanComponent implements OnInit {
    plan: DietPlanResponse | null = null;
    selectedDay = 1;

    ngOnInit() {
        const stored = sessionStorage.getItem('dietPlan');
        if (stored) {
            this.plan = JSON.parse(stored);
        }
    }

    getSelectedDay() {
        return this.plan?.days.find(d => d.dayNumber === this.selectedDay) || null;
    }

    getMealIcon(mealType: string): string {
        const icons: Record<string, string> = {
            'Breakfast': '🌅',
            'Lunch': '☀️',
            'Snack': '🍎',
            'Dinner': '🌙'
        };
        return icons[mealType] || '🍽️';
    }

    getProteinPct(): number {
        if (!this.plan) return 0;
        const total = (this.plan.proteinGrams * 4) + (this.plan.carbsGrams * 4) + (this.plan.fatsGrams * 9);
        return Math.round((this.plan.proteinGrams * 4 / total) * 100);
    }

    getCarbsPct(): number {
        if (!this.plan) return 0;
        const total = (this.plan.proteinGrams * 4) + (this.plan.carbsGrams * 4) + (this.plan.fatsGrams * 9);
        return Math.round((this.plan.carbsGrams * 4 / total) * 100);
    }

    getFatsPct(): number {
        if (!this.plan) return 0;
        const total = (this.plan.proteinGrams * 4) + (this.plan.carbsGrams * 4) + (this.plan.fatsGrams * 9);
        return Math.round((this.plan.fatsGrams * 9 / total) * 100);
    }
}
