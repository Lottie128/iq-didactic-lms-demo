import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Video, FileText, Image as ImageIcon, Sparkles, LogOut, Save, CheckCircle, PlayCircle, BookOpen, HelpCircle, GripVertical, AlertCircle, Check } from 'lucide-react';
import { courseAPI, lessonAPI, quizAPI } from '../services/api';
import './CreateCourse.css';

const CreateCourse = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    level: 'beginner',
    duration: '',
    price: 0,
    thumbnail: '',
    requirements: '',
    whatYouLearn: ''
  });

  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [draggedLesson, setDraggedLesson] = useState(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    const draft = { courseData, lessons, quizzes };
    localStorage.setItem('courseDraft', JSON.stringify(draft));
  }, [courseData, lessons, quizzes]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('courseDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.courseData.title) {
          const loadDraft = window.confirm('Found a saved draft. Would you like to continue where you left off?');
          if (loadDraft) {
            setCourseData(draft.courseData);
            setLessons(draft.lessons || []);
            setQuizzes(draft.quizzes || []);
          }
        }
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }, []);

  // Validate Video URL (supports all platforms)
  const isValidVideoUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Get video platform name for display
  const getVideoPlatformName = (url) => {
    if (!url) return 'Unknown';
    const urlLower = url.toLowerCase();
    if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'YouTube';
    if (urlLower.includes('vimeo.com')) return 'Vimeo';
    if (urlLower.includes('s3.amazonaws.com') || urlLower.includes('s3-')) return 'AWS S3';
    if (urlLower.includes('cloudflarestream.com') || urlLower.includes('videodelivery.net')) return 'Cloudflare';
    if (urlLower.includes('wistia.com')) return 'Wistia';
    if (urlLower.includes('dailymotion.com')) return 'Dailymotion';
    if (urlLower.match(/\.(mp4|webm|ogg|mov)$/)) return 'Direct Video';
    return 'Custom Platform';
  };

  // Validate lesson data
  const validateLesson = (lesson) => {
    const errors = [];
    
    if (!lesson.title.trim()) {
      errors.push('Title is required');
    }
    
    if (lesson.type === 'video') {
      if (!lesson.url.trim()) {
        errors.push('Video URL is required');
      } else if (!isValidVideoUrl(lesson.url)) {
        errors.push('Invalid video URL - must start with http:// or https://');
      }
    }
    
    if (lesson.type === 'text' && !lesson.content.trim()) {
      errors.push('Content is required');
    }
    
    if (lesson.type === 'image' && !lesson.url.trim()) {
      errors.push('Image URL is required');
    }
    
    return errors;
  };

  const addLesson = (type) => {
    const newLesson = {
      id: Date.now(),
      type,
      title: '',
      content: '',
      url: '',
      duration: '',
      order: lessons.length + 1,
      isValid: false
    };
    setLessons([...lessons, newLesson]);
    setActiveTab('lessons'); // Switch to lessons tab
  };

  const updateLesson = (id, field, value) => {
    setLessons(lessons.map(l => {
      if (l.id === id) {
        const updated = { ...l, [field]: value };
        const errors = validateLesson(updated);
        updated.isValid = errors.length === 0;
        return updated;
      }
      return l;
    }));
  };

  const removeLesson = (id) => {
    if (window.confirm('Are you sure you want to remove this lesson?')) {
      setLessons(lessons.filter(l => l.id !== id));
    }
  };

  const duplicateLesson = (lesson) => {
    const newLesson = {
      ...lesson,
      id: Date.now(),
      title: `${lesson.title} (Copy)`,
      order: lessons.length + 1
    };
    setLessons([...lessons, newLesson]);
  };

  // Drag and drop for lessons
  const handleDragStart = (e, lesson) => {
    setDraggedLesson(lesson);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetLesson) => {
    e.preventDefault();
    if (!draggedLesson || draggedLesson.id === targetLesson.id) return;

    const draggedIndex = lessons.findIndex(l => l.id === draggedLesson.id);
    const targetIndex = lessons.findIndex(l => l.id === targetLesson.id);

    const newLessons = [...lessons];
    newLessons.splice(draggedIndex, 1);
    newLessons.splice(targetIndex, 0, draggedLesson);

    // Update order numbers
    const reorderedLessons = newLessons.map((l, idx) => ({ ...l, order: idx + 1 }));
    setLessons(reorderedLessons);
    setDraggedLesson(null);
  };

  const addQuiz = () => {
    const newQuiz = {
      id: Date.now(),
      title: '',
      description: '',
      timeLimit: 30,
      passingScore: 70,
      questions: [
        {
          id: Date.now(),
          question: '',
          type: 'multiple-choice',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      ]
    };
    setQuizzes([...quizzes, newQuiz]);
    setActiveTab('quizzes'); // Switch to quizzes tab
  };

  const updateQuiz = (quizId, field, value) => {
    setQuizzes(quizzes.map(q => q.id === quizId ? { ...q, [field]: value } : q));
  };

  const addQuestion = (quizId) => {
    setQuizzes(quizzes.map(q => {
      if (q.id === quizId) {
        return {
          ...q,
          questions: [...q.questions, {
            id: Date.now(),
            question: '',
            type: 'multiple-choice',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: ''
          }]
        };
      }
      return q;
    }));
  };

  const updateQuestion = (quizId, questionId, field, value) => {
    setQuizzes(quizzes.map(q => {
      if (q.id === quizId) {
        return {
          ...q,
          questions: q.questions.map(ques => 
            ques.id === questionId ? { ...ques, [field]: value } : ques
          )
        };
      }
      return q;
    }));
  };

  const removeQuestion = (quizId, questionId) => {
    setQuizzes(quizzes.map(q => {
      if (q.id === quizId) {
        return {
          ...q,
          questions: q.questions.filter(ques => ques.id !== questionId)
        };
      }
      return q;
    }));
  };

  const removeQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to remove this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    }
  };

  // Calculate progress
  const getProgress = () => {
    let score = 0;
    const total = 100;

    // Course info (40 points)
    if (courseData.title) score += 10;
    if (courseData.description) score += 10;
    if (courseData.category) score += 5;
    if (courseData.level) score += 5;
    if (courseData.thumbnail) score += 10;

    // Lessons (40 points)
    if (lessons.length > 0) score += 20;
    const validLessons = lessons.filter(l => l.isValid).length;
    if (validLessons === lessons.length && lessons.length > 0) score += 20;

    // Quizzes (20 points)
    if (quizzes.length > 0) score += 10;
    const validQuizzes = quizzes.filter(q => q.title && q.questions.length > 0).length;
    if (validQuizzes === quizzes.length && quizzes.length > 0) score += 10;

    return Math.min(score, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    setValidationErrors({});

    // Validate before submission
    const errors = {};
    
    if (!courseData.title.trim()) errors.title = 'Course title is required';
    if (!courseData.description.trim()) errors.description = 'Description is required';
    if (lessons.length === 0) errors.lessons = 'Add at least one lesson';

    // Validate each lesson
    lessons.forEach((lesson, idx) => {
      const lessonErrors = validateLesson(lesson);
      if (lessonErrors.length > 0) {
        errors[`lesson_${idx}`] = `Lesson ${idx + 1}: ${lessonErrors.join(', ')}`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the errors before submitting');
      setSaving(false);
      return;
    }

    try {
      console.log('Creating course with data:', courseData);
      
      // Create course
      const courseResponse = await courseAPI.createCourse({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        duration: courseData.duration,
        price: courseData.price,
        thumbnail: courseData.thumbnail,
        requirements: courseData.requirements,
        whatYouLearn: courseData.whatYouLearn
      });

      console.log('Course created:', courseResponse);
      const courseId = courseResponse.data?.id;

      if (!courseId) {
        throw new Error('Course created but ID not returned');
      }

      // Create lessons with progress feedback
      let lessonsCreated = 0;
      const lessonErrors = [];
      
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        try {
          console.log(`Creating lesson ${i + 1}/${lessons.length}:`, lesson.title);
          
          const lessonData = {
            courseId: courseId,
            title: lesson.title,
            description: lesson.content || lesson.title,
            content: lesson.content || '',
            type: lesson.type,
            order: lesson.order,
            duration: parseInt(lesson.duration) || 0
          };

          if (lesson.type === 'video') {
            lessonData.videoUrl = lesson.url;
            // Backend will auto-detect video platform
          } else if (lesson.type === 'image') {
            lessonData.videoUrl = lesson.url;
          }

          const lessonResponse = await lessonAPI.createLesson(lessonData);
          console.log('Lesson created:', lessonResponse);
          lessonsCreated++;
        } catch (lessonError) {
          console.error('Error creating lesson:', lesson.title, lessonError.response?.data || lessonError);
          lessonErrors.push(`"${lesson.title}": ${lessonError.response?.data?.message || lessonError.message}`);
        }
      }

      // Create quizzes
      let quizzesCreated = 0;
      const quizErrors = [];
      
      for (const quiz of quizzes) {
        try {
          await quizAPI.createQuiz({
            courseId: courseId,
            title: quiz.title,
            description: quiz.description || 'Course quiz',
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            questions: quiz.questions.map(q => ({
              question: q.question,
              type: q.type,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || ''
            }))
          });
          quizzesCreated++;
        } catch (quizError) {
          console.error('Error creating quiz:', quiz.title, quizError.response?.data || quizError);
          quizErrors.push(`"${quiz.title}": ${quizError.response?.data?.message || quizError.message}`);
        }
      }

      // Show success message with details
      let successMsg = `🎉 Course "${courseData.title}" created successfully!`;
      if (lessonsCreated > 0) successMsg += ` ${lessonsCreated} lessons added.`;
      if (quizzesCreated > 0) successMsg += ` ${quizzesCreated} quizzes added.`;
      
      if (lessonErrors.length > 0 || quizErrors.length > 0) {
        successMsg += ' Some items failed:';
        setError([...lessonErrors, ...quizErrors].join(' | '));
      }
      
      setSuccess(successMsg);
      
      // Clear draft
      localStorage.removeItem('courseDraft');
      
      setTimeout(() => {
        navigate('/teacher');
      }, 2500);

    } catch (error) {
      console.error('Error creating course:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create course';
      setError(`Failed to create course: ${errorMsg}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const progress = getProgress();
  const validLessonsCount = lessons.filter(l => l.isValid).length;

  return (
    <div className="create-course-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>Course Creator Studio</h2>
            <p>Build an amazing learning experience</p>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/ai-teacher')}>
            <Sparkles size={16} />
            <span>AI Help</span>
          </button>
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="create-course-main fade-in">
        {/* Progress Bar */}
        <div className="progress-bar-container glass-strong" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Course Completion</span>
            <span style={{ fontSize: '14px', color: progress === 100 ? '#22c55e' : '#667eea' }}>{progress}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${progress}%`, 
              background: progress === 100 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #667eea, #764ba2)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#ef4444', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{error}</strong>
              {Object.keys(validationErrors).length > 0 && (
                <ul style={{ marginTop: '8px', marginLeft: '20px', fontSize: '14px' }}>
                  {Object.entries(validationErrors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', color: '#22c55e', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            <strong>{success}</strong>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="course-tabs glass-strong">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <BookOpen size={18} />
            <span>Course Info</span>
            {courseData.title && courseData.description && (
              <Check size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
            )}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <PlayCircle size={18} />
            <span>Lessons ({validLessonsCount}/{lessons.length})</span>
            {lessons.length > 0 && validLessonsCount === lessons.length && (
              <Check size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
            )}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <HelpCircle size={18} />
            <span>Quizzes ({quizzes.length})</span>
            {quizzes.length > 0 && (
              <Check size={14} style={{ color: '#22c55e', marginLeft: 'auto' }} />
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          {/* Course Info Tab */}
          {activeTab === 'info' && (
            <>
              <section className="form-section glass-strong">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label>Course Title *</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="e.g., Complete Web Development Bootcamp"
                      value={courseData.title}
                      onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>Description *</label>
                    <textarea
                      className="input textarea"
                      placeholder="Describe what students will learn and achieve..."
                      value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                      rows={5}
                      required
                    />
                    <small style={{ color: courseData.description.length > 100 ? '#22c55e' : '#999' }}>
                      {courseData.description.length} / 100+ characters recommended
                    </small>
                  </div>

                  <div className="form-field">
                    <label>Category *</label>
                    <select
                      className="input"
                      value={courseData.category}
                      onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                    >
                      <option>Programming</option>
                      <option>Design</option>
                      <option>Business</option>
                      <option>Marketing</option>
                      <option>Data Science</option>
                      <option>AI & ML</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Level *</label>
                    <select
                      className="input"
                      value={courseData.level}
                      onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Duration</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="e.g., 8 weeks"
                      value={courseData.duration}
                      onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Price ($)</label>
                    <input
                      className="input"
                      type="number"
                      placeholder="0 for free"
                      value={courseData.price}
                      onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>Thumbnail URL</label>
                    <input
                      className="input"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={courseData.thumbnail}
                      onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                    />
                    <small>Recommended: 1280x720px, JPG or PNG</small>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <section className="form-section glass-strong">
              <div className="section-header">
                <h3>Course Lessons</h3>
                <div className="lesson-type-btns">
                  <button type="button" className="btn btn-secondary" onClick={() => addLesson('video')}>
                    <Video size={16} />
                    Add Video
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => addLesson('text')}>
                    <FileText size={16} />
                    Add Text
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => addLesson('image')}>
                    <ImageIcon size={16} />
                    Add Image
                  </button>
                </div>
              </div>

              {lessons.length === 0 ? (
                <div className="empty-state">
                  <PlayCircle size={48} style={{ opacity: 0.3 }} />
                  <h4>No lessons yet</h4>
                  <p>Add video, text, or image lessons to your course</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" className="btn btn-primary" onClick={() => addLesson('video')}>
                      <Video size={16} />
                      Start with Video
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '15px', padding: '12px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px', fontSize: '14px' }}>
                    💡 <strong>Tip:</strong> Drag lessons by the grip icon to reorder them. Supports YouTube, Vimeo, AWS S3, Cloudflare, and more!
                  </div>
                  <div className="lessons-list">
                    {lessons.map((lesson, index) => (
                      <div 
                        key={lesson.id} 
                        className={`lesson-item glass ${!lesson.isValid ? 'lesson-invalid' : 'lesson-valid'}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lesson)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, lesson)}
                        style={{ cursor: 'grab' }}
                      >
                        <div className="lesson-header">
                          <div className="lesson-number" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <GripVertical size={16} style={{ opacity: 0.5, cursor: 'grab' }} />
                            {lesson.type === 'video' && <Video size={16} />}
                            {lesson.type === 'text' && <FileText size={16} />}
                            {lesson.type === 'image' && <ImageIcon size={16} />}
                            <span>Lesson {index + 1} ({lesson.type})</span>
                            {lesson.isValid && <Check size={14} style={{ color: '#22c55e' }} />}
                            {!lesson.isValid && <AlertCircle size={14} style={{ color: '#f59e0b' }} />}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              type="button" 
                              className="btn-icon-small" 
                              onClick={() => duplicateLesson(lesson)}
                              title="Duplicate lesson"
                            >
                              <Plus size={14} />
                            </button>
                            <button 
                              type="button" 
                              className="btn-icon-small" 
                              onClick={() => removeLesson(lesson.id)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="lesson-fields">
                          <div className="form-field full-width">
                            <label>Lesson Title *</label>
                            <input
                              className="input"
                              type="text"
                              placeholder="Enter lesson title"
                              value={lesson.title}
                              onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                              required
                            />
                          </div>

                          {lesson.type === 'video' && (
                            <>
                              <div className="form-field">
                                <label>Video URL * (Any Platform)</label>
                                <input
                                  className="input"
                                  type="url"
                                  placeholder="https://www.youtube.com/watch?v=... or any video URL"
                                  value={lesson.url}
                                  onChange={(e) => updateLesson(lesson.id, 'url', e.target.value)}
                                  required
                                />
                                {lesson.url && isValidVideoUrl(lesson.url) && (
                                  <small style={{ color: '#22c55e' }}>✓ Valid URL - Platform: {getVideoPlatformName(lesson.url)}</small>
                                )}
                                {lesson.url && !isValidVideoUrl(lesson.url) && (
                                  <small style={{ color: '#ef4444' }}>✗ Invalid URL format</small>
                                )}
                              </div>
                              <div className="form-field">
                                <label>Duration (minutes)</label>
                                <input
                                  className="input"
                                  type="number"
                                  placeholder="e.g., 15"
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)}
                                />
                              </div>
                              <div className="form-field full-width">
                                <label>Lesson Description/Notes (Optional)</label>
                                <textarea
                                  className="input textarea"
                                  placeholder="Add notes or key points about this video..."
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(lesson.id, 'content', e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </>
                          )}

                          {lesson.type === 'text' && (
                            <div className="form-field full-width">
                              <label>Content *</label>
                              <textarea
                                className="input textarea"
                                placeholder="Write your lesson content here..."
                                value={lesson.content}
                                onChange={(e) => updateLesson(lesson.id, 'content', e.target.value)}
                                rows={8}
                                required
                              />
                              <small>{lesson.content.length} characters</small>
                            </div>
                          )}

                          {lesson.type === 'image' && (
                            <>
                              <div className="form-field">
                                <label>Image URL *</label>
                                <input
                                  className="input"
                                  type="url"
                                  placeholder="https://example.com/image.jpg"
                                  value={lesson.url}
                                  onChange={(e) => updateLesson(lesson.id, 'url', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="form-field full-width">
                                <label>Description</label>
                                <textarea
                                  className="input textarea"
                                  placeholder="Describe the image and its significance..."
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(lesson.id, 'content', e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <section className="form-section glass-strong">
              <div className="section-header">
                <h3>Course Quizzes</h3>
                <button type="button" className="btn btn-secondary" onClick={addQuiz}>
                  <Plus size={16} />
                  Add Quiz
                </button>
              </div>

              {quizzes.length === 0 ? (
                <div className="empty-state">
                  <HelpCircle size={48} style={{ opacity: 0.3 }} />
                  <h4>No quizzes yet</h4>
                  <p>Create quizzes to test student knowledge</p>
                  <button type="button" className="btn btn-primary" onClick={addQuiz} style={{ marginTop: '20px' }}>
                    <Plus size={16} />
                    Create First Quiz
                  </button>
                </div>
              ) : (
                <div className="quizzes-list">
                  {quizzes.map((quiz, quizIndex) => (
                    <div key={quiz.id} className="quiz-item glass">
                      <div className="quiz-header">
                        <h4>Quiz {quizIndex + 1}</h4>
                        <button type="button" className="btn-icon-small" onClick={() => removeQuiz(quiz.id)}>
                          <X size={16} />
                        </button>
                      </div>

                      <div className="form-grid">
                        <div className="form-field full-width">
                          <label>Quiz Title *</label>
                          <input
                            className="input"
                            type="text"
                            placeholder="e.g., Module 1 Assessment"
                            value={quiz.title}
                            onChange={(e) => updateQuiz(quiz.id, 'title', e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-field">
                          <label>Time Limit (minutes)</label>
                          <input
                            className="input"
                            type="number"
                            value={quiz.timeLimit}
                            onChange={(e) => updateQuiz(quiz.id, 'timeLimit', parseInt(e.target.value))}
                          />
                        </div>

                        <div className="form-field">
                          <label>Passing Score (%)</label>
                          <input
                            className="input"
                            type="number"
                            value={quiz.passingScore}
                            onChange={(e) => updateQuiz(quiz.id, 'passingScore', parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="quiz-questions">
                        <div className="questions-header">
                          <h5>Questions ({quiz.questions.length})</h5>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => addQuestion(quiz.id)}>
                            <Plus size={14} />
                            Add Question
                          </button>
                        </div>

                        {quiz.questions.map((question, qIndex) => (
                          <div key={question.id} className="question-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <label style={{ fontWeight: 600 }}>Question {qIndex + 1}</label>
                              {quiz.questions.length > 1 && (
                                <button 
                                  type="button" 
                                  className="btn-icon-small" 
                                  onClick={() => removeQuestion(quiz.id, question.id)}
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                            <input
                              className="input"
                              type="text"
                              placeholder="Enter your question"
                              value={question.question}
                              onChange={(e) => updateQuestion(quiz.id, question.id, 'question', e.target.value)}
                              required
                              style={{ marginBottom: '12px' }}
                            />

                            <div style={{ marginBottom: '12px' }}>
                              <small style={{ display: 'block', marginBottom: '8px', opacity: 0.7 }}>Select the correct answer:</small>
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <input
                                    type="radio"
                                    name={`correct-${quiz.id}-${question.id}`}
                                    checked={question.correctAnswer === oIndex}
                                    onChange={() => updateQuestion(quiz.id, question.id, 'correctAnswer', oIndex)}
                                  />
                                  <input
                                    className="input"
                                    type="text"
                                    placeholder={`Option ${oIndex + 1}`}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...question.options];
                                      newOptions[oIndex] = e.target.value;
                                      updateQuestion(quiz.id, question.id, 'options', newOptions);
                                    }}
                                    required
                                    style={{ flex: 1 }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => {
              if (window.confirm('Are you sure you want to cancel? Your draft will be saved.')) {
                navigate(-1);
              }
            }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving || progress < 40}>
              <Save size={16} />
              {saving ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCourse;