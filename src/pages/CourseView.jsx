import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Circle, Sparkles, LogOut, FileText, Award, MessageCircle, Star } from 'lucide-react';
import { demoCourses } from '../data/demoCourses';
import CourseReviews from './CourseReviews';
import NotificationCenter from '../components/NotificationCenter';
import './CourseView.css';

const CourseView = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = demoCourses.find(c => c.id === parseInt(id));
  const [currentVideo, setCurrentVideo] = useState(course?.videos[0]);
  const [playing, setPlaying] = useState(false);

  if (!course) {
    return <div className="dashboard-root"><p>Course not found</p></div>;
  }

  const averageRating = 4.7;
  const totalReviews = 248;

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
          <div className="video-container glass-strong">
            <div className="video-wrapper">
              {playing ? (
                <iframe
                  src={`${currentVideo.youtubeUrl}?autoplay=1`}
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
              )}
            </div>
            <div className="video-info">
              <h3>{currentVideo.title}</h3>
              <p>{currentVideo.duration} • Lesson {currentVideo.id} of {course.videos.length}</p>
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
                <button className="btn btn-primary" onClick={() => navigate(`/quiz/${course.id}`)}>
                  <Award size={16} />
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
          <div className="lessons-list">
            {course.videos.map((video, idx) => (
              <div
                key={video.id}
                className={`lesson-item ${currentVideo.id === video.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentVideo(video);
                  setPlaying(false);
                }}
              >
                <div className="lesson-icon">
                  {video.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                </div>
                <div className="lesson-info">
                  <p className="lesson-title">{video.title}</p>
                  <p className="lesson-duration">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CourseView;