import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Video, Sparkles, LogOut, Trash2, Save } from 'lucide-react';
import { courseAPI, lessonAPI } from '../services/api';
import './CreateCourse.css';

const EditCourse = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    level: 'beginner',
    duration: '',
    price: 0,
    thumbnail: ''
  });
  const [lessons, setLessons] = useState([]);
  const [originalLessonIds, setOriginalLessonIds] = useState([]);

  useEffect(() => {
    console.log('EditCourse: Loading course with ID:', id);
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('EditCourse: Fetching course from API...');
      const courseResponse = await courseAPI.getCourseById(id);
      const course = courseResponse.data;
      console.log('EditCourse: Course data:', course);
      
      if (!course) {
        throw new Error('No course data received from API');
      }
      
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || 'Programming',
        level: course.level || 'beginner',
        duration: course.duration || '',
        price: course.price || 0,
        thumbnail: course.thumbnail || ''
      });

      // Fetch lessons separately
      console.log('EditCourse: Fetching lessons for course', id);
      const lessonsResponse = await lessonAPI.getCourseLessons(id);
      const lessonsData = lessonsResponse.data || [];
      console.log('EditCourse: Lessons data:', lessonsData);
      
      // Store original lesson IDs to track deletions
      const lessonIds = lessonsData.map(l => l.id);
      setOriginalLessonIds(lessonIds);
      
      // Map lessons to editable format - IMPORTANT: Create new objects to avoid shared references
      const editableLessons = lessonsData.map(lesson => ({
        id: lesson.id,
        title: lesson.title || '',
        youtubeUrl: lesson.videoUrl || '',
        duration: lesson.duration || '',
        type: lesson.type || 'video',
        isNew: false // Track if this is an existing lesson
      }));
      
      console.log('EditCourse: Editable lessons:', editableLessons);
      setLessons(editableLessons);
      
      console.log('EditCourse: Course loaded successfully');
    } catch (error) {
      console.error('EditCourse: Error loading course:', error);
      setError(`Failed to load course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      console.log('EditCourse: Updating course...');
      
      // Update course basic info
      await courseAPI.updateCourse(id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        duration: formData.duration,
        price: formData.price,
        thumbnail: formData.thumbnail
      });
      console.log('EditCourse: Course updated');

      // Handle lessons
      const currentLessonIds = lessons.filter(l => !l.isNew).map(l => l.id);
      
      // Delete removed lessons
      const deletedLessonIds = originalLessonIds.filter(id => !currentLessonIds.includes(id));
      for (const lessonId of deletedLessonIds) {
        try {
          console.log('EditCourse: Deleting lesson', lessonId);
          await lessonAPI.deleteLesson(lessonId);
        } catch (err) {
          console.error('EditCourse: Error deleting lesson', lessonId, err);
        }
      }

      // Update existing lessons and create new ones
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const lessonData = {
          courseId: parseInt(id),
          title: lesson.title,
          type: lesson.type || 'video',
          videoUrl: lesson.youtubeUrl,
          duration: parseInt(lesson.duration) || 0,
          order: i + 1
        };

        try {
          if (lesson.isNew) {
            // Create new lesson
            console.log('EditCourse: Creating new lesson', lessonData);
            await lessonAPI.createLesson(lessonData);
          } else {
            // Update existing lesson
            console.log('EditCourse: Updating lesson', lesson.id, lessonData);
            await lessonAPI.updateLesson(lesson.id, lessonData);
          }
        } catch (err) {
          console.error('EditCourse: Error saving lesson', lesson, err);
        }
      }

      setSuccess('Course updated successfully!');
      setTimeout(() => {
        navigate(`/course/${id}`);
      }, 1500);
    } catch (error) {
      console.error('EditCourse: Error updating course:', error);
      setError(error.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await courseAPI.deleteCourse(id);
        alert('Course deleted successfully!');
        navigate('/teacher');
      } catch (error) {
        console.error('EditCourse: Error deleting course:', error);
        alert('Failed to delete course: ' + error.message);
      }
    }
  };

  const addLesson = () => {
    const newLesson = {
      id: `new_${Date.now()}`, // Temporary ID for new lessons
      title: '',
      youtubeUrl: '',
      duration: '',
      type: 'video',
      isNew: true
    };
    console.log('EditCourse: Adding new lesson', newLesson);
    setLessons([...lessons, newLesson]);
  };

  const removeLesson = (lessonId) => {
    console.log('EditCourse: Removing lesson', lessonId);
    setLessons(lessons.filter(l => l.id !== lessonId));
  };

  const updateLesson = (lessonId, field, value) => {
    console.log('EditCourse: Updating lesson', lessonId, field, value);
    // CRITICAL: Map creates NEW objects, preventing shared state bug
    setLessons(prevLessons => 
      prevLessons.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, [field]: value } 
          : lesson
      )
    );
  };

  if (loading) {
    return (
      <div className="create-course-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loader">Loading course...</div>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="create-course-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px', padding: '20px' }}>
          <p style={{ fontSize: '18px', opacity: 0.7 }}>Course not found</p>
          <p style={{ fontSize: '14px', opacity: 0.5, maxWidth: '500px', textAlign: 'center' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/teacher')}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-course-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>Edit Course</h2>
            <p>{formData.title}</p>
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
        {error && formData.title && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#22c55e', marginBottom: '20px' }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="course-form">
          <section className="form-section glass-strong">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-field full-width">
                <label>Course Title *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g., Advanced Python Programming"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-field full-width">
                <label>Description *</label>
                <textarea
                  className="input textarea"
                  placeholder="Describe what students will learn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="form-field">
                <label>Category *</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
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
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Price ($)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="0 for free"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="form-field full-width">
                <label>Thumbnail URL</label>
                <input
                  className="input"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section className="form-section glass-strong">
            <div className="section-header">
              <h3>Course Lessons ({lessons.length})</h3>
              <button type="button" className="btn btn-secondary" onClick={addLesson}>
                <Plus size={16} />
                Add Lesson
              </button>
            </div>

            {lessons.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', opacity: 0.6 }}>
                <Video size={48} style={{ margin: '0 auto 15px', opacity: 0.3 }} />
                <p>No lessons yet. Add video lessons to your course.</p>
              </div>
            ) : (
              <div className="videos-list">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="video-item glass">
                    <div className="video-header">
                      <div className="video-number">
                        <Video size={16} />
                        <span>Lesson {index + 1} {lesson.isNew && '(New)'}</span>
                      </div>
                      <button type="button" className="btn-icon-small" onClick={() => removeLesson(lesson.id)}>
                        <X size={16} />
                      </button>
                    </div>
                    <div className="video-fields">
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
                      <div className="form-field">
                        <label>YouTube URL *</label>
                        <input
                          className="input"
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={lesson.youtubeUrl}
                          onChange={(e) => updateLesson(lesson.id, 'youtubeUrl', e.target.value)}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleDelete} 
              style={{ marginRight: 'auto', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
            >
              <Trash2 size={16} />
              Delete Course
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/teacher')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditCourse;