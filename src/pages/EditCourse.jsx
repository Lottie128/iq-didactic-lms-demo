import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Video, Sparkles, LogOut, Trash2 } from 'lucide-react';
import { demoCourses } from '../data/demoCourses';
import './CreateCourse.css';

const EditCourse = ({ user, onLogout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = demoCourses.find(c => c.id === parseInt(id));

  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category || '',
    level: course?.level || 'Beginner',
    duration: course?.duration || '',
    instructor: course?.instructor || user?.name || ''
  });
  const [videos, setVideos] = useState(course?.videos || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Course updated:', { ...formData, videos });
    alert('Course updated successfully! (Demo only)');
    navigate(-1);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      console.log('Course deleted:', course.id);
      alert('Course deleted! (Demo only)');
      navigate('/teacher');
    }
  };

  const addVideo = () => {
    setVideos([...videos, { id: videos.length + 1, title: '', youtubeUrl: '', duration: '' }]);
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const updateVideo = (id, field, value) => {
    setVideos(videos.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  if (!course) {
    return <div className="dashboard-root"><p>Course not found</p></div>;
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
            <p>{course.title}</p>
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
                <input
                  className="input"
                  type="text"
                  placeholder="e.g., Programming"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Level *</label>
                <select
                  className="input"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
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
                <label>Instructor</label>
                <input
                  className="input"
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
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
                        placeholder="https://www.youtube.com/embed/..."
                        value={video.youtubeUrl}
                        onChange={(e) => updateVideo(video.id, 'youtubeUrl', e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Duration</label>
                      <input
                        className="input"
                        type="text"
                        placeholder="e.g., 12:30"
                        value={video.duration}
                        onChange={(e) => updateVideo(video.id, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="form-section glass-strong">
            <h3>Course Thumbnail</h3>
            <div className="upload-area">
              <Upload size={32} />
              <p>Drag and drop an image, or click to browse</p>
              <input type="file" accept="image/*" style={{ display: 'none' }} />
              <button type="button" className="btn btn-secondary">
                Change Thumbnail
              </button>
              <span className="upload-hint">Recommended: 1280x720px, JPG or PNG</span>
            </div>
          </section>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleDelete} style={{ marginRight: 'auto', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <Trash2 size={16} />
              Delete Course
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditCourse;