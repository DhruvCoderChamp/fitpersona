import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manual-workout-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="builder-container">
      <h2>Build Your Custom Workout</h2>
      
      <div class="header-form">
        <label>Plan Name</label>
        <input type="text" [(ngModel)]="planName" placeholder="My Epic Workout Plan">
      </div>

      <div class="days-container">
        <div *ngFor="let day of days; let dayIndex = index" class="day-card">
          <div class="day-header">
            <h3>Day {{day.dayNumber}}</h3>
            <input type="text" [(ngModel)]="day.muscleGroupLabel" placeholder="Focus: e.g. Chest & Triceps">
            <button (click)="removeDay(dayIndex)" class="remove-btn">Remove Day</button>
          </div>

          <div class="exercises-list">
            <div *ngFor="let ex of day.exercises; let exIndex = index" class="exercise-group">
              <div class="exercise-row">
                <select [(ngModel)]="ex.exerciseId">
                  <option value="0" disabled>Select Exercise</option>
                  <option *ngFor="let availableEx of availableExercises" [value]="availableEx.id">
                    {{availableEx.name}} ({{availableEx.muscleGroup}})
                  </option>
                </select>
                <input type="number" [(ngModel)]="ex.sets" placeholder="Sets">
                <input type="number" [(ngModel)]="ex.reps" placeholder="Reps">
                <input type="number" [(ngModel)]="ex.restTimeSeconds" placeholder="Rest (s)">
                <button (click)="removeExercise(dayIndex, exIndex)" class="remove-btn">×</button>
              </div>
              <div *ngIf="ex.exerciseId != 0 && getExerciseGif(ex.exerciseId)" class="exercise-preview animate-fade-in">
                <img [src]="getExerciseGif(ex.exerciseId)" alt="Exercise Preview">
              </div>
            </div>
            <button (click)="addExercise(dayIndex)" class="add-btn">+ Add Exercise</button>
          </div>
        </div>
      </div>

      <div class="actions">
        <button (click)="addDay()" class="add-day-btn">+ Add Day</button>
        <button (click)="savePlan()" class="save-btn">Save Workout Plan</button>
      </div>
    </div>
  `,
  styles: [`
    .builder-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
    }
    h2 { font-size: 1.5rem; margin-bottom: 1.5rem; }
    .header-form { margin-bottom: 1.5rem; }
    .header-form input {
      width: 100%;
      padding: 0.6rem;
      background: #000;
      border: 1px solid var(--border);
      color: white;
      border-radius: 4px;
    }
    .day-card {
      background: rgba(255, 255, 255, 0.02);
      padding: 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border);
    }
    .day-header { display: flex; gap: 10px; align-items: center; margin-bottom: 1rem; }
    .day-header input { flex: 1; padding: 0.5rem; background: #000; border: 1px solid var(--border); color: #fff; }
    
    .exercise-group {
      padding: 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 0.5rem;
    }
    .exercise-row { display: flex; gap: 8px; align-items: center; }
    select, .exercise-row input {
      padding: 0.5rem;
      background: #000;
      border: 1px solid var(--border);
      color: white;
      font-size: 0.85rem;
    }
    select { flex: 2; }
    .exercise-row input { width: 70px; }
    
    .remove-btn { color: #ff5252; background: none; border: none; cursor: pointer; font-size: 0.8rem; }
    .add-btn { background: none; color: var(--accent); border: 1px solid var(--accent); padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-top: 10px; }
    
    .actions { display: flex; justify-content: space-between; margin-top: 2rem; }
    .save-btn { background: var(--accent); color: #000; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: bold; }
    
    .exercise-preview {
      margin-top: 0.75rem;
      max-width: 150px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .exercise-preview img { width: 100%; height: auto; display: block; }
  `]
})
export class ManualWorkoutBuilderComponent implements OnInit {
  planName: string = '';
  days: any[] = [{ dayNumber: 1, muscleGroupLabel: '', exercises: [] }];
  availableExercises: any[] = [];

  constructor(private apiService: ApiService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.apiService.getAllExercises().subscribe(exs => {
      this.availableExercises = exs;
    });
  }

  addDay() {
    this.days.push({
      dayNumber: this.days.length + 1,
      muscleGroupLabel: '',
      exercises: []
    });
  }

  removeDay(index: number) {
    this.days.splice(index, 1);
    this.days.forEach((d, i) => d.dayNumber = i + 1);
  }

  addExercise(dayIndex: number) {
    this.days[dayIndex].exercises.push({
      exerciseId: 0,
      sets: 3,
      reps: 10,
      restTimeSeconds: 60
    });
  }

  removeExercise(dayIndex: number, exIndex: number) {
    this.days[dayIndex].exercises.splice(exIndex, 1);
  }

  savePlan() {
    const payload = {
      planName: this.planName,
      days: this.days.map(d => ({
        dayNumber: d.dayNumber,
        muscleGroupLabel: d.muscleGroupLabel,
        exercises: d.exercises.filter((e: any) => e.exerciseId !== 0).map((e: any) => ({
          exerciseId: Number(e.exerciseId),
          sets: e.sets,
          reps: e.reps,
          restTimeSeconds: e.restTimeSeconds
        }))
      }))
    };

    console.log('Saving plan payload:', payload);

    this.apiService.createManualPlan(payload).subscribe({
      next: () => {
        alert('Workout Plan saved successfully!');
        this.router.navigate(['/workout/plan']);
      },
      error: (err) => {
        console.error('Error saving plan', err);
        alert('Failed to save workout plan. Please try again.');
      }
    });
  }

  getExerciseGif(id: number | string): string | null {
    const exId = typeof id === 'string' ? parseInt(id, 10) : id;
    const exercise = this.availableExercises.find(e => e.id === exId);
    return exercise ? exercise.gifUrl : null;
  }
}
