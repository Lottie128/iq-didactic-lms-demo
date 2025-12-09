import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star, Lock, Loader } from 'lucide-react';
import Layout from '../components/Layout';
import { achievementAPI, userAPI } from '../services/api';

const Achievements = ({ user, onLogout }) => {
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [stats, setStats] = useState({ xp: 0, level: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);

      // Load all achievements
      const allResponse = await achievementAPI.getAllAchievements();
      setAllAchievements(allResponse.data);

      // Load user's unlocked achievements
      const userResponse = await achievementAPI.getUserAchievements();
      setUserAchievements(userResponse.data);

      // Load user stats
      const statsResponse = await userAPI.getUserStats();
      setStats(statsResponse.data);

      // Check for new achievements
      await achievementAPI.checkAchievements();

    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId) => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#94a3b8',
      rare: '#60a5fa',
      epic: '#a855f7',
      legendary: '#f59e0b'
    };
    return colors[rarity] || '#94a3b8';
  };

  const getRarityBackground = (rarity) => {
    const colors = {
      common: 'rgba(148, 163, 184, 0.1)',
      rare: 'rgba(96, 165, 250, 0.1)',
      epic: 'rgba(168, 85, 247, 0.1)',
      legendary: 'rgba(245, 158, 11, 0.1)'
    };
    return colors[rarity] || 'rgba(148, 163, 184, 0.1)';
  };

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader className="spin" size={32} />
        </div>
      </Layout>
    );
  }

  const unlockedCount = userAchievements.length;
  const totalCount = allAchievements.length;
  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <h1>Achievements 🏆</h1>
          <p>Track your learning milestones and unlock rewards</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)' }}>
            <Trophy size={24} color="#fbbf24" />
          </div>
          <div>
            <p className="stat-value">{unlockedCount}/{totalCount}</p>
            <p className="stat-label">Achievements Unlocked</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
            <Star size={24} color="#a855f7" />
          </div>
          <div>
            <p className="stat-value">{stats.xp}</p>
            <p className="stat-label">Total XP</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
            <Award size={24} color="#22c55e" />
          </div>
          <div>
            <p className="stat-value">Level {stats.level}</p>
            <p className="stat-label">Current Level</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            <Trophy size={24} color="#3b82f6" />
          </div>
          <div>
            <p className="stat-value">{completionPercentage}%</p>
            <p className="stat-label">Completion</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass" style={{ padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Overall Progress</span>
          <span style={{ fontSize: '14px', opacity: 0.7 }}>{unlockedCount} of {totalCount} unlocked</span>
        </div>
        <div className="progress-bar" style={{ height: '12px' }}>
          <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      {/* Achievements Grid */}
      {allAchievements.length === 0 ? (
        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '16px' }}>
          <Award size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <p style={{ opacity: 0.6 }}>No achievements available yet</p>
        </div>
      ) : (
        <div className="achievements-grid">
          {allAchievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.id);
            const userAch = userAchievements.find(ua => ua.achievementId === achievement.id);

            return (
              <div
                key={achievement.id}
                className={`achievement-card glass ${unlocked ? 'unlocked' : 'locked'}`}
                style={{
                  background: unlocked ? getRarityBackground(achievement.rarity) : undefined,
                  border: unlocked ? `1px solid ${getRarityColor(achievement.rarity)}` : undefined
                }}
              >
                <div className="achievement-icon" style={{
                  background: unlocked ? getRarityColor(achievement.rarity) : 'rgba(148, 163, 184, 0.2)'
                }}>
                  {unlocked ? (
                    <Trophy size={32} color="#fff" />
                  ) : (
                    <Lock size={32} color="#94a3b8" />
                  )}
                </div>

                <div className="achievement-content">
                  <h3>{achievement.name}</h3>
                  <p className="achievement-description">{achievement.description}</p>

                  {unlocked && userAch && (
                    <div className="achievement-date">
                      Unlocked {new Date(userAch.unlockedAt).toLocaleDateString()}
                    </div>
                  )}

                  <div className="achievement-footer">
                    <span
                      className="achievement-rarity"
                      style={{ color: getRarityColor(achievement.rarity) }}
                    >
                      {achievement.rarity}
                    </span>
                    {achievement.xpReward > 0 && (
                      <span className="achievement-xp">+{achievement.xpReward} XP</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default Achievements;