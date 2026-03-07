import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
    { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
    { path: 'progress', loadComponent: () => import('./features/dashboard/progress-graph/progress-dashboard.component').then(m => m.ProgressDashboardComponent), canActivate: [authGuard] },
    { path: 'workout/preferences', loadComponent: () => import('./features/workout/preferences.component').then(m => m.PreferencesComponent), canActivate: [authGuard] },
    { path: 'workout/plan', loadComponent: () => import('./features/workout/plan.component').then(m => m.PlanComponent), canActivate: [authGuard] },
    { path: 'workout/builder', loadComponent: () => import('./features/workout/builder/manual-workout-builder.component').then(m => m.ManualWorkoutBuilderComponent), canActivate: [authGuard] },
    { path: 'diet/form', loadComponent: () => import('./features/diet/diet-form.component').then(m => m.DietFormComponent), canActivate: [authGuard] },
    { path: 'diet/plan', loadComponent: () => import('./features/diet/diet-plan.component').then(m => m.DietPlanComponent), canActivate: [authGuard] },
    { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
    { path: 'gallery', loadComponent: () => import('./features/profile/gallery.component').then(m => m.GalleryComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
