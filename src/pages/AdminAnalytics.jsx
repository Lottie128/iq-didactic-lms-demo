import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Globe, Sparkles, LogOut, Eye, Brain, Zap } from 'lucide-react';
import './AdminAnalytics.css';

const AdminAnalytics = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const globalStats = {
    totalUsers: 15240,
    activeToday: 3847,
    aiSessions: 8920,
    revenue: 124500
  };

  const countryData = [
    { country: 'United States', users: 4521, flag: '🇺🇸', growth: '+12%' },
    { country: 'India', users: 3240, flag: '🇮🇳', growth: '+28%' },
    { country: 'United Kingdom', users: 2180, flag: '🇬🇧', growth: '+8%' },
    { country: 'Canada', users: 1890, flag: '🇨🇦', growth: '+15%' },
    { country: 'Germany', users: 1650, flag: '🇩🇪', growth: '+10%' },
    { country: 'Australia', users: 1240, flag: '🇦🇺', growth: '+18%' },
    { country: 'Brazil', users: 520, flag: '🇧🇷', growth: '+45%' }
  ];

  const genderAnalytics = {
    male: { count: 8650, percentage: 57, benefit: 'Higher course completion rate' },
    female: { count: 6380, percentage: 42, benefit: 'Better AI interaction scores' },
    other: { count: 210, percentage: 1, benefit: 'Most diverse learning paths' }
  };

  const aiInsights = [
    { 
      title: 'Female users engage 23% more with AI Teacher',
      metric: '+23%',
      insight: 'Women spend average 18 mins per AI session vs 12 mins for men'
    },
    {
      title: 'Male users prefer video content over AI chat',
      metric: '68%',
      insight: 'Male learners complete 68% more video lessons than average'
    },
    {
      title: 'AI recommendations boost completion by gender',
      metric: '+34%',
      insight: 'Personalized AI paths increase female completion by 34%, male by 28%'
    }
  ];

  const coursePopularity = [
    { course: 'Machine Learning', male: 72, female: 28 },
    { course: 'UX/UI Design', male: 35, female: 65 },
    { course: 'Data Science', male: 68, female: 32 },
    { course: 'Digital Marketing', male: 42, female: 58 }
  ];

  return (
    <div className="analytics-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate('/admin')}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>Platform Analytics</h2>
            <p>Real-time insights and AI metrics</p>
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

      <main className="analytics-main fade-in">
        <section className="global-stats">
          <div className="stat-card glass">
            <Users size={24} />
            <div>
              <p className="stat-value">{globalStats.totalUsers.toLocaleString()}</p>
              <p className="stat-label">Total Users</p>
            </div>
            <span className="stat-trend positive">+15%</span>
          </div>
          <div className="stat-card glass">
            <TrendingUp size={24} />
            <div>
              <p className="stat-value">{globalStats.activeToday.toLocaleString()}</p>
              <p className="stat-label">Active Today</p>
            </div>
            <span className="stat-trend positive">+8%</span>
          </div>
          <div className="stat-card glass">
            <Sparkles size={24} />
            <div>
              <p className="stat-value">{globalStats.aiSessions.toLocaleString()}</p>
              <p className="stat-label">AI Sessions</p>
            </div>
            <span className="stat-trend positive">+42%</span>
          </div>
          <div className="stat-card glass">
            <Zap size={24} />
            <div>
              <p className="stat-value">${(globalStats.revenue / 1000).toFixed(1)}K</p>
              <p className="stat-label">Revenue MTD</p>
            </div>
            <span className="stat-trend positive">+23%</span>
          </div>
        </section>

        <div className="analytics-grid">
          <section className="analytics-card glass-strong">
            <div className="card-header">
              <Globe size={24} />
              <h3>Top Countries</h3>
            </div>
            <div className="country-list">
              {countryData.map((item, idx) => (
                <div key={idx} className="country-item">
                  <div className="country-info">
                    <span className="flag">{item.flag}</span>
                    <div>
                      <p className="country-name">{item.country}</p>
                      <p className="country-users">{item.users.toLocaleString()} users</p>
                    </div>
                  </div>
                  <span className="growth positive">{item.growth}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="analytics-card glass-strong">
            <div className="card-header">
              <Users size={24} />
              <h3>Gender Distribution</h3>
            </div>
            <div className="gender-chart">
              <div className="chart-bar">
                <div className="bar-segment male" style={{ width: `${genderAnalytics.male.percentage}%` }}>
                  {genderAnalytics.male.percentage}%
                </div>
                <div className="bar-segment female" style={{ width: `${genderAnalytics.female.percentage}%` }}>
                  {genderAnalytics.female.percentage}%
                </div>
                <div className="bar-segment other" style={{ width: `${genderAnalytics.other.percentage}%` }} />
              </div>
              <div className="gender-stats">
                <div className="gender-item">
                  <div className="gender-dot male" />
                  <div>
                    <p className="gender-label">Male</p>
                    <p className="gender-count">{genderAnalytics.male.count.toLocaleString()}</p>
                    <p className="gender-benefit">{genderAnalytics.male.benefit}</p>
                  </div>
                </div>
                <div className="gender-item">
                  <div className="gender-dot female" />
                  <div>
                    <p className="gender-label">Female</p>
                    <p className="gender-count">{genderAnalytics.female.count.toLocaleString()}</p>
                    <p className="gender-benefit">{genderAnalytics.female.benefit}</p>
                  </div>
                </div>
                <div className="gender-item">
                  <div className="gender-dot other" />
                  <div>
                    <p className="gender-label">Other</p>
                    <p className="gender-count">{genderAnalytics.other.count.toLocaleString()}</p>
                    <p className="gender-benefit">{genderAnalytics.other.benefit}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="analytics-card glass-strong full-width">
            <div className="card-header">
              <Brain size={24} />
              <h3>AI Impact by Gender</h3>
            </div>
            <div className="ai-insights-grid">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="insight-card glass">
                  <div className="insight-metric">{insight.metric}</div>
                  <h4>{insight.title}</h4>
                  <p>{insight.insight}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="analytics-card glass-strong full-width">
            <div className="card-header">
              <TrendingUp size={24} />
              <h3>Course Popularity by Gender</h3>
            </div>
            <div className="course-gender-list">
              {coursePopularity.map((course, idx) => (
                <div key={idx} className="course-gender-item">
                  <p className="course-title">{course.course}</p>
                  <div className="gender-bar">
                    <div className="bar-fill male" style={{ width: `${course.male}%` }}>
                      <span>{course.male}% M</span>
                    </div>
                    <div className="bar-fill female" style={{ width: `${course.female}%` }}>
                      <span>{course.female}% F</span>
                    </div>
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

export default AdminAnalytics;