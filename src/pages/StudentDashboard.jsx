import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Clock, Target, Search, Filter, Play, Star, Users } from 'lucide-react';
import Layout from '../components/Layout';
import { courseAPI, userAPI, progressAPI } from '../services/api';

const StudentDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [stats, setStats] = useState({ enrolledCourses: 0, completedCourses: 0, xp: 0, level: 1, streak: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user stats
      const statsResponse = await userAPI.getUserStats();
      setStats(statsResponse.data);

      // Load enrolled courses
      const enrolledResponse = await courseAPI.getEnrolledCourses();
      const enrolledData = enrolledResponse.data.map(enrollment => ({
        ...enrollment.Course,
        progress: enrollment.progress,
        lastAccessed: enrollment.lastAccessedAt
      }));
      setEnrolledCourses(enrolledData);

      // Load all available courses
      const coursesResponse = await courseAPI.getAllCourses({ page: 1, limit: 20 });
      setAllCourses(coursesResponse.data);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseAPI.enrollCourse(courseId);
      await loadDashboardData(); // Reload to update enrolled courses
    } catch (error) {
      alert(error.message || 'Failed to enroll in course');
    }
  };

  const categories = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Photography'];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const notEnrolled = !enrolledCourses.find(ec => ec.id === course.id);
    return matchesSearch && matchesCategory && notEnrolled;
  });

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ fontSize: '18px', opacity: 0.7 }}>Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="page-header">
        <div>
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>Continue your learning journey</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(96, 165, 250, 0.15)' }}>
            <BookOpen size={24} color="#60a5fa" />
          </div>
          <div>
            <p className="stat-value">{stats.enrolledCourses}</p>
            <p className="stat-label">Enrolled Courses</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
            <Award size={24} color="#22c55e" />
          </div>
          <div>
            <p className="stat-value">{stats.completedCourses}</p>
            <p className="stat-label">Completed</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
            <TrendingUp size={24} color="#a855f7" />
          </div>
          <div>
            <p className="stat-value">{stats.xp}</p>
            <p className="stat-label">XP Points</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(251, 146, 60, 0.15)' }}>
            <Target size={24} color="#fb923c" />
          </div>
          <div>
            <p className="stat-value">{stats.streak} Days</p>
            <p className="stat-label">Current Streak</p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>Continue Learning</h2>
            <button className="btn-text" onClick={() => navigate('/progress')}>View All</button>
          </div>

          <div className="courses-grid">
            {enrolledCourses.slice(0, 4).map((course) => (
              <div key={course.id} className="course-card glass scale-in" onClick={() => navigate(`/course/${course.id}`)}>
                <div className="course-thumbnail">
                  <img src={course.thumbnail || 'https://via.placeholder.com/400x200'} alt={course.title} />
                  <div className="course-badge">{course.category}</div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-instructor">
                    <Users size={14} />
                    {course.instructor?.name || 'Instructor'}
                  </p>
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${course.progress || 0}%` }}></div>
                    </div>
                    <span className="progress-text">{course.progress || 0}% Complete</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/course/${course.id}`); }}>
                    <Play size={16} />
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browse Courses */}
      <div className="section">
        <div className="section-header">
          <h2>Discover New Courses</h2>
        </div>

        <div className="search-filter-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="courses-grid">
          {filteredCourses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.6 }}>
              <BookOpen size={48} style={{ marginBottom: '16px' }} />
              <p>No courses found matching your criteria</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="course-card glass scale-in">
                <div className="course-thumbnail">
                  <img src={course.thumbnail || 'https://via.placeholder.com/400x200'} alt={course.title} />
                  <div className="course-badge">{course.category}</div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description.substring(0, 100)}...</p>
                  <div className="course-meta">
                    <span className="course-stat">
                      <Star size={14} fill="#fbbf24" color="#fbbf24" />
                      {course.averageRating || 0}
                    </span>
                    <span className="course-stat">
                      <Users size={14} />
                      {course.enrollmentCount || 0} enrolled
                    </span>
                    <span className="course-stat">
                      <Clock size={14} />
                      {course.duration || 'Self-paced'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(course.id)} style={{ flex: 1 }}>
                      Enroll Now
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/course/${course.id}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;