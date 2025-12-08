import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Zap, LogOut } from 'lucide-react';
import './Achievements.css';

const Achievements = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const stats = {
    level: 8,
    xp: 2450,
    nextLevelXp: 3000,
    rank: 12,
    totalBadges: 8,
    earnedBadges: 6
  };

  const badges = [
    {
      id: 1,
      name: 'First Course',
      description: 'Complete your first course',
      icon: '🎓',
      earned: true,
      earnedDate: '2024-10-15',
      rarity: 'common',
      xp: 100
    },
    {
      id: 2,
      name: 'Quiz Master',
      description: 'Get 100% on any quiz',
      icon: '🎯',
      earned: true,
      earnedDate: '2024-11-02',
      rarity: 'rare',
      xp: 200
    },
    {
      id: 3,
      name: 'Perfect Score',
      description: 'Get perfect scores on 5 quizzes',
      icon: '⭐',
      earned: true,
      earnedDate: '2024-11-20',
      rarity: 'epic',
      xp: 500
    },
    {
      id: 4,
      name: 'Week Warrior',
      description: 'Maintain 7-day learning streak',
      icon: '🔥',
      earned: true,
      earnedDate: '2024-12-05',
      rarity: 'rare',
      xp: 250
    },
    {
      id: 5,
      name: 'Social Butterfly',
      description: 'Post 10 discussion messages',
      icon: '💌',
      earned: true,
      earnedDate: '2024-11-28',
      rarity: 'common',
      xp: 150
    },
    {
      id: 6,
      name: 'Fast Learner',
      description: 'Complete a course in under 1 week',
      icon: '⚡',
      earned: true,
      earnedDate: '2024-12-01',
      rarity: 'rare',
      xp: 300
    },
    {
      id: 7,
      name: 'Night Owl',
      description: 'Complete 20 lessons after 10 PM',
      icon: '🦉',
      earned: false,
      progress: 12,
      total: 20,
      rarity: 'rare',
      xp: 200
    },
    {
      id: 8,
      name: 'Early Bird',
      description: 'Complete 20 lessons before 8 AM',
      icon: '🌅',
      earned: false,
      progress: 8,
      total: 20,
      rarity: 'rare',
      xp: 200
    },
    {
      id: 9,
      name: 'Bookworm',
      description: 'Spend 100 hours learning',
      icon: '📚',
      earned: false,
      progress: 72,
      total: 100,
      rarity: 'epic',
      xp: 500
    },
    {
      id: 10,
      name: 'Helping Hand',
      description: 'Get 50 upvotes on your answers',
      icon: '🤝',
      earned: false,
      progress: 23,
      total: 50,
      rarity: 'epic',
      xp: 400
    },
    {
      id: 11,
      name: 'Course Creator',
      description: 'Create your first course (Teachers only)',
      icon: '🎨',
      earned: false,
      rarity: 'legendary',
      xp: 1000
    },
    {
      id: 12,
      name: 'Veteran',
      description: 'Active for 365 days',
      icon: '🏆',
      earned: false,
      progress: 89,
      total: 365,
      rarity: 'legendary',
      xp: 1500
    }
  ];

  const rarityColors = {
    common: '#9ca3af',
    rare: '#60a5fa',
    epic: '#a78bfa',
    legendary: '#fbbf24'
  };

  return (
    <div className="achievements-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>Achievements</h2>
            <p>{stats.earnedBadges} of {stats.totalBadges} unlocked</p>
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

      <main className="achievements-main fade-in">
        <section className="level-card glass-strong">
          <div className="level-header">
            <Trophy size={32} />
            <div>
              <h2>Level {stats.level}</h2>
              <p>{stats.xp} / {stats.nextLevelXp} XP</p>
            </div>
            <div className="rank-badge">
              <span className="rank-label">Global Rank</span>
              <span className="rank-number">#{stats.rank}</span>
            </div>
          </div>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }} />
          </div>
          <p className="xp-remaining">{stats.nextLevelXp - stats.xp} XP to next level</p>
        </section>

        <section className="badges-section">
          <h3>Badge Collection</h3>
          <div className="badges-grid">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`badge-card glass ${badge.earned ? 'earned' : 'locked'}`}
                style={{
                  borderColor: badge.earned ? rarityColors[badge.rarity] : 'transparent'
                }}
              >
                <div className="badge-icon-large">{badge.icon}</div>
                <h4 className="badge-name">{badge.name}</h4>
                <p className="badge-description">{badge.description}</p>
                {badge.earned ? (
                  <div className="badge-earned-info">
                    <span className="earned-badge">✓ Unlocked</span>
                    <span className="earned-date">{badge.earnedDate}</span>
                    <span className="badge-xp">+{badge.xp} XP</span>
                  </div>
                ) : badge.progress !== undefined ? (
                  <div className="badge-progress">
                    <div className="progress-bar small">
                      <div
                        className="progress-fill"
                        style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                      />
                    </div>
                    <span className="progress-text">{badge.progress} / {badge.total}</span>
                  </div>
                ) : (
                  <div className="badge-locked">
                    <span>🔒 Locked</span>
                    <span className="badge-xp">{badge.xp} XP</span>
                  </div>
                )}
                <span
                  className="rarity-badge"
                  style={{ color: rarityColors[badge.rarity] }}
                >
                  {badge.rarity}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Achievements;