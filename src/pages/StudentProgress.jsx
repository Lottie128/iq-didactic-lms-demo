import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award, Clock, Target, Download, Share2, LogOut, Trophy, Flame, Star } from 'lucide-react';
import './StudentProgress.css';

const StudentProgress = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const progressData = {
    totalCourses: 8,
    completedCourses: 3,
    inProgress: 2,
    totalHours: 124,
    thisWeek: 8,
    averageScore: 92,
    streak: 7,
    certificates: 3,
    rank: 12,
    points: 2840
  };

  const courseProgress = [
    { id: 1, title: 'Machine Learning Basics', completion: 85, score: 94, timeSpent: 18, status: 'in-progress' },
    { id: 2, title: 'React Development', completion: 100, score: 96, timeSpent: 24, status: 'completed', certificateId: 'CERT-001' },
    { id: 3, title: 'Python Programming', completion: 100, score: 88, timeSpent: 32, status: 'completed', certificateId: 'CERT-002' },
    { id: 4, title: 'Data Science', completion: 45, score: 90, timeSpent: 12, status: 'in-progress' },
    { id: 5, title: 'JavaScript Advanced', completion: 100, score: 92, timeSpent: 28, status: 'completed', certificateId: 'CERT-003' }
  ];

  const recentActivity = [
    { date: '2024-12-08', activity: 'Completed quiz: ML Fundamentals', points: 50 },
    { date: '2024-12-07', activity: 'Watched 3 videos in React Development', points: 30 },
    { date: '2024-12-06', activity: 'Earned badge: Quiz Master', points: 100 },
    { date: '2024-12-05', activity: 'Completed course: Python Programming', points: 200 }
  ];

  const badges = [
    { id: 1, name: 'Early Bird', icon: '🌅', earned: true, date: '2024-11-15' },
    { id: 2, name: 'Quiz Master', icon: '🎯', earned: true, date: '2024-12-06' },
    { id: 3, name: '7-Day Streak', icon: '🔥', earned: true, date: '2024-12-08' },
    { id: 4, name: 'Certificate Collector', icon: '🎓', earned: true, date: '2024-12-01' },
    { id: 5, name: 'Fast Learner', icon: '⚡', earned: false },
    { id: 6, name: 'Community Helper', icon: '🤝', earned: false }
  ];

  const downloadCertificate = (certId) => {
    alert(`Downloading certificate ${certId}... (Demo)`);
  };

  return (
    <div className="progress-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>My Progress</h2>
            <p>Track your learning journey</p>
          </div>
        </div>
        <nav className="header-nav">
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="progress-main fade-in">
        <section className="stats-overview">
          <div className="stat-card glass">
            <Target size={24} />
            <div>
              <p className="stat-value">{progressData.completedCourses}/{progressData.totalCourses}</p>
              <p className="stat-label">Courses Completed</p>
            </div>
          </div>
          <div className="stat-card glass">
            <Clock size={24} />
            <div>
              <p className="stat-value">{progressData.totalHours}h</p>
              <p className="stat-label">Total Hours</p>
            </div>
          </div>
          <div className="stat-card glass">
            <Star size={24} />
            <div>
              <p className="stat-value">{progressData.averageScore}%</p>
              <p className="stat-label">Average Score</p>
            </div>
          </div>
          <div className="stat-card glass highlight">
            <Flame size={24} />
            <div>
              <p className="stat-value">{progressData.streak} Days</p>
              <p className="stat-label">Learning Streak 🔥</p>
            </div>
          </div>
        </section>

        <div className="progress-grid">
          <section className="progress-card glass-strong">
            <div className="card-header">
              <Trophy size={24} />
              <h3>Gamification</h3>
            </div>
            <div className="gamification-stats">
              <div className="game-stat">
                <div className="game-icon">🏆</div>
                <div>
                  <p className="game-value">{progressData.points.toLocaleString()}</p>
                  <p className="game-label">Total Points</p>
                </div>
              </div>
              <div className="game-stat">
                <div className="game-icon">🎖️</div>
                <div>
                  <p className="game-value">#{progressData.rank}</p>
                  <p className="game-label">Global Rank</p>
                </div>
              </div>
            </div>
            <div className="badges-grid">
              {badges.map(badge => (
                <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
                  <div className="badge-icon">{badge.icon}</div>
                  <p className="badge-name">{badge.name}</p>
                  {badge.earned && <span className="badge-date">{badge.date}</span>}
                </div>
              ))}
            </div>
          </section>

          <section className="progress-card glass-strong">
            <div className="card-header">
              <Award size={24} />
              <h3>Certificates Earned</h3>
            </div>
            <div className="certificates-list">
              {courseProgress.filter(c => c.certificateId).map(course => (
                <div key={course.id} className="certificate-item glass">
                  <div className="cert-info">
                    <Award size={20} />
                    <div>
                      <p className="cert-title">{course.title}</p>
                      <p className="cert-id">ID: {course.certificateId}</p>
                    </div>
                  </div>
                  <div className="cert-actions">
                    <button className="btn-icon-small" onClick={() => downloadCertificate(course.certificateId)}>
                      <Download size={14} />
                    </button>
                    <button className="btn-icon-small">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="progress-card glass-strong full-width">
            <div className="card-header">
              <TrendingUp size={24} />
              <h3>Course Progress</h3>
            </div>
            <div className="course-progress-list">
              {courseProgress.map(course => (
                <div key={course.id} className="progress-item">
                  <div className="progress-info">
                    <div className="progress-header">
                      <h4>{course.title}</h4>
                      <span className={`status-badge ${course.status}`}>
                        {course.status === 'completed' ? '✓ Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.completion}%` }} />
                    </div>
                    <div className="progress-meta">
                      <span>{course.completion}% complete</span>
                      <span>Score: {course.score}%</span>
                      <span>{course.timeSpent}h spent</span>
                    </div>
                  </div>
                  {course.status === 'completed' && (
                    <button className="btn btn-secondary" onClick={() => downloadCertificate(course.certificateId)}>
                      <Award size={14} />
                      Certificate
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="progress-card glass-strong">
            <div className="card-header">
              <Clock size={24} />
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-list">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-date">{item.date}</div>
                  <div className="activity-content">
                    <p>{item.activity}</p>
                    <span className="activity-points">+{item.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentProgress;