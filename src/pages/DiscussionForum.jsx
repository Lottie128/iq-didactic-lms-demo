import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ThumbsUp, Reply, Filter, Plus, LogOut, CheckCircle } from 'lucide-react';
import './DiscussionForum.css';

const DiscussionForum = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filterType, setFilterType] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      type: 'question',
      author: 'Sarah Chen',
      authorAvatar: 'S',
      title: 'How does gradient descent work in neural networks?',
      content: 'I understand the basic concept but struggling with backpropagation. Can someone explain?',
      timestamp: '2 hours ago',
      upvotes: 12,
      replies: 5,
      isBestAnswer: false,
      tags: ['neural-networks', 'gradient-descent']
    },
    {
      id: 2,
      type: 'discussion',
      author: 'Mike Johnson',
      authorAvatar: 'M',
      title: 'Best practices for hyperparameter tuning',
      content: 'What are your go-to strategies when tuning hyperparameters? I usually start with grid search...',
      timestamp: '5 hours ago',
      upvotes: 8,
      replies: 12,
      isBestAnswer: true,
      tags: ['hyperparameters', 'optimization']
    },
    {
      id: 3,
      type: 'announcement',
      author: 'Dr. Alex Teacher',
      authorAvatar: 'A',
      title: 'New Assignment Posted: Build Your First Neural Network',
      content: 'Students, the week 4 assignment is now available. Due date: Dec 15. Good luck!',
      timestamp: '1 day ago',
      upvotes: 24,
      replies: 3,
      isBestAnswer: false,
      tags: ['assignment']
    },
    {
      id: 4,
      type: 'question',
      author: 'Priya Sharma',
      authorAvatar: 'P',
      title: 'ValueError in my training loop - help needed',
      content: 'Getting "ValueError: shapes not aligned" when running model.fit(). Here\'s my code...',
      timestamp: '1 day ago',
      upvotes: 6,
      replies: 8,
      isBestAnswer: true,
      tags: ['debugging', 'tensorflow']
    }
  ]);

  const [newPost, setNewPost] = useState({
    type: 'question',
    title: '',
    content: '',
    tags: ''
  });

  const filteredDiscussions = filterType === 'all' 
    ? discussions 
    : discussions.filter(d => d.type === filterType);

  const handleCreatePost = (e) => {
    e.preventDefault();
    const post = {
      id: discussions.length + 1,
      ...newPost,
      author: user.name,
      authorAvatar: user.name.charAt(0),
      timestamp: 'Just now',
      upvotes: 0,
      replies: 0,
      isBestAnswer: false,
      tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    setDiscussions([post, ...discussions]);
    setNewPost({ type: 'question', title: '', content: '', tags: '' });
    setShowNewPost(false);
  };

  return (
    <div className="forum-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>Course Discussions</h2>
            <p>{discussions.length} posts</p>
          </div>
        </div>
        <nav className="header-nav">
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="forum-main fade-in">
        <div className="forum-controls glass">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Posts
            </button>
            <button 
              className={`filter-tab ${filterType === 'question' ? 'active' : ''}`}
              onClick={() => setFilterType('question')}
            >
              Questions
            </button>
            <button 
              className={`filter-tab ${filterType === 'discussion' ? 'active' : ''}`}
              onClick={() => setFilterType('discussion')}
            >
              Discussions
            </button>
            <button 
              className={`filter-tab ${filterType === 'announcement' ? 'active' : ''}`}
              onClick={() => setFilterType('announcement')}
            >
              Announcements
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowNewPost(!showNewPost)}>
            <Plus size={16} />
            New Post
          </button>
        </div>

        {showNewPost && (
          <form className="new-post-form glass-strong" onSubmit={handleCreatePost}>
            <h3>Create New Post</h3>
            <div className="form-field">
              <label>Post Type</label>
              <select 
                className="input"
                value={newPost.type}
                onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
              >
                <option value="question">Question</option>
                <option value="discussion">Discussion</option>
              </select>
            </div>
            <div className="form-field">
              <label>Title *</label>
              <input
                className="input"
                type="text"
                placeholder="What's your question or topic?"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Content *</label>
              <textarea
                className="input textarea"
                rows={5}
                placeholder="Provide details, code snippets, or context..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Tags (comma-separated)</label>
              <input
                className="input"
                type="text"
                placeholder="e.g., python, machine-learning, debugging"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowNewPost(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Post</button>
            </div>
          </form>
        )}

        <div className="discussions-list">
          {filteredDiscussions.map(discussion => (
            <div key={discussion.id} className="discussion-card glass">
              <div className="discussion-header">
                <div className="author-info">
                  <div className="user-avatar-small">{discussion.authorAvatar}</div>
                  <div>
                    <p className="author-name">{discussion.author}</p>
                    <p className="post-time">{discussion.timestamp}</p>
                  </div>
                </div>
                <span className={`post-type ${discussion.type}`}>{discussion.type}</span>
              </div>
              
              <h3 className="discussion-title">{discussion.title}</h3>
              <p className="discussion-content">{discussion.content}</p>
              
              {discussion.tags && discussion.tags.length > 0 && (
                <div className="post-tags">
                  {discussion.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              
              <div className="discussion-footer">
                <div className="discussion-stats">
                  <button className="stat-btn">
                    <ThumbsUp size={14} />
                    {discussion.upvotes}
                  </button>
                  <button className="stat-btn">
                    <Reply size={14} />
                    {discussion.replies} replies
                  </button>
                  {discussion.isBestAnswer && (
                    <span className="best-answer">
                      <CheckCircle size={14} />
                      Best Answer
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DiscussionForum;