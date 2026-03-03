import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { DashboardResponse } from '../../models/models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="page-container">
      <div class="dash-header animate-fade-in-up">
        <div>
          <h1 class="page-title">Welcome back, <span class="gradient-text">{{data?.userName}}</span>! 👋</h1>
          <p class="page-subtitle">Here's your fitness overview</p>
        </div>
        <a routerLink="/workout/preferences" class="btn btn-primary">+ New Plan</a>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="data && !loading" class="dash-content">
        <!-- Stats Grid -->
        <div class="stats-grid animate-fade-in-up">
          <div class="stat-card">
            <div class="stat-icon bmi-icon">⚖️</div>
            <div class="stat-info">
              <span class="stat-value">{{data.bmi}}</span>
              <span class="stat-label">BMI</span>
              <span class="stat-badge" [attr.data-type]="data.bmiCategory.toLowerCase()">
                {{data.bmiCategory}}
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-info">
              <span class="stat-value">{{data.estimatedCaloriesBurned}}</span>
              <span class="stat-label">Calories Burned</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💧</div>
            <div class="stat-info">
              <span class="stat-value">{{data.waterIntakeLiters}}L</span>
              <span class="stat-label">Daily Water Goal</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📏</div>
            <div class="stat-info">
              <span class="stat-value">{{data.height}} cm / {{data.weight}} kg</span>
              <span class="stat-label">Height / Weight</span>
            </div>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="progress-section card animate-fade-in-up">
          <h3>📊 Weekly Progress</h3>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="data.completionPercentage"></div>
            </div>
            <span class="progress-text">{{data.completionPercentage}}%</span>
          </div>
          <div class="progress-stats">
            <span>✅ {{data.completedDays}} / {{data.totalWorkoutDays}} days completed</span>
          </div>
        </div>

        <!-- BMI Calculator Widget -->
        <div class="bmi-widget card animate-fade-in-up">
          <h3>🧮 BMI Details</h3>
          <div class="bmi-scale">
            <div class="bmi-range" *ngFor="let r of bmiRanges"
                 [class.active]="r.label === data.bmiCategory"
                 [style.background]="r.color">
              <span class="bmi-range-label">{{r.label}}</span>
              <span class="bmi-range-value">{{r.range}}</span>
            </div>
          </div>
          <p class="bmi-result">Your BMI of <strong>{{data.bmi}}</strong> falls in the <strong>{{data.bmiCategory}}</strong> category.</p>
        </div>

        <!-- Water Intake Tracker -->
        <div class="water-widget card animate-fade-in-up">
          <h3>💧 Water Intake Tracker</h3>
          <div class="water-glasses">
            <div *ngFor="let g of waterGlasses; let i = index"
                 class="water-glass" [class.filled]="i < waterDrank"
                 (click)="toggleWater(i)">
              🥤
            </div>
          </div>
          <p class="water-info">{{waterDrank}} / {{waterGlasses.length}} glasses ({{waterDrank * 0.25}}L / {{data.waterIntakeLiters}}L)</p>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions animate-fade-in-up">
          <a routerLink="/workout/plan" class="action-card">
            <span class="action-icon">📋</span>
            <span class="action-text">View Plan</span>
          </a>
          <a routerLink="/workout/preferences" class="action-card">
            <span class="action-icon">🎯</span>
            <span class="action-text">New Plan</span>
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
    .dash-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .loading { text-align: center; padding: 4rem; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s;
    }
    .stat-card:hover {
      border-color: rgba(0,230,118,0.2);
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow);
    }
    .stat-icon { font-size: 2rem; }
    .stat-value {
      display: block;
      font-size: 1.3rem;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
    }
    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      display: block;
    }
    .stat-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .stat-badge[data-type="normal"] { background: rgba(0,230,118,0.15); color: var(--success); }
    .stat-badge[data-type="overweight"] { background: rgba(255,171,64,0.15); color: var(--warning); }
    .stat-badge[data-type="underweight"] { background: rgba(64,196,255,0.15); color: var(--info); }
    .stat-badge[data-type="obese"] { background: rgba(255,82,82,0.15); color: var(--danger); }

    .progress-section {
      margin-bottom: 1.5rem;
    }
    .progress-section h3 { margin-bottom: 1rem; }
    .progress-bar-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .progress-bar {
      flex: 1;
      height: 12px;
      background: var(--bg-secondary);
      border-radius: 6px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--accent-gradient);
      border-radius: 6px;
      transition: width 1s ease-out;
      min-width: 2%;
    }
    .progress-text {
      font-weight: 700;
      color: var(--accent);
      font-size: 1.1rem;
    }
    .progress-stats {
      margin-top: 0.75rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .bmi-widget, .water-widget {
      margin-bottom: 1.5rem;
    }
    .bmi-widget h3, .water-widget h3 {
      margin-bottom: 1rem;
    }
    .bmi-scale {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .bmi-range {
      flex: 1;
      padding: 0.6rem;
      border-radius: var(--radius-sm);
      text-align: center;
      opacity: 0.4;
      transition: all 0.3s;
    }
    .bmi-range.active {
      opacity: 1;
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
    }
    .bmi-range-label { display: block; font-size: 0.75rem; font-weight: 700; }
    .bmi-range-value { display: block; font-size: 0.65rem; opacity: 0.8; }
    .bmi-result { color: var(--text-secondary); font-size: 0.9rem; }

    .water-glasses {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.75rem;
    }
    .water-glass {
      font-size: 1.8rem;
      cursor: pointer;
      opacity: 0.3;
      transition: all 0.3s;
      filter: grayscale(1);
    }
    .water-glass.filled {
      opacity: 1;
      filter: grayscale(0);
      transform: scale(1.1);
    }
    .water-glass:hover { transform: scale(1.2); }
    .water-info { color: var(--text-secondary); font-size: 0.85rem; }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .action-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      text-align: center;
      text-decoration: none;
      color: var(--text-primary);
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .action-card:hover {
      border-color: var(--accent);
      transform: translateY(-3px);
      box-shadow: var(--shadow-glow);
    }
    .action-icon { font-size: 2rem; }
    .action-text { font-weight: 600; }

    @media (max-width: 768px) {
      .dash-header { flex-direction: column; gap: 1rem; }
      .bmi-scale { flex-direction: column; }
    }
  `]
})
export class DashboardComponent implements OnInit {
    data: DashboardResponse | null = null;
    loading = true;
    waterDrank = 0;
    waterGlasses: number[] = [];

    bmiRanges = [
        { label: 'Underweight', range: '< 18.5', color: 'rgba(64,196,255,0.2)' },
        { label: 'Normal', range: '18.5 - 24.9', color: 'rgba(0,230,118,0.2)' },
        { label: 'Overweight', range: '25 - 29.9', color: 'rgba(255,171,64,0.2)' },
        { label: 'Obese', range: '≥ 30', color: 'rgba(255,82,82,0.2)' }
    ];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getDashboard().subscribe({
            next: (data) => {
                this.data = data;
                this.waterGlasses = Array(Math.ceil(data.waterIntakeLiters / 0.25)).fill(0);
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    toggleWater(index: number) {
        this.waterDrank = index < this.waterDrank ? index : index + 1;
    }
}
