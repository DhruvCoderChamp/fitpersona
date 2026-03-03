import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
    { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
    { path: 'workout/preferences', loadComponent: () => import('./features/workout/preferences.component').then(m => m.PreferencesComponent), canActivate: [authGuard] },
    { path: 'workout/plan', loadComponent: () => import('./features/workout/plan.component').then(m => m.PlanComponent), canActivate: [authGuard] },
    { path: 'admin/exercises', loadComponent: () => import('./features/admin/exercises.component').then(m => m.ExercisesComponent), canActivate: [authGuard, adminGuard] },
    { path: '**', redirectTo: '' }
];
