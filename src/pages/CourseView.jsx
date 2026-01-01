import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle, Circle, Sparkles, LogOut, FileText, Award, MessageCircle, Star, Video, Image as ImageIcon, Lock, Loader } from 'lucide-react';
import { courseAPI, lessonAPI, quizAPI } from '../services/api';
import CourseReviews from './CourseReviews';
import NotificationCenter from '../components/NotificationCenter';
import './CourseView.css';

const CourseView = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLesson, setCurrentLesson] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      console.log('CourseView: Fetching course', id);
      const courseResponse = await courseAPI.getCourseById(id);
      const courseData = courseResponse.data;
      console.log('CourseView: Course data:', courseData);
      setCourse(courseData);
      
      // Fetch lessons for this course
      console.log('CourseView: Fetching lessons for course', id);
      const lessonsResponse = await lessonAPI.getCourseLessons(id);
      const lessonsData = lessonsResponse.data || [];
      console.log('CourseView: Lessons data:', lessonsData);
      setLessons(lessonsData);
      
      // Set first lesson as current if available
      if (lessonsData.length > 0) {
        console.log('CourseView: Setting first lesson as current');
        setCurrentLesson(lessonsData[0]);
      }

      // Fetch quizzes
      loadQuizzes();
    } catch (error) {
      console.error('CourseView: Error loading course:', error);
      setError('Course not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  const loadQuizzes = async () => {
    try {
      setQuizzesLoading(true);
      const response = await quizAPI.getCourseQuizzes(id);
      const quizzesData = response.data || [];
      console.log('CourseView: Quizzes data:', quizzesData);
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('CourseView: Error loading quizzes:', error);
    } finally {
      setQuizzesLoading(false);
    }
  };

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // Already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Convert watch URL to embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Convert youtu.be URL to embed
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  const calculateCompletedLessons = () => {
    return lessons.filter(l => l.completed).length;
  };

  const isQuizUnlocked = (quiz, index) => {
    // First quiz is always unlocked
    if (index === 0) return true;
    
    // Check if previous quizzes are completed
    // For now, check if at least 50% of lessons are completed
    const completedLessons = calculateCompletedLessons();
    const requiredLessons = Math.ceil(lessons.length * 0.5);
    return completedLessons >= requiredLessons;
  };

  if (loading) {
    return (
      <div className="dashboard-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loader">
            <Loader className="spinner" size={32} />
            <p style={{ marginTop: '16px' }}>Loading course...</p>
          </div>
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

  // Calculate average rating from reviews (would come from API)
  const averageRating = course.averageRating || 4.7;
  const totalReviews = course.reviewCount || 0;

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
            {totalReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={12} fill={star <= Math.round(averageRating) ? '#fbbf24' : 'none'} color="#fbbf24" />
                  ))}
                </div>
                <span style={{ fontSize: '11px', opacity: 0.7 }}>{averageRating} ({totalReviews} reviews)</span>
              </div>
            )}
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
          {currentLesson && (
            <div className="video-container glass-strong">
              <div className="video-wrapper">
                {currentLesson.type === 'video' && currentLesson.videoUrl ? (
                  playing ? (
                    <iframe
                      src={`${getEmbedUrl(currentLesson.videoUrl)}?autoplay=1`}
                      title={currentLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                    />
                  ) : (
                    <div className="video-placeholder">
                      <button className="play-overlay" onClick={() => setPlaying(true)}>
                        <Play size={48} />
                      </button>
                      <p className="video-title">{currentLesson.title}</p>
                    </div>
                  )
                ) : currentLesson.type === 'text' ? (
                  <div style={{ padding: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '20px' }}>{currentLesson.title}</h3>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                      {currentLesson.description || currentLesson.content || 'No content available'}
                    </div>
                  </div>
                ) : currentLesson.type === 'image' ? (
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={currentLesson.videoUrl} 
                      alt={currentLesson.title}
                      style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '12px', marginBottom: '20px' }}
                    />
                    {currentLesson.description && (
                      <p style={{ padding: '20px', opacity: 0.8, lineHeight: '1.6' }}>
                        {currentLesson.description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="video-placeholder">
                    <p className="video-title">{currentLesson.title}</p>
                    <p style={{ fontSize: '14px', opacity: 0.6, marginTop: '10px' }}>No content available for this lesson</p>
                  </div>
                )}
              </div>
              <div className="video-info">
                <h3>{currentLesson.title}</h3>
                <p>
                  {currentLesson.duration ? `${currentLesson.duration} min` : ''}
                  {currentLesson.duration && ' • '}
                  Lesson {lessons.findIndex(l => l.id === currentLesson.id) + 1} of {lessons.length}
                  {' • '}
                  {currentLesson.type === 'video' ? '🎥 Video' : currentLesson.type === 'text' ? '📝 Text' : '🖼️ Image'}
                </p>
              </div>
            </div>
          )}

          {!currentLesson && lessons.length === 0 && (
            <div className="video-container glass-strong">
              <div className="video-placeholder">
                <Video size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
                <p>No lessons available yet</p>
                <p style={{ fontSize: '14px', opacity: 0.6, marginTop: '10px' }}>The instructor is still adding content to this course.</p>
              </div>
            </div>
          )}

          {/* Course Description */}
          <div className="course-description glass-strong">
            <h3>About this course</h3>
            <p>{course.description}</p>
            <div className="course-meta" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div><strong>Category:</strong> {course.category}</div>
              <div><strong>Level:</strong> {course.level}</div>
              {course.duration && <div><strong>Duration:</strong> {course.duration}</div>}
              <div><strong>Instructor:</strong> {course.instructor?.name || 'IQ Didactic'}</div>
              <div><strong>Lessons:</strong> {lessons.length}</div>
              <div><strong>Completed:</strong> {calculateCompletedLessons()} / {lessons.length}</div>
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
              {quizzesLoading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Loader className="spinner" size={24} />
                  <p style={{ marginTop: '12px', opacity: 0.7 }}>Loading quizzes...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>
                  <FileText size={32} style={{ opacity: 0.4, marginBottom: '12px' }} />
                  <p>No quizzes available yet</p>
                </div>
              ) : (
                quizzes.map((quiz, idx) => {
                  const isUnlocked = isQuizUnlocked(quiz, idx);
                  const isPassed = quiz.userScore && quiz.userScore >= quiz.passingScore;
                  
                  return (
                    <div key={quiz.id} className="quiz-item glass">
                      <div className="quiz-info">
                        <h4>{quiz.title}</h4>
                        <p>
                          {quiz.questions?.length || 0} questions • 
                          {quiz.timeLimit || 30} minutes • 
                          Passing: {quiz.passingScore || 70}%
                        </p>
                        {isPassed && (
                          <span className="quiz-badge passed">
                            <CheckCircle size={14} />
                            Passed ({quiz.userScore}%)
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="quiz-badge locked">
                            <Lock size={14} />
                            Complete more lessons to unlock
                          </span>
                        )}
                      </div>
                      <button 
                        className={`btn ${isUnlocked ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => isUnlocked && navigate(`/quiz/${quiz.id}`)}
                        disabled={!isUnlocked}
                      >
                        {isPassed ? (
                          <>
                            <Award size={16} />
                            Retake Quiz
                          </>
                        ) : isUnlocked ? (
                          <>
                            <Award size={16} />
                            Take Quiz
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            Locked
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
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
          <CourseReviews courseId={course.id} currentUser={user} />
        </section>

        <aside className="lessons-sidebar glass">
          <h3>Course Content ({lessons.length} lessons)</h3>
          {lessons.length > 0 ? (
            <div className="lessons-list">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className={`lesson-item ${currentLesson?.id === lesson.id ? 'active' : ''}`}
                  onClick={() => {
                    console.log('CourseView: Switching to lesson', lesson);
                    setCurrentLesson(lesson);
                    setPlaying(false);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="lesson-icon">
                    {lesson.completed ? (
                      <CheckCircle size={18} />
                    ) : lesson.type === 'video' ? (
                      <Video size={18} />
                    ) : lesson.type === 'text' ? (
                      <FileText size={18} />
                    ) : lesson.type === 'image' ? (
                      <ImageIcon size={18} />
                    ) : (
                      <Circle size={18} />
                    )}
                  </div>
                  <div className="lesson-info">
                    <p className="lesson-title">{lesson.title}</p>
                    <p className="lesson-duration">
                      {lesson.duration ? `${lesson.duration} min` : ''}
                      {lesson.type && ` • ${lesson.type}`}
                    </p>
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