import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award, Clock, Target, Download, Share2, LogOut, Trophy, Flame, Star, Loader } from 'lucide-react';
import { userAPI, courseAPI, certificateAPI, achievementAPI, progressAPI } from '../services/api';
import './StudentProgress.css';

const StudentProgress = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    xp: 0,
    level: 1,
    streak: 0,
    totalHours: 0
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);

      // Load user stats
      const statsResponse = await userAPI.getUserStats();
      setStats(statsResponse.data);

      // Load enrolled courses with progress
      const enrolledResponse = await courseAPI.getEnrolledCourses();
      const coursesData = enrolledResponse.data.map(enrollment => ({
        id: enrollment.Course.id,
        title: enrollment.Course.title,
        completion: enrollment.progress || 0,
        score: enrollment.averageScore || 0,
        timeSpent: enrollment.timeSpent || 0,
        status: enrollment.progress === 100 ? 'completed' : 'in-progress',
        thumbnail: enrollment.Course.thumbnail
      }));
      setEnrolledCourses(coursesData);

      // Load certificates
      const certsResponse = await certificateAPI.getUserCertificates();
      setCertificates(certsResponse.data || []);

      // Load achievements
      const userAchievements = await achievementAPI.getUserAchievements();
      setAchievements(userAchievements.data || []);

      const allAchievementsResponse = await achievementAPI.getAllAchievements();
      setAllAchievements(allAchievementsResponse.data || []);

    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certId) => {
    try {
      await certificateAPI.downloadCertificate(certId);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate');
    }
  };

  const formatTime = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    return `${Math.round(hours)}h`;
  };

  // Map achievements to badge format
  const badges = allAchievements.map(achievement => {
    const earned = achievements.some(ua => ua.achievementId === achievement.id);
    const userAch = achievements.find(ua => ua.achievementId === achievement.id);
    return {
      id: achievement.id,
      name: achievement.name,
      icon: achievement.icon || '🏆',
      earned,
      date: earned && userAch ? new Date(userAch.unlockedAt).toLocaleDateString() : null
    };
  });

  if (loading) {
    return (
      <div className="progress-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Loader className="spin" size={32} />
            <p style={{ marginTop: '16px' }}>Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  const completedCourses = enrolledCourses.filter(c => c.status === 'completed');
  const inProgressCourses = enrolledCourses.filter(c => c.status === 'in-progress');
  const averageScore = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.score, 0) / enrolledCourses.length)
    : 0;
  const totalHours = enrolledCourses.reduce((sum, c) => sum + (c.timeSpent || 0), 0);

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
              <p className="stat-value">{completedCourses.length}/{stats.enrolledCourses}</p>
              <p className="stat-label">Courses Completed</p>
            </div>
          </div>
          <div className="stat-card glass">
            <Clock size={24} />
            <div>
              <p className="stat-value">{Math.round(totalHours)}h</p>
              <p className="stat-label">Total Hours</p>
            </div>
          </div>
          <div className="stat-card glass">
            <Star size={24} />
            <div>
              <p className="stat-value">{averageScore}%</p>
              <p className="stat-label">Average Score</p>
            </div>
          </div>
          <div className="stat-card glass highlight">
            <Flame size={24} />
            <div>
              <p className="stat-value">{stats.streak || 0} Days</p>
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
                  <p className="game-value">{(stats.xp || 0).toLocaleString()}</p>
                  <p className="game-label">Total Points</p>
                </div>
              </div>
              <div className="game-stat">
                <div className="game-icon">📊</div>
                <div>
                  <p className="game-value">Level {stats.level || 1}</p>
                  <p className="game-label">Current Level</p>
                </div>
              </div>
            </div>
            {badges.length > 0 ? (
              <div className="badges-grid">
                {badges.map(badge => (
                  <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
                    <div className="badge-icon">{badge.icon}</div>
                    <p className="badge-name">{badge.name}</p>
                    {badge.earned && badge.date && <span className="badge-date">{badge.date}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', opacity: 0.6, padding: '20px' }}>No achievements unlocked yet</p>
            )}
          </section>

          <section className="progress-card glass-strong">
            <div className="card-header">
              <Award size={24} />
              <h3>Certificates Earned</h3>
            </div>
            {certificates.length > 0 ? (
              <div className="certificates-list">
                {certificates.map(cert => (
                  <div key={cert.id} className="certificate-item glass">
                    <div className="cert-info">
                      <Award size={20} />
                      <div>
                        <p className="cert-title">{cert.Course?.title || 'Course Certificate'}</p>
                        <p className="cert-id">#{cert.certificateNumber}</p>
                      </div>
                    </div>
                    <div className="cert-actions">
                      <button 
                        className="btn-icon-small" 
                        onClick={() => downloadCertificate(cert.id)}
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      <button className="btn-icon-small" title="Share">
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', opacity: 0.6, padding: '40px' }}>
                No certificates yet. Complete courses to earn certificates!
              </p>
            )}
          </section>

          <section className="progress-card glass-strong full-width">
            <div className="card-header">
              <TrendingUp size={24} />
              <h3>Course Progress</h3>
            </div>
            {enrolledCourses.length > 0 ? (
              <div className="course-progress-list">
                {enrolledCourses.map(course => (
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
                        {course.score > 0 && <span>Score: {course.score}%</span>}
                        {course.timeSpent > 0 && <span>{formatTime(course.timeSpent)} spent</span>}
                      </div>
                    </div>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      {course.status === 'completed' ? 'Review' : 'Continue'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', opacity: 0.6, padding: '60px' }}>
                No enrolled courses yet. Start learning today!
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentProgress;