import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Circle, Sparkles, LogOut, FileText, Award, MessageCircle, Star } from 'lucide-react';
import { courseAPI } from '../services/api';
import CourseReviews from './CourseReviews';
import NotificationCenter from '../components/NotificationCenter';
import './CourseView.css';

const CourseView = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourseById(id);
      const courseData = response.data;
      setCourse(courseData);
      
      // Set first video/lesson as current if available
      if (courseData.lessons && courseData.lessons.length > 0) {
        setCurrentVideo(courseData.lessons[0]);
      } else if (courseData.videos && courseData.videos.length > 0) {
        setCurrentVideo(courseData.videos[0]);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      setError('Course not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loader">Loading course...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="dashboard-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
          <p style={{ fontSize: '18px', opacity: 0.7 }}>Course not found</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const averageRating = 4.7;
  const totalReviews = 248;
  const lessons = course.lessons || course.videos || [];

  return (
    <div className="course-view-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>{course.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={12} fill={star <= Math.round(averageRating) ? '#fbbf24' : 'none'} color="#fbbf24" />
                ))}
              </div>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>{averageRating} ({totalReviews} reviews)</span>
            </div>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/ai-teacher')}>
            <Sparkles size={16} />
            <span>AI Help</span>
          </button>
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

      <main className="course-view-main fade-in">
        <section className="video-section">
          {currentVideo && (
            <div className="video-container glass-strong">
              <div className="video-wrapper">
                {currentVideo.videoUrl || currentVideo.youtubeUrl || currentVideo.url ? (
                  playing ? (
                    <iframe
                      src={`${currentVideo.videoUrl || currentVideo.youtubeUrl || currentVideo.url}?autoplay=1`}
                      title={currentVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="video-placeholder">
                      <button className="play-overlay" onClick={() => setPlaying(true)}>
                        <Play size={48} />
                      </button>
                      <p className="video-title">{currentVideo.title}</p>
                    </div>
                  )
                ) : (
                  <div className="video-placeholder">
                    <p className="video-title">{currentVideo.title}</p>
                    <p style={{ fontSize: '14px', opacity: 0.6, marginTop: '10px' }}>No video available for this lesson</p>
                  </div>
                )}
              </div>
              <div className="video-info">
                <h3>{currentVideo.title}</h3>
                <p>{currentVideo.duration ? `${currentVideo.duration} min` : ''} • Lesson {lessons.indexOf(currentVideo) + 1} of {lessons.length}</p>
              </div>
            </div>
          )}

          {/* Course Description */}
          <div className="course-description glass-strong">
            <h3>About this course</h3>
            <p>{course.description}</p>
            <div className="course-meta">
              <span><strong>Category:</strong> {course.category}</span>
              <span><strong>Level:</strong> {course.level}</span>
              {course.duration && <span><strong>Duration:</strong> {course.duration}</span>}
              <span><strong>Instructor:</strong> {course.instructor?.name || 'IQ Didactic'}</span>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="quiz-section glass-strong">
            <div className="quiz-header">
              <FileText size={24} />
              <div>
                <h3>Course Quizzes</h3>
                <p>Test your knowledge and earn certificates</p>
              </div>
            </div>
            <div className="quiz-list">
              <div className="quiz-item glass">
                <div className="quiz-info">
                  <h4>Quiz 1: Fundamentals</h4>
                  <p>5 questions • 30 minutes • Passing: 70%</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate(`/quiz/${course.id}`)}
>                  <Award size={16} />
                  Take Quiz
                </button>
              </div>
              <div className="quiz-item glass">
                <div className="quiz-info">
                  <h4>Final Assessment</h4>
                  <p>10 questions • 60 minutes • Passing: 80%</p>
                </div>
                <button className="btn btn-secondary">
                  <Award size={16} />
                  Locked
                </button>
              </div>
            </div>
          </div>

          {/* Discussion Button */}
          <div className="discussion-cta glass-strong">
            <MessageCircle size={24} />
            <div>
              <h3>Join the Discussion</h3>
              <p>Ask questions, share insights, and connect with other students</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate(`/course/${course.id}/discussions`)}>
              View Discussions
            </button>
          </div>

          {/* Reviews Section */}
          <CourseReviews courseId={course.id} />
        </section>

        <aside className="lessons-sidebar glass">
          <h3>Course Content</h3>
          {lessons.length > 0 ? (
            <div className="lessons-list">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className={`lesson-item ${currentVideo?.id === lesson.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentVideo(lesson);
                    setPlaying(false);
                  }}
                >
                  <div className="lesson-icon">
                    {lesson.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </div>
                  <div className="lesson-info">
                    <p className="lesson-title">{lesson.title}</p>
                    <p className="lesson-duration">{lesson.duration ? `${lesson.duration} min` : 'TBD'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
              <p>No lessons available yet</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default CourseView;