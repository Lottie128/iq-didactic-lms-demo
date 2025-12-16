import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Video, Sparkles, LogOut, Trash2, Save } from 'lucide-react';
import { courseAPI } from '../services/api';
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
    category: '',
    level: 'beginner',
    duration: '',
    price: 0,
    thumbnail: ''
  });
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourseById(id);
      const course = response.data;
      
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        level: course.level || 'beginner',
        duration: course.duration || '',
        price: course.price || 0,
        thumbnail: course.thumbnail || ''
      });

      // Load videos from lessons or videos array
      if (course.lessons && course.lessons.length > 0) {
        setVideos(course.lessons.map(l => ({
          id: l.id,
          title: l.title,
          youtubeUrl: l.videoUrl || l.url || '',
          duration: l.duration || ''
        })));
      } else if (course.videos && course.videos.length > 0) {
        setVideos(course.videos);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      setError('Failed to load course');
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
      await courseAPI.updateCourse(id, {
        ...formData,
        videos: videos.map(v => ({
          title: v.title,
          url: v.youtubeUrl,
          duration: v.duration
        }))
      });

      setSuccess('Course updated successfully!');
      setTimeout(() => {
        navigate(`/course/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Error updating course:', error);
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
        console.error('Error deleting course:', error);
        alert('Failed to delete course: ' + error.message);
      }
    }
  };

  const addVideo = () => {
    setVideos([...videos, { id: Date.now(), title: '', youtubeUrl: '', duration: '' }]);
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const updateVideo = (id, field, value) => {
    setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
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
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
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
              <h3>Course Content</h3>
              <button type="button" className="btn btn-secondary" onClick={addVideo}>
                <Plus size={16} />
                Add Video
              </button>
            </div>

            <div className="videos-list">
              {videos.map((video, index) => (
                <div key={video.id} className="video-item glass">
                  <div className="video-header">
                    <div className="video-number">
                      <Video size={16} />
                      <span>Lesson {index + 1}</span>
                    </div>
                    {videos.length > 1 && (
                      <button type="button" className="btn-icon-small" onClick={() => removeVideo(video.id)}>
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <div className="video-fields">
                    <div className="form-field full-width">
                      <label>Video Title</label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Lesson title"
                        value={video.title}
                        onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>YouTube URL</label>
                      <input
                        className="input"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={video.youtubeUrl}
                        onChange={(e) => updateVideo(video.id, 'youtubeUrl', e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Duration (minutes)</label>
                      <input
                        className="input"
                        type="number"
                        placeholder="e.g., 15"
                        value={video.duration}
                        onChange={(e) => updateVideo(video.id, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
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