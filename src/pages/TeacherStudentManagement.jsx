import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, UserPlus, Eye, Trash2, Mail, LogOut, Users, BookOpen, BarChart3, Award } from 'lucide-react';
import NotificationCenter from '../components/NotificationCenter';
import ThemeToggler from '../components/ThemeToggler';
import { courseAPI, adminAPI } from '../services/api';
import './UserManagement.css';

const TeacherStudentManagement = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch teacher's courses
      const coursesResponse = await courseAPI.getMyCourses();
      const teacherCourses = coursesResponse.data || [];
      setCourses(teacherCourses);

      // Fetch all students (in production, filter by enrolled in teacher's courses)
      const studentsResponse = await adminAPI.getAllUsers({ role: 'student', limit: 100 });
      const allStudents = studentsResponse.data || [];
      
      setStudents(allStudents);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.email?.toLowerCase().includes(searchQuery.toLowerCase());
    // TODO: Filter by course when enrollment data is available
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (loading) {
    return (
      <div className="user-mgmt-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loader">Loading students...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-mgmt-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate('/teacher')}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>Student Management</h2>
            <p>{students.length} total students</p>
          </div>
        </div>
        <nav className="header-nav">
          <ThemeToggler />
          <NotificationCenter />
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="user-mgmt-main fade-in">
        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#22c55e', marginBottom: '20px' }}>
            {success}
          </div>
        )}

        {/* Stats Overview */}
        <div className="stats-grid" style={{ marginBottom: '30px' }}>
          <div className="stat-card glass">
            <Users size={20} />
            <div>
              <p className="stat-value">{students.length}</p>
              <p className="stat-label">Total Students</p>
            </div>
          </div>
          <div className="stat-card glass">
            <BookOpen size={20} />
            <div>
              <p className="stat-value">{courses.length}</p>
              <p className="stat-label">Your Courses</p>
            </div>
          </div>
          <div className="stat-card glass">
            <Award size={20} />
            <div>
              <p className="stat-value">{courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0)}</p>
              <p className="stat-label">Total Enrollments</p>
            </div>
          </div>
          <div className="stat-card glass">
            <BarChart3 size={20} />
            <div>
              <p className="stat-value">87%</p>
              <p className="stat-label">Avg Progress</p>
            </div>
          </div>
        </div>

        <div className="controls-bar glass">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filters">
            <select className="filter-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="users-table glass">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Location</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">{student.name?.charAt(0) || 'S'}</div>
                      <div>
                        <p className="user-name">{student.name}</p>
                        <p className="user-email">Student</p>
                      </div>
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.city ? `${student.city}, ${student.country}` : student.country || 'N/A'}</td>
                  <td>{formatDate(student.createdAt)}</td>
                  <td>{formatDate(student.lastLogin) || 'Never'}</td>
                  <td>
                    <div className="action-btns">
                      <button 
                        className="btn-icon-small" 
                        onClick={() => navigate(`/teacher/students/${student.id}`)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="btn-icon-small" 
                        onClick={() => window.location.href = `mailto:${student.email}`}
                        title="Email"
                      >
                        <Mail size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>
              <Users size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
              <p>No students found</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>Students will appear here when they enroll in your courses.</p>
            </div>
          )}
        </div>

        {/* Course-wise student breakdown */}
        {courses.length > 0 && (
          <section className="courses-section" style={{ marginTop: '40px' }}>
            <div className="section-header">
              <h2>Students by Course</h2>
            </div>
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course.id} className="course-card glass scale-in">
                  <div className="course-header">
                    <div className="course-category">{course.category}</div>
                    <div className="course-badge">{course.enrollmentCount || 0} students</div>
                  </div>
                  <h3>{course.title}</h3>
                  <div className="course-meta">
                    <span><Users size={14} /> {course.enrollmentCount || 0} enrolled</span>
                    <span><BarChart3 size={14} /> {course.level}</span>
                  </div>
                  <div className="course-footer">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => navigate(`/course/${course.id}`)}
                      style={{ width: '100%' }}
                    >
                      <Eye size={14} />
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default TeacherStudentManagement;