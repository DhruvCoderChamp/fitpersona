import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { UserProfile, UserProfileUpdateRequest } from '../../models/models';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="profile-header animate-fade-in-up">
        <h1 class="page-title">My <span class="gradient-text">Profile</span></h1>
        <p class="page-subtitle">Manage your personal information and settings</p>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
      </div>

      <div *ngIf="profile && !loading" class="profile-content animate-fade-in-up">
        <div class="profile-card card">
          <div class="profile-avatar-section">
            <div class="avatar-circle">
              <span class="avatar-emoji">⚡</span>
            </div>
            <div class="avatar-info">
              <h2>{{profile.name}}</h2>
              <p>{{profile.email}}</p>
              <span class="role-badge">{{profile.role}}</span>
            </div>
          </div>

          <form (ngSubmit)="saveProfile()" #profileForm="ngForm" class="profile-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" [(ngModel)]="editData.name" required class="form-control">
              </div>

              <div class="form-group">
                <label for="age">Age</label>
                <input type="number" id="age" name="age" [(ngModel)]="editData.age" class="form-control">
              </div>

              <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" name="gender" [(ngModel)]="editData.gender" class="form-control">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div class="form-group">
                <label for="height">Height (cm)</label>
                <input type="number" id="height" name="height" [(ngModel)]="editData.height" class="form-control">
              </div>

              <div class="form-group">
                <label for="weight">Weight (kg)</label>
                <input type="number" id="weight" name="weight" [(ngModel)]="editData.weight" class="form-control">
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="saving || !profileForm.dirty">
                {{saving ? 'Saving...' : 'Save Changes'}}
              </button>
            </div>

            <div *ngIf="message" class="alert" [class.alert-success]="messageType === 'success'" [class.alert-error]="messageType === 'error'">
              {{message}}
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .profile-header { margin-bottom: 2rem; }
    .profile-content { max-width: 800px; margin: 0 auto; }
    
    .profile-avatar-section {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    
    .avatar-circle {
      width: 100px;
      height: 100px;
      background: var(--accent-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-glow);
    }
    
    .avatar-emoji { font-size: 3rem; }
    
    .avatar-info h2 { margin: 0; font-size: 1.8rem; }
    .avatar-info p { color: var(--text-muted); margin: 0.2rem 0 0.5rem; }
    
    .role-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      background: rgba(0, 230, 118, 0.1);
      color: var(--accent);
      border-radius: 4px;
      text-transform: uppercase;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.8rem 1rem;
      color: white;
      transition: all 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--accent);
      background: rgba(255,255,255,0.08);
      box-shadow: 0 0 0 2px rgba(0,230,118,0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .alert {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
    }
    .alert-success { background: rgba(0,230,118,0.1); color: var(--success); border: 1px solid rgba(0,230,118,0.2); }
    .alert-error { background: rgba(255,82,82,0.1); color: var(--danger); border: 1px solid rgba(255,82,82,0.2); }

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

    @media (max-width: 600px) {
      .profile-avatar-section { flex-direction: column; text-align: center; gap: 1rem; }
    }
  `]
})
export class ProfileComponent implements OnInit {
    profile: UserProfile | null = null;
    editData: UserProfileUpdateRequest = {};
    loading = true;
    saving = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        this.api.getUserProfile().subscribe({
            next: (profile) => {
                this.profile = profile;
                this.editData = {
                    name: profile.name,
                    age: profile.age,
                    gender: profile.gender,
                    height: profile.height,
                    weight: profile.weight
                };
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.message = 'Failed to load profile';
                this.messageType = 'error';
            }
        });
    }

    saveProfile() {
        this.saving = true;
        this.message = '';

        this.api.updateProfile(this.editData).subscribe({
            next: (updated) => {
                this.profile = updated;
                this.saving = false;
                this.message = 'Profile updated successfully!';
                this.messageType = 'success';
                setTimeout(() => this.message = '', 3000);
            },
            error: () => {
                this.saving = false;
                this.message = 'Failed to update profile';
                this.messageType = 'error';
            }
        });
    }
}
