import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" *ngIf="auth.isLoggedIn()">
      <div class="nav-brand" routerLink="/dashboard">
        <span class="brand-icon">⚡</span>
        <span class="brand-text">FitPersona</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/workout/preferences" routerLinkActive="active">New Plan</a>
        <a routerLink="/workout/plan" routerLinkActive="active">My Plan</a>
        <a routerLink="/diet/plan" routerLinkActive="active">Diet Plan</a>
        <a routerLink="/profile" routerLinkActive="active">🏅 My Stats</a>
        <a routerLink="/gallery" routerLinkActive="active">Progress Gallery</a>
        <a routerLink="/admin/exercises" routerLinkActive="active" *ngIf="auth.isAdmin()">Admin</a>
        <button class="btn-logout" (click)="logout()">Logout</button>
      </div>
    </nav>
    <main [class.has-nav]="auth.isLoggedIn()">
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(13, 13, 13, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 230, 118, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      z-index: 1000;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      text-decoration: none;
    }
    .brand-icon { font-size: 1.5rem; }
    .brand-text {
      font-size: 1.4rem;
      font-weight: 800;
      background: linear-gradient(135deg, #00e676, #00bfa5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-links a {
      color: #aaa;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: color 0.3s;
      padding: 0.5rem 0;
      position: relative;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #00e676;
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #00e676;
      border-radius: 1px;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: #ccc;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.3s;
    }
    .btn-logout:hover {
      border-color: #ff5252;
      color: #ff5252;
    }
    main.has-nav {
      padding-top: 64px;
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
