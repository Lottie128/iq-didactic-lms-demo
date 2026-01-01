import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ThumbsUp, Reply, Filter, Plus, LogOut, CheckCircle, Loader, Send, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import { discussionAPI } from '../services/api';
import './DiscussionForum.css';

const DiscussionForum = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showDiscussionDetail, setShowDiscussionDetail] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  
  const [newPost, setNewPost] = useState({
    type: 'question',
    title: '',
    content: ''
  });

  useEffect(() => {
    if (courseId) {
      loadDiscussions();
    }
  }, [courseId, filterType]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      setError('');
      const filters = filterType !== 'all' ? { type: filterType } : {};
      const response = await discussionAPI.getDiscussions(courseId, { ...filters, sort: 'recent' });
      const discussionsData = response.data || [];
      setDiscussions(discussionsData);
    } catch (err) {
      console.error('Error loading discussions:', err);
      setError('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussionDetail = async (discussionId) => {
    try {
      const response = await discussionAPI.getDiscussionById(discussionId);
      const discussionData = response.data;
      setSelectedDiscussion(discussionData);
      setShowDiscussionDetail(true);
    } catch (err) {
      console.error('Error loading discussion detail:', err);
      setError('Failed to load discussion details');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await discussionAPI.createDiscussion({
        courseId,
        type: newPost.type,
        title: newPost.title,
        content: newPost.content
      });
      
      await loadDiscussions();
      setNewPost({ type: 'question', title: '', content: '' });
      setShowNewPost(false);
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;

    setSubmitting(true);
    try {
      await discussionAPI.updateDiscussion(editingPost.id, {
        title: newPost.title,
        content: newPost.content
      });
      
      await loadDiscussions();
      setEditingPost(null);
      setNewPost({ type: 'question', title: '', content: '' });
      setShowNewPost(false);
    } catch (err) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (discussionId) => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;

    try {
      await discussionAPI.deleteDiscussion(discussionId);
      await loadDiscussions();
      if (selectedDiscussion?.id === discussionId) {
        setShowDiscussionDetail(false);
        setSelectedDiscussion(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    }
  };

  const handleEditPost = (discussion) => {
    setEditingPost(discussion);
    setNewPost({
      type: discussion.type || 'question',
      title: discussion.title,
      content: discussion.content
    });
    setShowNewPost(true);
  };

  const handleUpvote = async (discussionId, event) => {
    event.stopPropagation();
    try {
      await discussionAPI.upvoteDiscussion(discussionId);
      // Optimistically update UI
      setDiscussions(discussions.map(d => 
        d.id === discussionId ? { ...d, upvotes: (d.upvotes || 0) + 1 } : d
      ));
    } catch (err) {
      console.error('Error upvoting discussion:', err);
    }
  };

  const handleAddComment = async (discussionId, parentId = null) => {
    if (!replyContent.trim()) return;

    try {
      await discussionAPI.createComment(discussionId, replyContent, parentId);
      await loadDiscussionDetail(discussionId);
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    }
  };

  const handleUpvoteComment = async (commentId) => {
    try {
      await discussionAPI.upvoteComment(commentId);
      if (selectedDiscussion) {
        await loadDiscussionDetail(selectedDiscussion.id);
      }
    } catch (err) {
      console.error('Error upvoting comment:', err);
    }
  };

  const handleMarkBestAnswer = async (commentId) => {
    try {
      await discussionAPI.markBestAnswer(commentId);
      if (selectedDiscussion) {
        await loadDiscussionDetail(selectedDiscussion.id);
      }
    } catch (err) {
      console.error('Error marking best answer:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await discussionAPI.deleteComment(commentId);
      if (selectedDiscussion) {
        await loadDiscussionDetail(selectedDiscussion.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const renderComment = (comment, discussionOwnerId) => {
    const isOwner = comment.userId === user.id;
    const isDiscussionOwner = discussionOwnerId === user.id;
    const canMarkBestAnswer = isDiscussionOwner && selectedDiscussion?.type === 'question';

    return (
      <div key={comment.id} className={`comment ${comment.isBestAnswer ? 'best-answer' : ''}`}>
        <div className="comment-header">
          <div className="author-info">
            <div className="user-avatar-small">
              {comment.user?.name?.[0] || 'U'}
            </div>
            <div>
              <p className="author-name">{comment.user?.name || 'Anonymous'}</p>
              <p className="comment-time">{formatTime(comment.createdAt)}</p>
            </div>
            {comment.isBestAnswer && (
              <span className="best-answer-badge">
                <CheckCircle size={14} />
                Best Answer
              </span>
            )}
          </div>
          {isOwner && (
            <button 
              className="comment-delete-btn"
              onClick={() => handleDeleteComment(comment.id)}
              title="Delete comment"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <p className="comment-content">{comment.content}</p>
        <div className="comment-actions">
          <button 
            className="comment-action-btn"
            onClick={() => handleUpvoteComment(comment.id)}
          >
            <ThumbsUp size={14} />
            {comment.upvotes || 0}
          </button>
          <button 
            className="comment-action-btn"
            onClick={() => setReplyingTo(comment.id)}
          >
            <Reply size={14} />
            Reply
          </button>
          {canMarkBestAnswer && !comment.isBestAnswer && (
            <button 
              className="comment-action-btn mark-best"
              onClick={() => handleMarkBestAnswer(comment.id)}
            >
              <CheckCircle size={14} />
              Mark as Best Answer
            </button>
          )}
        </div>
        
        {replyingTo === comment.id && (
          <div className="reply-box">
            <textarea
              className="input textarea"
              rows={3}
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              autoFocus
            />
            <div className="reply-actions">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => handleAddComment(selectedDiscussion.id, comment.id)}
              >
                <Send size={14} />
                Reply
              </button>
            </div>
          </div>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="nested-comments">
            {comment.replies.map(reply => renderComment(reply, discussionOwnerId))}
          </div>
        )}
      </div>
    );
  };

  const filteredDiscussions = filterType === 'all' 
    ? discussions 
    : discussions.filter(d => d.type === filterType);

  if (loading) {
    return (
      <div className="forum-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Loader className="spinner" size={32} />
            <p style={{ marginTop: '16px' }}>Loading discussions...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {error && (
          <div className="error-message glass" style={{ marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {showNewPost && (
          <form className="new-post-form glass-strong" onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3>{editingPost ? 'Edit Post' : 'Create New Post'}</h3>
              <button 
                type="button"
                className="btn-icon"
                onClick={() => {
                  setShowNewPost(false);
                  setEditingPost(null);
                  setNewPost({ type: 'question', title: '', content: '' });
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="form-field">
              <label>Post Type</label>
              <select 
                className="input"
                value={newPost.type}
                onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                disabled={!!editingPost}
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
                disabled={submitting}
              />
            </div>
            <div className="form-field">
              <label>Content *</label>
              <textarea
                className="input textarea"
                rows={6}
                placeholder="Provide details, code snippets, or context..."
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowNewPost(false);
                  setEditingPost(null);
                  setNewPost({ type: 'question', title: '', content: '' });
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : editingPost ? 'Update Post' : 'Post'}
              </button>
            </div>
          </form>
        )}

        {filteredDiscussions.length === 0 ? (
          <div className="empty-state glass" style={{ padding: '60px', textAlign: 'center' }}>
            <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3>No discussions yet</h3>
            <p style={{ opacity: 0.7, marginBottom: '24px' }}>Be the first to start a discussion!</p>
            <button className="btn btn-primary" onClick={() => setShowNewPost(true)}>
              <Plus size={16} />
              Create First Post
            </button>
          </div>
        ) : (
          <div className="discussions-list">
            {filteredDiscussions.map(discussion => {
              const isOwner = discussion.userId === user.id;
              
              return (
                <div 
                  key={discussion.id} 
                  className="discussion-card glass"
                  onClick={() => loadDiscussionDetail(discussion.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="discussion-header">
                    <div className="author-info">
                      <div className="user-avatar-small">
                        {discussion.user?.name?.[0] || discussion.author?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="author-name">{discussion.user?.name || discussion.author || 'Anonymous'}</p>
                        <p className="post-time">{formatTime(discussion.createdAt)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`post-type ${discussion.type || 'discussion'}`}>
                        {discussion.type || 'discussion'}
                      </span>
                      {isOwner && (
                        <div className="post-actions">
                          <button 
                            className="btn-icon-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPost(discussion);
                            }}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="btn-icon-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(discussion.id);
                            }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="discussion-title">{discussion.title}</h3>
                  <p className="discussion-content">{discussion.content}</p>
                  
                  <div className="discussion-footer">
                    <div className="discussion-stats">
                      <button 
                        className="stat-btn"
                        onClick={(e) => handleUpvote(discussion.id, e)}
                      >
                        <ThumbsUp size={14} />
                        {discussion.upvotes || 0}
                      </button>
                      <button className="stat-btn">
                        <Reply size={14} />
                        {discussion.commentCount || 0} replies
                      </button>
                      {discussion.hasBestAnswer && (
                        <span className="best-answer-indicator">
                          <CheckCircle size={14} />
                          Solved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Discussion Detail Modal */}
      {showDiscussionDetail && selectedDiscussion && (
        <div className="modal-overlay" onClick={() => setShowDiscussionDetail(false)}>
          <div className="modal-content glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDiscussion.title}</h2>
              <button className="btn-icon" onClick={() => setShowDiscussionDetail(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="discussion-detail-header">
                <div className="author-info">
                  <div className="user-avatar-small">
                    {selectedDiscussion.user?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="author-name">{selectedDiscussion.user?.name || 'Anonymous'}</p>
                    <p className="post-time">{formatTime(selectedDiscussion.createdAt)}</p>
                  </div>
                </div>
                <span className={`post-type ${selectedDiscussion.type || 'discussion'}`}>
                  {selectedDiscussion.type || 'discussion'}
                </span>
              </div>
              
              <div className="discussion-content-full">
                {selectedDiscussion.content}
              </div>
              
              <div className="discussion-stats">
                <button 
                  className="stat-btn"
                  onClick={() => handleUpvote(selectedDiscussion.id, { stopPropagation: () => {} })}
                >
                  <ThumbsUp size={16} />
                  {selectedDiscussion.upvotes || 0} upvotes
                </button>
              </div>
              
              <div className="comments-section">
                <h3>{selectedDiscussion.comments?.length || 0} Comments</h3>
                
                <div className="add-comment-box">
                  <textarea
                    className="input textarea"
                    rows={3}
                    placeholder="Add your comment..."
                    value={replyingTo === null ? replyContent : ''}
                    onChange={(e) => {
                      if (replyingTo === null) setReplyContent(e.target.value);
                    }}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddComment(selectedDiscussion.id)}
                    disabled={!replyContent.trim()}
                  >
                    <Send size={16} />
                    Comment
                  </button>
                </div>
                
                <div className="comments-list">
                  {selectedDiscussion.comments && selectedDiscussion.comments.length > 0 ? (
                    selectedDiscussion.comments.map(comment => 
                      renderComment(comment, selectedDiscussion.userId)
                    )
                  ) : (
                    <p style={{ textAlign: 'center', opacity: 0.6, padding: '40px' }}>
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionForum;