import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { UserProfile, UserProfileUpdateRequest } from '../../models/models';

interface LoginStreak {
  streak: number;
  lastLoginDate: string;
  totalPoints: number;
  totalLogins: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">

      <!-- ── MOTIVATION HERO ────────────────────────────────────────────── -->
      <div class="motivation-hero animate-fade-in-up" *ngIf="profile">
        <div class="hero-left">
          <div class="avatar-ring" [attr.data-level]="userLevel">
            <div class="avatar-inner">
              <span class="avatar-emoji">{{getLevelEmoji()}}</span>
            </div>
            <svg class="ring-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8"/>
              <circle cx="60" cy="60" r="54" fill="none" [attr.stroke]="getLevelColor()"
                      stroke-width="8" stroke-linecap="round"
                      [attr.stroke-dasharray]="339.3"
                      [attr.stroke-dashoffset]="getRingOffset()"
                      transform="rotate(-90 60 60)"
                      style="transition: stroke-dashoffset 1.5s ease-out;"/>
            </svg>
          </div>

          <div class="hero-info">
            <h1 class="hero-name">{{profile.name}}</h1>
            <p class="hero-email">{{profile.email}}</p>
            <div class="level-badge" [style.background]="getLevelGradient()">
              {{userLevel}} · {{getLevelTitle()}}
            </div>
          </div>
        </div>

        <!-- Points & Streak Row -->
        <div class="motivation-stats">
          <div class="m-stat streak-card" [class.on-fire]="streak.streak >= 3">
            <div class="m-stat-icon">🔥</div>
            <div class="m-stat-value">{{streak.streak}}</div>
            <div class="m-stat-label">Day Streak</div>
            <div class="streak-msg" *ngIf="streak.streak === 0">Start your streak today!</div>
            <div class="streak-msg" *ngIf="streak.streak === 1">🌱 First day — keep going!</div>
            <div class="streak-msg" *ngIf="streak.streak === 2">⚡ 2 days strong!</div>
            <div class="streak-msg" *ngIf="streak.streak >= 3 && streak.streak < 7">🔥 On fire! {{streak.streak}} days!</div>
            <div class="streak-msg" *ngIf="streak.streak >= 7">🏆 WEEK WARRIOR!</div>
          </div>

          <div class="m-stat">
            <div class="m-stat-icon">⭐</div>
            <div class="m-stat-value">{{streak.totalPoints}}</div>
            <div class="m-stat-label">Activity Points</div>
            <div class="streak-msg">+{{pointsEarnedToday}} points today</div>
          </div>

          <div class="m-stat">
            <div class="m-stat-icon">📅</div>
            <div class="m-stat-value">{{streak.totalLogins}}</div>
            <div class="m-stat-label">Total Sessions</div>
            <div class="streak-msg">Active since day 1</div>
          </div>

          <div class="m-stat">
            <div class="m-stat-icon">🏅</div>
            <div class="m-stat-value">{{pointsToNextLevel}}</div>
            <div class="m-stat-label">Pts to Next Level</div>
            <div class="streak-msg">Level up coming!</div>
          </div>
        </div>
      </div>

      <!-- ── MOTIVATIONAL QUOTE ─────────────────────────────────────────── -->
      <div class="quote-card animate-fade-in-up">
        <div class="quote-icon">"</div>
        <p class="quote-text">{{todayQuote.text}}</p>
        <span class="quote-author">— {{todayQuote.author}}</span>
      </div>

      <!-- ── ACHIEVEMENTS ───────────────────────────────────────────────── -->
      <div class="achievements-section card animate-fade-in-up">
        <h3>🏆 Achievements</h3>
        <div class="achievements-grid">
          <div *ngFor="let a of achievements" class="achievement-badge" [class.unlocked]="a.unlocked">
            <span class="ach-icon">{{a.icon}}</span>
            <span class="ach-name">{{a.name}}</span>
            <span class="ach-desc">{{a.desc}}</span>
          </div>
        </div>
      </div>

      <!-- ── LEVEL PROGRESS ─────────────────────────────────────────────── -->
      <div class="level-progress-card card animate-fade-in-up">
        <div class="level-header">
          <h3>📊 Level Progress</h3>
          <span class="level-name-badge">{{userLevel}} — {{getLevelTitle()}}</span>
        </div>
        <div class="level-bar-wrap">
          <div class="level-bar">
            <div class="level-fill" [style.width.%]="levelProgressPercent"></div>
          </div>
          <span class="level-pct">{{levelProgressPercent | number:'1.0-0'}}%</span>
        </div>
        <div class="level-milestones">
          <span *ngFor="let lv of levels" class="lv-chip" [class.done]="streak.totalPoints >= lv.pts" [class.current]="isCurrentLevel(lv)">
            {{lv.icon}} {{lv.label}}<br><small>{{lv.pts}} pts</small>
          </span>
        </div>
      </div>

      <!-- ── EDIT PROFILE ───────────────────────────────────────────────── -->
      <div class="profile-card card animate-fade-in-up" *ngIf="profile">
        <div class="edit-header">
          <h3>⚙️ Health & Personal Info</h3>
          <p class="edit-sub">Keep this updated — it powers your BMI, water goals & calorie estimates.</p>
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
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
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

          <div *ngIf="message" class="alert"
               [class.alert-success]="messageType === 'success'"
               [class.alert-error]="messageType === 'error'">
            {{message}}
          </div>
        </form>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
      </div>
    </div>
  `,
  styles: [`
    /* ── Motivation Hero ── */
    .motivation-hero {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg, 20px);
      padding: 2rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    .motivation-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at top left, rgba(0,230,118,0.06) 0%, transparent 65%);
      pointer-events: none;
    }
    .hero-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    /* Avatar Ring */
    .avatar-ring {
      position: relative;
      width: 110px;
      height: 110px;
      flex-shrink: 0;
    }
    .ring-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .avatar-inner {
      position: absolute;
      inset: 10px;
      background: var(--bg-secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-emoji { font-size: 2.8rem; }

    .hero-name { font-size: 1.8rem; font-weight: 800; margin: 0 0 0.2rem; }
    .hero-email { color: var(--text-muted); font-size: 0.9rem; margin: 0 0 0.6rem; }
    .level-badge {
      display: inline-block;
      padding: 0.3rem 0.9rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #000;
    }

    /* Motivation Stats */
    .motivation-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      flex: 1;
    }
    .m-stat {
      background: rgba(0,0,0,0.25);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1rem;
      text-align: center;
      transition: all 0.3s;
    }
    .m-stat:hover { transform: translateY(-2px); border-color: rgba(0,230,118,0.2); }
    .streak-card.on-fire {
      border-color: rgba(255,160,0,0.4);
      background: rgba(255,100,0,0.07);
      animation: pulse-fire 2s ease-in-out infinite;
    }
    @keyframes pulse-fire {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,120,0,0); }
      50% { box-shadow: 0 0 20px 4px rgba(255,120,0,0.2); }
    }
    .m-stat-icon { font-size: 1.8rem; margin-bottom: 0.25rem; }
    .m-stat-value { font-size: 1.8rem; font-weight: 900; font-family: 'Outfit', sans-serif; color: var(--accent); line-height: 1; }
    .m-stat-label { font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.2rem; }
    .streak-msg { font-size: 0.68rem; color: var(--text-muted); font-style: italic; margin-top: 0.25rem; }

    /* Quote Card */
    .quote-card {
      background: linear-gradient(135deg, rgba(0,230,118,0.06), rgba(0,191,165,0.04));
      border: 1px solid rgba(0,230,118,0.15);
      border-left: 3px solid var(--accent);
      border-radius: var(--radius-md);
      padding: 1.5rem 2rem;
      margin-bottom: 1.5rem;
      position: relative;
    }
    .quote-icon {
      font-size: 4rem;
      font-family: Georgia, serif;
      color: rgba(0,230,118,0.2);
      position: absolute;
      top: -0.5rem;
      left: 1rem;
      line-height: 1;
    }
    .quote-text {
      font-size: 1.05rem;
      font-style: italic;
      color: var(--text-primary);
      margin: 0.5rem 0 0.5rem 1.5rem;
      line-height: 1.6;
    }
    .quote-author { font-size: 0.82rem; color: var(--text-muted); margin-left: 1.5rem; }

    /* Achievements */
    .achievements-section { margin-bottom: 1.5rem; }
    .achievements-section h3 { margin-bottom: 1.2rem; }
    .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem; }
    .achievement-badge {
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
      filter: grayscale(1);
      opacity: 0.4;
      transition: all 0.4s;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .achievement-badge.unlocked {
      filter: grayscale(0);
      opacity: 1;
      border-color: rgba(255,215,0,0.3);
      background: rgba(255,215,0,0.05);
      box-shadow: 0 0 15px rgba(255,215,0,0.1);
    }
    .ach-icon { font-size: 2rem; }
    .ach-name { font-size: 0.82rem; font-weight: 700; }
    .ach-desc { font-size: 0.68rem; color: var(--text-muted); }

    /* Level Progress */
    .level-progress-card { margin-bottom: 1.5rem; }
    .level-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .level-header h3 { margin: 0; }
    .level-name-badge { font-size: 0.82rem; background: rgba(0,230,118,0.1); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 12px; font-weight: 700; }
    .level-bar-wrap { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
    .level-bar { flex: 1; height: 10px; background: var(--bg-secondary); border-radius: 5px; overflow: hidden; }
    .level-fill { height: 100%; background: var(--accent-gradient); border-radius: 5px; transition: width 1.5s ease-out; }
    .level-pct { font-size: 0.85rem; font-weight: 700; color: var(--accent); min-width: 36px; }
    .level-milestones { display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 0.5rem; }
    .lv-chip { text-align: center; padding: 0.5rem 0.3rem; border-radius: 8px; font-size: 0.72rem; border: 1px solid var(--border); opacity: 0.4; transition: all 0.3s; line-height: 1.4; }
    .lv-chip.done { opacity: 1; border-color: rgba(255,215,0,0.4); background: rgba(255,215,0,0.05); }
    .lv-chip.current { opacity: 1; border-color: var(--accent); background: rgba(0,230,118,0.08); box-shadow: 0 0 10px rgba(0,230,118,0.15); }
    .lv-chip small { color: var(--text-muted); font-size: 0.62rem; display: block; }

    /* Edit Profile */
    .profile-card { margin-bottom: 1.5rem; }
    .edit-header { margin-bottom: 1.5rem; }
    .edit-header h3 { margin-bottom: 0.25rem; }
    .edit-sub { font-size: 0.83rem; color: var(--text-muted); margin: 0; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.4rem; font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }
    .form-control { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem 1rem; color: white; transition: all 0.3s; box-sizing: border-box; }
    .form-control:focus { outline: none; border-color: var(--accent); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 2px rgba(0,230,118,0.1); }
    .form-control option { color: #000; background: #fff; }
    .form-actions { display: flex; justify-content: flex-end; }
    .alert { margin-top: 1rem; padding: 0.85rem 1rem; border-radius: 8px; font-size: 0.9rem; text-align: center; }
    .alert-success { background: rgba(0,230,118,0.1); color: var(--success); border: 1px solid rgba(0,230,118,0.2); }
    .alert-error { background: rgba(255,82,82,0.1); color: var(--danger); border: 1px solid rgba(255,82,82,0.2); }

    .loading { text-align: center; padding: 4rem; }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in-up { animation: fadeIn 0.5s ease-out forwards; }

    @media (max-width: 768px) {
      .motivation-hero { flex-direction: column; padding: 1.5rem; }
      .hero-left { flex-direction: column; text-align: center; }
      .motivation-stats { grid-template-columns: repeat(2, 1fr); min-width: 100%; width: 100%; }
      .level-header { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
      .level-milestones { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
      .achievements-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
      .form-grid { grid-template-columns: 1fr; }
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

  streak: LoginStreak = { streak: 0, lastLoginDate: '', totalPoints: 0, totalLogins: 0 };
  pointsEarnedToday = 0;
  userLevel = 'Bronze';
  levelProgressPercent = 0;
  pointsToNextLevel = 0;

  todayQuote = { text: '', author: '' };

  levels = [
    { label: 'Bronze',   icon: '🥉', pts: 0,    color: '#cd7f32' },
    { label: 'Silver',   icon: '🥈', pts: 100,  color: '#aaa' },
    { label: 'Gold',     icon: '🥇', pts: 300,  color: '#ffd700' },
    { label: 'Platinum', icon: '💎', pts: 600,  color: '#00e5ff' },
    { label: 'Diamond',  icon: '🔷', pts: 1000, color: '#7c4dff' },
    { label: 'Legend',   icon: '👑', pts: 2000, color: '#ff6d00' }
  ];

  achievements = [
    { icon: '🌱', name: 'First Step',    desc: 'Login for the first time',   threshold: 1,   key: 'logins' },
    { icon: '🔥', name: 'On Fire',       desc: '3-day login streak',         threshold: 3,   key: 'streak' },
    { icon: '⚡', name: 'Spark',         desc: 'Earn 50 activity points',    threshold: 50,  key: 'points' },
    { icon: '🏋️', name: 'Gym Rat',       desc: 'Login 10 times',             threshold: 10,  key: 'logins' },
    { icon: '🏆', name: 'Week Warrior',  desc: '7-day streak',               threshold: 7,   key: 'streak' },
    { icon: '💯', name: 'Centurion',     desc: 'Earn 100 activity points',   threshold: 100, key: 'points' },
    { icon: '🔮', name: 'Dedicated',     desc: 'Login 25 times',             threshold: 25,  key: 'logins' },
    { icon: '👑', name: 'Legend',        desc: 'Earn 500 activity points',   threshold: 500, key: 'points' }
  ].map(a => ({ ...a, unlocked: false }));

  private readonly quotes = [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "The groundwork for all happiness is good health.", author: "Leigh Hunt" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
    { text: "No matter how slow you go, you're still lapping everyone on the couch.", author: "Unknown" },
    { text: "Strength does not come from the physical capacity. It comes from an indomitable will.", author: "Gandhi" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Sweat is just fat crying.", author: "Unknown" },
    { text: "A year from now you'll wish you had started today.", author: "Karen Lamb" },
    { text: "Your health is an investment, not an expense.", author: "Unknown" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
    { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" }
  ];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadProfile();
    this.processLoginStreak();
    this.todayQuote = this.getTodayQuote();
  }

  loadProfile() {
    this.api.getUserProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.editData = { name: profile.name, age: profile.age, gender: profile.gender, height: profile.height, weight: profile.weight };
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  saveProfile() {
    this.saving = true;
    this.message = '';
    this.api.updateProfile(this.editData).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.saving = false;
        this.message = '✅ Profile updated successfully!';
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

  // ── Streak & Points Engine ─────────────────────────────────────────────

  private processLoginStreak() {
    const stored = localStorage.getItem('fitpersona_streak');
    const data: LoginStreak = stored
      ? JSON.parse(stored)
      : { streak: 0, lastLoginDate: '', totalPoints: 0, totalLogins: 0 };

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (data.lastLoginDate === today) {
      // Already counted today — no points, just load
      this.pointsEarnedToday = 0;
    } else {
      // New day login
      if (data.lastLoginDate === yesterday) {
        data.streak += 1;           // Consecutive day — extend streak
      } else {
        data.streak = 1;            // Streak broken — reset to 1
      }
      data.lastLoginDate = today;
      data.totalLogins += 1;

      // Points: 10 base + 5 bonus per streak day (capped at 50 bonus)
      const earnedToday = 10 + Math.min(data.streak * 5, 50);
      data.totalPoints += earnedToday;
      this.pointsEarnedToday = earnedToday;

      localStorage.setItem('fitpersona_streak', JSON.stringify(data));
    }

    this.streak = data;
    this.computeLevel();
    this.computeAchievements();
  }

  private computeLevel() {
    const pts = this.streak.totalPoints;
    let currentLevel = this.levels[0];
    let nextLevel = this.levels[1];

    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (pts >= this.levels[i].pts) {
        currentLevel = this.levels[i];
        nextLevel = this.levels[i + 1] || this.levels[i];
        break;
      }
    }

    this.userLevel = currentLevel.label;
    const range = nextLevel.pts - currentLevel.pts;
    const progress = pts - currentLevel.pts;
    this.levelProgressPercent = range > 0 ? Math.min((progress / range) * 100, 100) : 100;
    this.pointsToNextLevel = Math.max(nextLevel.pts - pts, 0);
  }

  private computeAchievements() {
    this.achievements = this.achievements.map(a => ({
      ...a,
      unlocked: a.key === 'streak' ? this.streak.streak >= a.threshold
               : a.key === 'logins' ? this.streak.totalLogins >= a.threshold
               : this.streak.totalPoints >= a.threshold
    }));
  }

  private getTodayQuote() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return this.quotes[dayOfYear % this.quotes.length];
  }

  // ── Template Helpers ──────────────────────────────────────────────────

  getLevelEmoji(): string {
    const map: Record<string, string> = {
      Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎', Diamond: '🔷', Legend: '👑'
    };
    return map[this.userLevel] || '⚡';
  }

  getLevelColor(): string {
    const map: Record<string, string> = {
      Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: '#ffd700',
      Platinum: '#00e5ff', Diamond: '#7c4dff', Legend: '#ff6d00'
    };
    return map[this.userLevel] || '#00e676';
  }

  getLevelGradient(): string {
    const map: Record<string, string> = {
      Bronze: 'linear-gradient(135deg, #cd7f32, #a0522d)',
      Silver: 'linear-gradient(135deg, #c0c0c0, #808080)',
      Gold: 'linear-gradient(135deg, #ffd700, #ffa500)',
      Platinum: 'linear-gradient(135deg, #00e5ff, #00bcd4)',
      Diamond: 'linear-gradient(135deg, #7c4dff, #3d5afe)',
      Legend: 'linear-gradient(135deg, #ff6d00, #ff1744)'
    };
    return map[this.userLevel] || 'linear-gradient(135deg, #00e676, #00bfa5)';
  }

  getLevelTitle(): string {
    const titles: Record<string, string> = {
      Bronze: 'Beginner', Silver: 'Committed', Gold: 'Dedicated',
      Platinum: 'Elite', Diamond: 'Champion', Legend: 'Legend'
    };
    return titles[this.userLevel] || '';
  }

  getRingOffset(): number {
    // 339.3 = circumference (2πr = 2×π×54)
    return 339.3 * (1 - this.levelProgressPercent / 100);
  }

  isCurrentLevel(lv: any): boolean {
    return lv.label === this.userLevel;
  }
}
