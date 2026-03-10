import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../core/api.service';
import { DashboardResponse, WorkoutLogResponse, Exercise } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BaseChartDirective],
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
            <div class="stat-icon">⚖️</div>
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
          <h3>📊 Weekly Plan Completion</h3>
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

        <!-- Strength Progress Graph -->
        <div class="strength-graph-section card animate-fade-in-up">
          <div class="section-header">
            <h3>📈 Strength Progression</h3>
            <select class="form-select exercise-select" [(ngModel)]="selectedExerciseId" (change)="loadExerciseProgress()">
              <option [ngValue]="null">Select Exercise</option>
              <option *ngFor="let ex of exerciseOptions" [ngValue]="ex.id">{{ex.name}}</option>
            </select>
          </div>
          <div *ngIf="!selectedExerciseId" class="empty-state">
            <p>Select an exercise to view your strength progress over time.</p>
          </div>
          <div *ngIf="selectedExerciseId && lineChartData.labels?.length === 0" class="empty-state">
            <p>No logged data for this exercise yet.</p>
          </div>
          <div class="chart-wrapper" *ngIf="selectedExerciseId && lineChartData.labels!.length > 0">
            <canvas baseChart [data]="lineChartData" [options]="lineChartOptions" [type]="lineChartType"></canvas>
          </div>
        </div>

        <!-- Workout History -->
        <div class="history-section card animate-fade-in-up">
          <h3>🕒 Recent Workout History</h3>
          <div *ngIf="workoutHistory.length === 0" class="empty-state">
            <p>No workout sessions logged yet.</p>
          </div>
          <div *ngFor="let entry of workoutHistory" class="history-card">
            <div class="history-header">
              <h4>{{entry.exerciseName}}</h4>
              <span class="history-date">{{entry.date | date:'mediumDate'}}</span>
            </div>
            <ul class="history-sets">
              <li *ngFor="let set of entry.sets">
                Set {{set.setNumber}}: {{set.weightLifted}} kg × {{set.reps}} reps
                <span *ngIf="set.isPersonalRecord" class="pr-badge">🏆 PR</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- BMI Details -->
        <div class="bmi-widget card animate-fade-in-up">
          <h3>🧮 BMI Details</h3>
          <div class="bmi-scale">
            <div class="bmi-range" *ngFor="let r of bmiRanges"
                 [class.active]="r.label === data.bmiCategory" [style.background]="r.color">
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
                 class="water-glass" [class.filled]="i < waterDrank" (click)="toggleWater(i)">🥤</div>
          </div>
          <p class="water-info">{{waterDrank}} / {{waterGlasses.length}} glasses ({{waterDrank * 0.25}}L / {{data.waterIntakeLiters}}L)</p>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions animate-fade-in-up">
          <a routerLink="/workout/plan" class="action-card">
            <span class="action-icon">📋</span>
            <span class="action-text">My Plan</span>
          </a>
          <a routerLink="/workout/preferences" class="action-card">
            <span class="action-icon">🎯</span>
            <span class="action-text">New Plan</span>
          </a>
          <a routerLink="/diet/form" class="action-card">
            <span class="action-icon">🥗</span>
            <span class="action-text">Diet Plan</span>
          </a>
          <a routerLink="/profile" class="action-card">
            <span class="action-icon">🏅</span>
            <span class="action-text">My Stats</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gradient-text { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    .loading { text-align: center; padding: 4rem; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.5rem; display: flex; align-items: center; gap: 1rem; transition: all 0.3s; }
    .stat-card:hover { border-color: rgba(0,230,118,0.2); transform: translateY(-2px); box-shadow: var(--shadow-glow); }
    .stat-icon { font-size: 2rem; }
    .stat-value { display: block; font-size: 1.3rem; font-weight: 800; font-family: 'Outfit', sans-serif; }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); display: block; }
    .stat-badge { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; }
    .stat-badge[data-type="normal"] { background: rgba(0,230,118,0.15); color: var(--success); }
    .stat-badge[data-type="overweight"] { background: rgba(255,171,64,0.15); color: var(--warning); }
    .stat-badge[data-type="underweight"] { background: rgba(64,196,255,0.15); color: var(--info); }
    .stat-badge[data-type="obese"] { background: rgba(255,82,82,0.15); color: var(--danger); }

    .progress-section, .strength-graph-section, .history-section { margin-bottom: 1.5rem; }
    .progress-section h3, .strength-graph-section h3, .history-section h3 { margin-bottom: 1rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .exercise-select { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; padding: 0.5rem 1rem; border-radius: 8px; }
    .exercise-select option { color: #000; background: #fff; }
    .empty-state { text-align: center; padding: 2rem; color: var(--text-muted); background: rgba(0,0,0,0.2); border-radius: 8px; }
    .chart-wrapper { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px; }
    .history-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
    .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
    .history-header h4 { margin: 0; color: var(--accent); }
    .history-date { font-size: 0.8rem; color: var(--text-muted); }
    .history-sets { list-style-type: none; padding: 0; margin: 0; }
    .history-sets li { font-size: 0.9rem; color: var(--text-secondary); padding: 0.25rem 0; }
    .pr-badge { background: linear-gradient(135deg, #FFD700, #FFA500); color: black; font-size: 0.7rem; font-weight: 700; padding: 0.1rem 0.4rem; border-radius: 4px; margin-left: 0.5rem; }

    .progress-bar-container { display: flex; align-items: center; gap: 1rem; }
    .progress-bar { flex: 1; height: 12px; background: var(--bg-secondary); border-radius: 6px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--accent-gradient); border-radius: 6px; transition: width 1s ease-out; min-width: 2%; }
    .progress-text { font-weight: 700; color: var(--accent); font-size: 1.1rem; }
    .progress-stats { margin-top: 0.75rem; color: var(--text-secondary); font-size: 0.9rem; }

    .bmi-widget, .water-widget { margin-bottom: 1.5rem; }
    .bmi-widget h3, .water-widget h3 { margin-bottom: 1rem; }
    .bmi-scale { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .bmi-range { flex: 1; padding: 0.6rem; border-radius: var(--radius-sm); text-align: center; opacity: 0.4; transition: all 0.3s; }
    .bmi-range.active { opacity: 1; transform: scale(1.05); box-shadow: 0 0 15px rgba(0,0,0,0.2); }
    .bmi-range-label { display: block; font-size: 0.75rem; font-weight: 700; }
    .bmi-range-value { display: block; font-size: 0.65rem; opacity: 0.8; }
    .bmi-result { color: var(--text-secondary); font-size: 0.9rem; }

    .water-glasses { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
    .water-glass { font-size: 1.8rem; cursor: pointer; opacity: 0.3; transition: all 0.3s; filter: grayscale(1); }
    .water-glass.filled { opacity: 1; filter: grayscale(0); transform: scale(1.1); }
    .water-glass:hover { transform: scale(1.2); }
    .water-info { color: var(--text-secondary); font-size: 0.85rem; }

    .quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .action-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.5rem; text-align: center; text-decoration: none; color: var(--text-primary); transition: all 0.3s; display: flex; flex-direction: column; gap: 0.5rem; }
    .action-card:hover { border-color: var(--accent); transform: translateY(-3px); box-shadow: var(--shadow-glow); }
    .action-icon { font-size: 2rem; }
    .action-text { font-weight: 600; }

    @media (max-width: 768px) {
      .dash-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
      .bmi-scale { flex-direction: column; }
      .quick-actions { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
      .stats-grid { grid-template-columns: 1fr; }
      .water-glasses { justify-content: flex-start; }
      .progress-bar-container { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
      .progress-bar { width: 100%; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  data: DashboardResponse | null = null;
  loading = true;
  waterDrank = 0;
  waterGlasses: number[] = [];

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Weight Lifted (kg)',
      backgroundColor: 'rgba(0, 230, 118, 0.2)',
      borderColor: '#00e676',
      pointBackgroundColor: '#00e676',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#00e676',
      fill: 'origin',
      tension: 0.4
    }]
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: false, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#ccc' } },
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#ccc' } }
    },
    plugins: { legend: { labels: { color: '#fff', font: { family: 'Outfit, sans-serif' } } } }
  };
  public lineChartType: ChartType = 'line';

  exerciseOptions: Exercise[] = [];
  selectedExerciseId: number | null = null;
  workoutHistory: WorkoutLogResponse[] = [];

  bmiRanges = [
    { label: 'Underweight', range: '< 18.5', color: 'rgba(64,196,255,0.2)' },
    { label: 'Normal', range: '18.5 - 24.9', color: 'rgba(0,230,118,0.2)' },
    { label: 'Overweight', range: '25 - 29.9', color: 'rgba(255,171,64,0.2)' },
    { label: 'Obese', range: '≥ 30', color: 'rgba(255,82,82,0.2)' }
  ];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadDashboardData();
    this.loadExercises();
    this.loadRecentHistory();
  }

  loadDashboardData() {
    this.api.getDashboard().subscribe({
      next: (data) => {
        this.data = data;
        this.waterGlasses = Array(Math.ceil(data.waterIntakeLiters / 0.25)).fill(0);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadExercises() {
    this.api.getAllExercises().subscribe(ex => this.exerciseOptions = ex);
  }

  loadRecentHistory() {
    const today = new Date().toISOString().split('T')[0];
    this.api.getWorkoutHistory(today).subscribe(history => { this.workoutHistory = history; });
  }

  loadExerciseProgress() {
    if (!this.selectedExerciseId) return;
    this.api.getExerciseProgress(this.selectedExerciseId).subscribe(progress => {
      const labels: string[] = [];
      const dataPoints: number[] = [];
      progress.forEach(log => {
        log.sets.forEach(set => {
          labels.push(`${log.date} (Set ${set.setNumber})`);
          dataPoints.push(set.weightLifted);
        });
      });
      this.lineChartData = { labels, datasets: [{ ...this.lineChartData.datasets[0], data: dataPoints }] };
      this.chart?.update();
    });
  }

  toggleWater(index: number) {
    this.waterDrank = index < this.waterDrank ? index : index + 1;
  }
}
