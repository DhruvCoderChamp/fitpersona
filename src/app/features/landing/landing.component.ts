import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content animate-fade-in-up">
        <div class="hero-badge">⚡ THE ULTIMATE AI FITNESS APP</div>
        <h1 class="hero-title">
          Transform Your Body with
          <span class="gradient-text">Intelligent Workouts</span>
        </h1>
        <p class="hero-desc">
          Get personalized day-wise workout plans tailored to your fitness level,
          goals, and equipment. Powered by smart algorithms for maximum results.
        </p>
        <div class="hero-actions">
          <a *ngIf="!auth.isLoggedIn()" routerLink="/register" class="btn btn-primary btn-lg">
            Get Started Free →
          </a>
          <a *ngIf="!auth.isLoggedIn()" routerLink="/login" class="btn btn-secondary btn-lg">
            Sign In
          </a>
          <a *ngIf="auth.isLoggedIn()" routerLink="/dashboard" class="btn btn-primary btn-lg">
            Go to Dashboard →
          </a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">80+</span>
            <span class="stat-label">Exercises</span>
          </div>
          <div class="stat">
            <span class="stat-number">7</span>
            <span class="stat-label">Muscle Groups</span>
          </div>
          <div class="stat">
            <span class="stat-number">3</span>
            <span class="stat-label">Equipment Types</span>
          </div>
          <div class="stat">
            <span class="stat-number">∞</span>
            <span class="stat-label">Plan Combos</span>
          </div>
        </div>
      </div>

      <div class="features-section">
        <h2 class="section-title">Why <span class="gradient-text">FitPersona</span>?</h2>
        <div class="features-grid">
          <div class="feature-card" *ngFor="let f of features; let i = index"
               [style.animation-delay]="(i * 0.1) + 's'">
            <div class="feature-icon">{{f.icon}}</div>
            <h3>{{f.title}}</h3>
            <p>{{f.desc}}</p>
          </div>
        </div>
      </div>

      <div class="testimonials-section">
        <h2 class="section-title">Real People, <span class="gradient-text">Real Results</span></h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="quote-icon">"</div>
            <p class="testimonial-text">FitPersona completely changed how I train. The AI plans adapt to my busy schedule, and the progress tracking keeps me hooked!</p>
            <div class="testimonial-author">
              <div class="author-avatar">👨🏽‍rt</div>
              <div class="author-info">
                <h4>David R.</h4>
                <span>Gained 10lbs Muscle</span>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="quote-icon">"</div>
            <p class="testimonial-text">I've never been stronger. It feels like having a personal trainer in my pocket who knows exactly when to push me to my next PR.</p>
            <div class="testimonial-author">
              <div class="author-avatar">👩🏻‍rt</div>
              <div class="author-info">
                <h4>Sarah M.</h4>
                <span>Improved Strength</span>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="quote-icon">"</div>
            <p class="testimonial-text">The custom workout builder is legendary. Being able to mix AI suggestions with my own favorite exercises is a game changer.</p>
            <div class="testimonial-author">
              <div class="author-avatar">🧑🏿‍rt</div>
              <div class="author-info">
                <h4>Marcus T.</h4>
                <span>Lost 15lbs Fat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cta-section">
        <h2>Ready to Start Your <span class="gradient-text">Fitness Journey</span>?</h2>
        <p>Join now and get your first personalized workout plan in under 60 seconds.</p>
        <a routerLink="/register" class="btn btn-primary btn-lg" *ngIf="!auth.isLoggedIn()">
          Create Free Account →
        </a>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 30% 20%, rgba(0, 230, 118, 0.08) 0%, transparent 50%),
                  radial-gradient(circle at 70% 80%, rgba(0, 191, 165, 0.05) 0%, transparent 50%);
      animation: rotateBg 30s linear infinite;
    }
    @keyframes rotateBg {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .hero-content {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      padding: 8rem 2rem 4rem;
      text-align: center;
    }
    .hero-badge {
      display: inline-block;
      background: var(--accent-glow);
      border: 1px solid rgba(0, 230, 118, 0.3);
      color: var(--accent);
      padding: 0.4rem 1.2rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 1.5rem;
    }
    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }
    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      font-size: 1.15rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto 2.5rem;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 4rem;
    }
    .btn-lg {
      padding: 1rem 2rem;
      font-size: 1rem;
    }
    .hero-stats {
      display: flex;
      gap: 3rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .stat {
      text-align: center;
    }
    .stat-number {
      display: block;
      font-family: 'Outfit', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--accent);
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .features-section {
      max-width: 1100px;
      margin: 0 auto;
      padding: 4rem 2rem 6rem;
    }
    .section-title {
      text-align: center;
      font-size: 2.2rem;
      margin-bottom: 3rem;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 2rem;
      text-align: center;
      transition: all 0.3s;
      animation: fadeInUp 0.6s ease-out forwards;
      opacity: 0;
    }
    .feature-card:hover {
      transform: translateY(-5px);
      border-color: rgba(0, 230, 118, 0.3);
      box-shadow: var(--shadow-glow);
    }
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .feature-card h3 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .testimonials-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem 6rem;
    }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .testimonial-card {
      background: linear-gradient(145deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.9) 100%);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      position: relative;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .testimonial-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,230,118,0.15);
      border-color: rgba(0,230,118,0.3);
    }
    .quote-icon {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      font-size: 4rem;
      font-family: serif;
      color: rgba(0,230,118,0.1);
      line-height: 1;
    }
    .testimonial-text {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-primary);
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
      font-style: italic;
    }
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 1.5rem;
    }
    .author-avatar {
      font-size: 2.5rem;
      background: rgba(255,255,255,0.05);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .author-info h4 {
      margin: 0;
      font-size: 1rem;
      color: var(--accent);
    }
    .author-info span {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .cta-section {
      text-align: center;
      padding: 4rem 2rem 6rem;
      max-width: 700px;
      margin: 0 auto;
    }
    .cta-section h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .cta-section p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.2rem; }
      .hero-content { padding: 5rem 1rem 3rem; }
      .hero-stats { gap: 1.5rem; }
      .stat-number { font-size: 1.8rem; }
      .hero-actions { flex-direction: column; align-items: center; }
    }
  `]
})
export class LandingComponent {
  features = [
    { icon: '🎯', title: 'Personalized Plans', desc: 'Day-wise workout splits tailored to your fitness level and goals' },
    { icon: '💪', title: '7 Muscle Groups', desc: 'Target chest, back, legs, shoulders, biceps, triceps, and core' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Track completed workouts, calories burned, and weekly progress' },
    { icon: '🏠', title: 'Any Equipment', desc: 'Plans for gym, home workouts, or no equipment at all' },
    { icon: '🧠', title: 'Smart Engine', desc: 'AI-ready recommendation engine with adaptive intensity' },
    { icon: '📱', title: 'Mobile Ready', desc: 'Beautiful responsive design that works on any device' }
  ];

  constructor(public auth: AuthService) { }
}
