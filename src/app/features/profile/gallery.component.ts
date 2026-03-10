import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ProgressPhotoResponse } from '../../models/models';

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="page-container">
      <div class="gallery-header animate-fade-in-up">
        <h1 class="page-title">Progress <span class="gradient-text">Gallery</span></h1>
        <p class="page-subtitle">Track your physical transformation over time</p>
      </div>

      <div class="upload-section card animate-fade-in-up">
        <h3>Upload New Photo</h3>
        <div class="upload-controls">
          <div class="file-input-wrapper">
            <button class="btn btn-outline">Choose Photo</button>
            <input type="file" (change)="onFileSelected($event)" accept="image/*">
            <span class="file-name" *ngIf="selectedFile">{{selectedFile.name}}</span>
          </div>
          <input type="text" [(ngModel)]="notes" placeholder="Add a note (e.g., 'Morning weigh-in')" class="form-control">
          <button class="btn btn-primary" (click)="upload()" [disabled]="!selectedFile || uploading">
            {{uploading ? 'Uploading...' : 'Upload Photo'}}
          </button>
        </div>
      </div>

      <div class="comparison-section card animate-fade-in-up" *ngIf="photos.length >= 2">
        <div class="section-header">
          <h3>Before vs After</h3>
          <button class="btn btn-sm" (click)="toggleComparisonMode()">
            {{comparisonMode ? 'Close Comparison' : 'Open Comparison'}}
          </button>
        </div>

        <div *ngIf="comparisonMode" class="comparison-tool">
          <div class="comparison-selectors">
            <div class="selector">
              <label>Before:</label>
              <select [(ngModel)]="beforeIndex" class="form-control">
                <option *ngFor="let p of photos; let i = index" [value]="i">{{p.uploadDate | date:'mediumDate'}}</option>
              </select>
            </div>
            <div class="selector">
              <label>After:</label>
              <select [(ngModel)]="afterIndex" class="form-control">
                <option *ngFor="let p of photos; let i = index" [value]="i">{{p.uploadDate | date:'mediumDate'}}</option>
              </select>
            </div>
          </div>

          <div class="comparison-display">
            <div class="comparison-card">
              <span class="badge">BEFORE ({{photos[beforeIndex].uploadDate | date:'shortDate'}})</span>
              <img [src]="getFullUrl(photos[beforeIndex].photoUrl)" alt="Before">
              <p class="photo-notes" *ngIf="photos[beforeIndex].notes">{{photos[beforeIndex].notes}}</p>
            </div>
            <div class="comparison-card">
              <span class="badge badge-accent">AFTER ({{photos[afterIndex].uploadDate | date:'shortDate'}})</span>
              <img [src]="getFullUrl(photos[afterIndex].photoUrl)" alt="After">
              <p class="photo-notes" *ngIf="photos[afterIndex].notes">{{photos[afterIndex].notes}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="gallery-grid animate-fade-in-up">
        <div class="photo-card card" *ngFor="let photo of photos">
          <div class="photo-wrapper">
            <img [src]="getFullUrl(photo.photoUrl)" [alt]="photo.notes">
          </div>
          <div class="photo-info">
            <span class="photo-date">{{photo.uploadDate | date:'mediumDate'}}</span>
            <p class="photo-notes" *ngIf="photo.notes">{{photo.notes}}</p>
          </div>
        </div>
      </div>

      <div *ngIf="photos.length === 0 && !loading" class="empty-state card">
        <p>No progress photos uploaded yet. Start tracking your journey!</p>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
      </div>
    </div>
  `,
    styles: [`
    .gallery-header { margin-bottom: 2rem; }
    
    .upload-section { margin-bottom: 2rem; }
    .upload-controls { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-top: 1rem; }
    
    .file-input-wrapper { position: relative; overflow: hidden; display: inline-block; }
    .file-input-wrapper input[type=file] {
      position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
    }
    .file-name { margin-left: 1rem; font-size: 0.9rem; color: var(--text-muted); }

    .comparison-section { margin-bottom: 2rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; }
    .comparison-tool { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border); }
    .comparison-selectors { display: flex; gap: 2rem; margin-bottom: 2rem; }
    .selector { display: flex; align-items: center; gap: 1rem; }
    
    .comparison-display { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .comparison-card { position: relative; text-align: center; }
    .comparison-card img { width: 100%; border-radius: 12px; border: 2px solid var(--border); }
    .badge {
      position: absolute; top: 1rem; left: 1rem;
      background: rgba(0,0,0,0.7); color: white;
      padding: 0.3rem 0.8rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700;
      backdrop-filter: blur(4px);
    }
    .badge-accent { background: var(--accent); color: black; }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .photo-card { padding: 0.5rem; overflow: hidden; }
    .photo-wrapper { width: 100%; aspect-ratio: 1; border-radius: 8px; overflow: hidden; }
    .photo-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
    .photo-card:hover img { transform: scale(1.05); }
    
    .photo-info { padding: 1rem 0.5rem; }
    .photo-date { font-size: 0.75rem; color: var(--accent); font-weight: 600; text-transform: uppercase; }
    .photo-notes { font-size: 0.9rem; margin-top: 0.3rem; color: var(--text-secondary); }

    .empty-state { text-align: center; padding: 4rem; color: var(--text-muted); }
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

    @media (max-width: 768px) {
      .comparison-display { grid-template-columns: 1fr; }
      .comparison-selectors { flex-direction: column; gap: 1rem; }
    }
  `]
})
export class GalleryComponent implements OnInit {
    photos: ProgressPhotoResponse[] = [];
    loading = true;
    uploading = false;
    selectedFile: File | null = null;
    notes = '';

    comparisonMode = false;
    beforeIndex = 0;
    afterIndex = 0;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadPhotos();
    }

    loadPhotos() {
        this.api.getPhotos().subscribe({
            next: (photos) => {
                this.photos = photos;
                this.loading = false;
                if (photos.length >= 2) {
                    this.beforeIndex = photos.length - 1; // Oldest
                    this.afterIndex = 0; // Newest
                }
            },
            error: () => this.loading = false
        });
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    upload() {
        if (!this.selectedFile) return;

        this.uploading = true;
        this.api.uploadPhoto(this.selectedFile, this.notes).subscribe({
            next: (photo) => {
                this.photos.unshift(photo);
                this.selectedFile = null;
                this.notes = '';
                this.uploading = false;
                if (this.photos.length >= 2) {
                    this.afterIndex = 0;
                }
            },
            error: () => this.uploading = false
        });
    }

    getFullUrl(url: string) {
        if (!url) return '';
        if (url.startsWith('http')) {
            return url;
        }
        // Fallback for local uploads when AWS is disabled
        return `/api${url}`;
    }

    toggleComparisonMode() {
        this.comparisonMode = !this.comparisonMode;
    }
}
