import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Video, FileText, Image as ImageIcon, Sparkles, LogOut, Save, CheckCircle, PlayCircle, BookOpen, HelpCircle } from 'lucide-react';
import { courseAPI, lessonAPI, quizAPI } from '../services/api';
import './CreateCourse.css';

const CreateCourse = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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

  const addLesson = (type) => {
    const newLesson = {
      id: Date.now(),
      type, // 'video', 'text', 'image'
      title: '',
      content: '',
      url: '',
      duration: '',
      order: lessons.length + 1
    };
    setLessons([...lessons, newLesson]);
  };

  const updateLesson = (id, field, value) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLesson = (id) => {
    setLessons(lessons.filter(l => l.id !== id));
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

  const removeQuiz = (quizId) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Create course
      const courseResponse = await courseAPI.createCourse({
        ...courseData,
        videos: lessons.filter(l => l.type === 'video').map(l => ({
          title: l.title,
          url: l.url,
          duration: l.duration
        }))
      });

      const courseId = courseResponse.data.id;

      // Create lessons
      for (const lesson of lessons) {
        await lessonAPI.createLesson({
          courseId,
          title: lesson.title,
          type: lesson.type,
          content: lesson.content || lesson.url,
          duration: lesson.duration,
          order: lesson.order
        });
      }

      // Create quizzes
      for (const quiz of quizzes) {
        await quizAPI.createQuiz({
          courseId,
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
          questions: quiz.questions.map(q => ({
            question: q.question,
            type: q.type,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          }))
        });
      }

      setSuccess('Course created successfully!');
      setTimeout(() => {
        navigate(`/course/${courseId}`);
      }, 2000);

    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

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
        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#22c55e', marginBottom: '20px' }}>
            <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
            {success}
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
          </button>
          <button 
            className={`tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <PlayCircle size={18} />
            <span>Lessons ({lessons.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <HelpCircle size={18} />
            <span>Quizzes ({quizzes.length})</span>
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
                      onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>What Students Will Learn</label>
                    <textarea
                      className="input textarea"
                      placeholder="List key learning outcomes (one per line)..."
                      value={courseData.whatYouLearn}
                      onChange={(e) => setCourseData({ ...courseData, whatYouLearn: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>Requirements</label>
                    <textarea
                      className="input textarea"
                      placeholder="Prerequisites and required knowledge..."
                      value={courseData.requirements}
                      onChange={(e) => setCourseData({ ...courseData, requirements: e.target.value })}
                      rows={3}
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
                </div>
              ) : (
                <div className="lessons-list">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="lesson-item glass">
                      <div className="lesson-header">
                        <div className="lesson-number">
                          {lesson.type === 'video' && <Video size={16} />}
                          {lesson.type === 'text' && <FileText size={16} />}
                          {lesson.type === 'image' && <ImageIcon size={16} />}
                          <span>Lesson {index + 1} ({lesson.type})</span>
                        </div>
                        <button type="button" className="btn-icon-small" onClick={() => removeLesson(lesson.id)}>
                          <X size={16} />
                        </button>
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
                              <label>YouTube URL *</label>
                              <input
                                className="input"
                                type="url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={lesson.url}
                                onChange={(e) => updateLesson(lesson.id, 'url', e.target.value)}
                                required
                              />
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
                            <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>Question {qIndex + 1}</label>
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
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