import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Clock, Target, Search, Filter, Play, Star, Users } from 'lucide-react';
import Layout from '../components/Layout';
import { courseAPI, userAPI, progressAPI } from '../services/api';

// Default course image when thumbnail is missing
const DEFAULT_COURSE_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"%3E%3Crect fill="%23667eea" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="%23ffffff"%3ECourse%3C/text%3E%3C/svg%3E';

const StudentDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [stats, setStats] = useState({ enrolledCourses: 0, completedCourses: 0, xp: 0, level: 1, streak: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseAPI.enrollCourse(courseId);
      await loadDashboardData();
    } catch (error) {
      setError(error.message || 'Failed to enroll in course');
    }
  };

  const handleImageError = (e) => {
    e.target.src = DEFAULT_COURSE_IMAGE;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
  };

  const categories = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Photography'];

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const notEnrolled = !enrolledCourses.find(ec => ec.id === course.id);
      return matchesSearch && matchesCategory && notEnrolled;
    });
  }, [allCourses, searchQuery, selectedCategory, enrolledCourses]);

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="loading-container">
          <div className="skeleton-grid">
            <div className="skeleton skeleton-stat"></div>
            <div className="skeleton skeleton-stat"></div>
            <div className="skeleton skeleton-stat"></div>
            <div className="skeleton skeleton-stat"></div>
          </div>
          <div className="skeleton skeleton-section"></div>
          <div className="courses-grid">
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-card"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>Continue your learning journey</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon stat-icon-blue">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="stat-value">{stats.enrolledCourses}</p>
            <p className="stat-label">Enrolled Courses</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon stat-icon-green">
            <Award size={24} />
          </div>
          <div>
            <p className="stat-value">{stats.completedCourses}</p>
            <p className="stat-label">Completed</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon stat-icon-purple">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="stat-value">{stats.xp}</p>
            <p className="stat-label">XP Points</p>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon stat-icon-orange">
            <Target size={24} />
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
              <div 
                key={course.id} 
                className="course-card glass scale-in" 
                onClick={() => navigate(`/course/${course.id}`)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && navigate(`/course/${course.id}`)}
              >
                <div className="course-thumbnail">
                  <img 
                    src={course.thumbnail || DEFAULT_COURSE_IMAGE} 
                    alt={course.title}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="course-badge">{course.category}</div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-instructor">
                    <Users size={14} />
                    {course.instructor?.name || course.instructorName || 'IQ Didactic'}
                  </p>
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${course.progress || 0}%` }}
                        role="progressbar"
                        aria-valuenow={course.progress || 0}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="progress-text">{course.progress || 0}% Complete</span>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm btn-full" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate(`/course/${course.id}`); 
                    }}
                    aria-label={`Continue learning ${course.title}`}
                  >
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
              aria-label="Search courses"
            />
          </div>
          <div className="filter-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="courses-grid">
          {filteredCourses.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} />
              <p>No courses found matching your criteria</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="course-card glass scale-in">
                <div className="course-thumbnail">
                  <img 
                    src={course.thumbnail || DEFAULT_COURSE_IMAGE} 
                    alt={course.title}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="course-badge">{course.category}</div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-description">{truncateText(course.description, 100)}</p>
                  <div className="course-meta">
                    <span className="course-stat">
                      <Star size={14} fill="#fbbf24" color="#fbbf24" />
                      {course.averageRating?.toFixed(1) || '5.0'}
                    </span>
                    <span className="course-stat">
                      <Users size={14} />
                      {course.enrollmentCount || 0} enrolled
                    </span>
                    <span className="course-stat">
                      <Clock size={14} />
                      {course.duration || '8 weeks'}
                    </span>
                  </div>
                  <div className="course-actions">
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => handleEnroll(course.id)}
                      aria-label={`Enroll in ${course.title}`}
                    >
                      Enroll Now
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => navigate(`/course/${course.id}`)}
                      aria-label={`View details for ${course.title}`}
                    >
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