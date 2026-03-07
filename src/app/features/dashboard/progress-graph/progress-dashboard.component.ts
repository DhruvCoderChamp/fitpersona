import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserProgressService } from '../../../core/services/user-progress.service';
import { UserProgress } from '../../../models/user-progress.model';

@Component({
    selector: 'app-progress-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, BaseChartDirective],
    template: `
    <div class="dashboard-container">
      <h2>Your Progress</h2>
      
      <div class="controls">
        <select [(ngModel)]="selectedMetric" (change)="updateChart()">
          <option value="weight">Weight (kg)</option>
          <option value="calories">Calories Burned</option>
          <option value="workouts">Workouts Completed</option>
        </select>
        
        <button (click)="loadProgress()">Refresh Data</button>
      </div>

      <div class="chart-wrapper">
        <canvas baseChart
                [data]="lineChartData"
                [options]="lineChartOptions"
                [type]="lineChartType">
        </canvas>
      </div>

      <div class="log-progress-form">
        <h3>Log Today's Progress</h3>
        <div class="form-group">
          <label>Weight (kg)</label>
          <input type="number" [(ngModel)]="newLog.weight" placeholder="75.0">
        </div>
        <div class="form-group">
          <label>Calories Burned</label>
          <input type="number" [(ngModel)]="newLog.caloriesBurned" placeholder="500">
        </div>
        <button (click)="submitLog()">Save Progress</button>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container { padding: 20px; color: white; background: #1a1a1a; border-radius: 12px; }
    .controls { margin-bottom: 20px; display: flex; gap: 10px; }
    select, button, input { padding: 10px; border-radius: 6px; border: none; }
    select, input { background: #333; color: white; }
    button { background: #007bff; color: white; cursor: pointer; }
    .chart-wrapper { background: #222; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .log-progress-form { background: #222; padding: 20px; border-radius: 8px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
  `]
})
export class ProgressDashboardComponent implements OnInit {
    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    progressData: UserProgress[] = [];
    selectedMetric: 'weight' | 'calories' | 'workouts' = 'weight';
    newLog = { weight: 0, caloriesBurned: 0 };

    public lineChartData: ChartData<'line'> = {
        labels: [],
        datasets: [
            {
                data: [],
                label: 'Weight',
                backgroundColor: 'rgba(0,123,255,0.2)',
                borderColor: 'rgba(0,123,255,1)',
                pointBackgroundColor: 'rgba(0,123,255,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(0,123,255,0.8)',
                fill: 'origin',
            }
        ]
    };

    public lineChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false,
                grid: { color: '#333' },
                ticks: { color: '#aaa' }
            },
            x: {
                grid: { color: '#333' },
                ticks: { color: '#aaa' }
            }
        },
        plugins: {
            legend: { display: true, labels: { color: '#fff' } }
        }
    };

    public lineChartType: ChartType = 'line';

    constructor(private progressService: UserProgressService) { }

    ngOnInit() {
        this.loadProgress();
    }

    loadProgress() {
        this.progressService.getProgress().subscribe(data => {
            this.progressData = data;
            this.updateChart();
        });
    }

    updateChart() {
        this.lineChartData.labels = this.progressData.map(p => p.date);

        let datasetLabel = '';
        let datasetData: number[] = [];

        switch (this.selectedMetric) {
            case 'weight':
                datasetLabel = 'Weight (kg)';
                datasetData = this.progressData.map(p => p.weight);
                break;
            case 'calories':
                datasetLabel = 'Calories Burned';
                datasetData = this.progressData.map(p => p.caloriesBurned);
                break;
            case 'workouts':
                datasetLabel = 'Workouts Completed';
                datasetData = this.progressData.map(p => p.workoutsCompleted);
                break;
        }

        this.lineChartData.datasets[0].data = datasetData;
        this.lineChartData.datasets[0].label = datasetLabel;

        this.chart?.update();
    }

    submitLog() {
        this.progressService.logProgress({
            weight: this.newLog.weight,
            caloriesBurned: this.newLog.caloriesBurned,
            workoutsCompleted: 1, // Assuming logging after a workout
            date: new Date().toISOString().split('T')[0]
        }).subscribe(() => {
            this.loadProgress();
            this.newLog = { weight: 0, caloriesBurned: 0 };
        });
    }
}
