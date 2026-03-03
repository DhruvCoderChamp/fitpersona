import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Exercise } from '../../models/models';

@Component({
    selector: 'app-exercises',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="admin-header animate-fade-in-up">
        <div>
          <h1 class="page-title">🛠️ Exercise <span class="gradient-text">Management</span></h1>
          <p class="page-subtitle">Add, edit, and manage the exercise database</p>
        </div>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Cancel' : '+ Add Exercise' }}
        </button>
      </div>

      <div class="alert alert-error" *ngIf="error">{{error}}</div>
      <div class="alert alert-success" *ngIf="success">{{success}}</div>

      <!-- Add/Edit Form -->
      <div class="form-card card animate-fade-in-up" *ngIf="showForm">
        <h3>{{ editingId ? 'Edit Exercise' : 'New Exercise' }}</h3>
        <form (ngSubmit)="onSave()">
          <div class="form-grid">
            <div class="form-group">
              <label>Name</label>
              <input class="form-control" [(ngModel)]="exForm.name" name="name" required placeholder="Exercise name">
            </div>
            <div class="form-group">
              <label>Muscle Group</label>
              <select class="form-control" [(ngModel)]="exForm.muscleGroup" name="muscleGroup">
                <option *ngFor="let mg of muscleGroups" [value]="mg">{{mg}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Difficulty</label>
              <select class="form-control" [(ngModel)]="exForm.difficulty" name="difficulty">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div class="form-group">
              <label>Equipment</label>
              <select class="form-control" [(ngModel)]="exForm.equipment" name="equipment">
                <option value="GYM">Gym</option>
                <option value="HOME">Home</option>
                <option value="NO_EQUIPMENT">No Equipment</option>
              </select>
            </div>
            <div class="form-group span-2">
              <label>Description</label>
              <input class="form-control" [(ngModel)]="exForm.description" name="description" placeholder="Brief description">
            </div>
            <div class="form-group">
              <label>Sets</label>
              <input type="number" class="form-control" [(ngModel)]="exForm.defaultSets" name="sets">
            </div>
            <div class="form-group">
              <label>Reps</label>
              <input type="number" class="form-control" [(ngModel)]="exForm.defaultReps" name="reps">
            </div>
            <div class="form-group">
              <label>Rest (sec)</label>
              <input type="number" class="form-control" [(ngModel)]="exForm.defaultRestSeconds" name="rest">
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top:1rem;">
            {{ editingId ? 'Update' : 'Add' }} Exercise
          </button>
        </form>
      </div>

      <!-- Filters -->
      <div class="filters animate-fade-in-up">
        <select class="form-control filter-select" [(ngModel)]="filterMuscle" (change)="applyFilter()">
          <option value="">All Muscle Groups</option>
          <option *ngFor="let mg of muscleGroups" [value]="mg">{{mg}}</option>
        </select>
      </div>

      <!-- Exercise Table -->
      <div class="table-container card animate-fade-in-up">
        <table class="exercise-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Muscle</th>
              <th>Difficulty</th>
              <th>Equipment</th>
              <th>Sets/Reps</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ex of filteredExercises">
              <td class="name-cell">{{ex.name}}</td>
              <td><span class="badge muscle">{{ex.muscleGroup}}</span></td>
              <td><span class="badge" [attr.data-diff]="ex.difficulty">{{ex.difficulty}}</span></td>
              <td>{{ex.equipment}}</td>
              <td>{{ex.defaultSets}} × {{ex.defaultReps}}</td>
              <td class="actions-cell">
                <button class="btn-sm edit" (click)="onEdit(ex)">✏️</button>
                <button class="btn-sm delete" (click)="onDelete(ex.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="empty-msg" *ngIf="filteredExercises.length === 0">No exercises found.</p>
      </div>
    </div>
  `,
    styles: [`
    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .form-card {
      margin-bottom: 1.5rem;
    }
    .form-card h3 { margin-bottom: 1rem; }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1rem;
    }
    .span-2 { grid-column: span 2; }
    .filters { margin-bottom: 1rem; }
    .filter-select { max-width: 250px; }

    .table-container { overflow-x: auto; }
    .exercise-table {
      width: 100%;
      border-collapse: collapse;
    }
    .exercise-table th, .exercise-table td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-size: 0.85rem;
    }
    .exercise-table th {
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .exercise-table tr:hover td { background: rgba(255,255,255,0.02); }
    .name-cell { font-weight: 600; }
    .badge {
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge.muscle { background: rgba(0,230,118,0.1); color: var(--accent); }
    .badge[data-diff="BEGINNER"] { background: rgba(105,240,174,0.1); color: var(--success); }
    .badge[data-diff="INTERMEDIATE"] { background: rgba(255,171,64,0.1); color: var(--warning); }
    .badge[data-diff="ADVANCED"] { background: rgba(255,82,82,0.1); color: var(--danger); }
    .actions-cell { white-space: nowrap; }
    .btn-sm {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      transition: transform 0.2s;
    }
    .btn-sm:hover { transform: scale(1.2); }
    .empty-msg {
      text-align: center;
      color: var(--text-muted);
      padding: 2rem;
    }
    @media (max-width: 768px) {
      .admin-header { flex-direction: column; gap: 1rem; }
      .form-grid { grid-template-columns: 1fr; }
      .span-2 { grid-column: span 1; }
    }
  `]
})
export class ExercisesComponent implements OnInit {
    exercises: Exercise[] = [];
    filteredExercises: Exercise[] = [];
    filterMuscle = '';
    showForm = false;
    editingId: number | null = null;
    error = '';
    success = '';

    exForm: any = {
        name: '', muscleGroup: 'CHEST', difficulty: 'INTERMEDIATE',
        equipment: 'GYM', description: '', defaultSets: 3, defaultReps: 10, defaultRestSeconds: 60
    };

    muscleGroups = ['CHEST', 'TRICEPS', 'BICEPS', 'BACK', 'SHOULDERS', 'LEGS', 'CORE'];

    constructor(private api: ApiService) { }

    ngOnInit() { this.loadExercises(); }

    loadExercises() {
        this.api.getAllExercises().subscribe({
            next: (exs) => {
                this.exercises = exs;
                this.applyFilter();
            }
        });
    }

    applyFilter() {
        this.filteredExercises = this.filterMuscle
            ? this.exercises.filter(e => e.muscleGroup === this.filterMuscle)
            : [...this.exercises];
    }

    onEdit(ex: Exercise) {
        this.editingId = ex.id;
        this.exForm = { ...ex };
        this.showForm = true;
    }

    onSave() {
        this.error = '';
        this.success = '';
        const obs = this.editingId
            ? this.api.updateExercise(this.editingId, this.exForm)
            : this.api.createExercise(this.exForm);

        obs.subscribe({
            next: () => {
                this.success = this.editingId ? 'Exercise updated!' : 'Exercise added!';
                this.resetForm();
                this.loadExercises();
            },
            error: (err) => { this.error = err.error?.error || 'Operation failed.'; }
        });
    }

    onDelete(id: number) {
        if (confirm('Delete this exercise?')) {
            this.api.deleteExercise(id).subscribe({
                next: () => {
                    this.success = 'Exercise deleted.';
                    this.loadExercises();
                }
            });
        }
    }

    resetForm() {
        this.editingId = null;
        this.showForm = false;
        this.exForm = {
            name: '', muscleGroup: 'CHEST', difficulty: 'INTERMEDIATE',
            equipment: 'GYM', description: '', defaultSets: 3, defaultReps: 10, defaultRestSeconds: 60
        };
    }
}
