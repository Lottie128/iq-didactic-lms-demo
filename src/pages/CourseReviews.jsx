import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Loader } from 'lucide-react';
import { reviewAPI } from '../services/api';
import './CourseReviews.css';

const CourseReviews = ({ courseId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    if (courseId) {
      loadReviews();
    }
  }, [courseId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reviewAPI.getCourseReviews(courseId, { sort: 'recent' });
      const reviewsData = response.data || [];
      setReviews(reviewsData);
      
      // Check if current user has already reviewed
      const existingUserReview = reviewsData.find(r => r.userId === currentUser?.id);
      setUserReview(existingUserReview);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingReview) {
        // Update existing review
        await reviewAPI.updateReview(editingReview.id, newReview.rating, newReview.comment);
      } else {
        // Create new review
        await reviewAPI.createReview(courseId, newReview.rating, newReview.comment);
      }
      
      // Reload reviews
      await loadReviews();
      
      // Reset form
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      setEditingReview(null);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewAPI.deleteReview(reviewId);
      await loadReviews();
    } catch (err) {
      setError(err.message || 'Failed to delete review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({ rating: review.rating, comment: review.comment });
    setShowReviewForm(true);
  };

  const handleMarkHelpful = async (reviewId, helpful) => {
    try {
      await reviewAPI.markHelpful(reviewId, helpful);
      // Optimistically update UI
      setReviews(reviews.map(r => {
        if (r.id === reviewId) {
          return {
            ...r,
            helpfulCount: helpful ? (r.helpfulCount || 0) + 1 : r.helpfulCount,
            notHelpfulCount: !helpful ? (r.notHelpfulCount || 0) + 1 : r.notHelpfulCount
          };
        }
        return r;
      }));
    } catch (err) {
      console.error('Error marking review helpful:', err);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  const renderStars = (rating, size = 16, interactive = false, onChange = null) => {
    return (
      <div className="stars" style={{ fontSize: size, display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? '#fbbf24' : 'none'}
            color={star <= rating ? '#fbbf24' : '#666'}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="reviews-section">
        <div className="reviews-header">
          <h3>Student Reviews</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader className="spinner" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Student Reviews</h3>
        {!userReview && !showReviewForm && (
          <button className="btn btn-primary" onClick={() => setShowReviewForm(true)}>
            Write a Review
          </button>
        )}
        {userReview && (
          <button className="btn btn-secondary" onClick={() => handleEditReview(userReview)}>
            Edit Your Review
          </button>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {reviews.length > 0 && (
        <div className="reviews-overview glass">
          <div className="rating-summary">
            <div className="avg-rating">
              <h2>{averageRating}</h2>
              {renderStars(Math.round(parseFloat(averageRating)), 20)}
              <p>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
            </div>
          </div>
          <div className="rating-breakdown">
            {ratingDistribution.map(item => (
              <div key={item.star} className="rating-bar-row">
                <span className="star-label">{item.star} <Star size={12} fill="#fbbf24" color="#fbbf24" /></span>
                <div className="rating-bar">
                  <div className="rating-fill" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="rating-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showReviewForm && (
        <form className="review-form glass" onSubmit={handleSubmitReview}>
          <h4>{editingReview ? 'Edit Your Review' : 'Write Your Review'}</h4>
          <div className="form-field">
            <label>Your Rating</label>
            {renderStars(newReview.rating, 28, true, (rating) => setNewReview({ ...newReview, rating }))}
          </div>
          <div className="form-field">
            <label>Your Review</label>
            <textarea
              className="input textarea"
              rows={4}
              placeholder="Share your experience with this course..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
              disabled={submitting}
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setShowReviewForm(false);
                setEditingReview(null);
                setNewReview({ rating: 5, comment: '' });
                setError('');
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="empty-state glass" style={{ padding: '40px', textAlign: 'center' }}>
            <Star size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
            <h4>No reviews yet</h4>
            <p style={{ opacity: 0.7, marginBottom: '20px' }}>Be the first to review this course!</p>
            {!userReview && !showReviewForm && (
              <button className="btn btn-primary" onClick={() => setShowReviewForm(true)}>
                Write First Review
              </button>
            )}
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card glass">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="user-avatar-small">
                    {review.user?.name?.[0] || review.userName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="reviewer-name">{review.user?.name || review.userName || 'Anonymous'}</p>
                    <p className="review-date">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {renderStars(review.rating)}
                  {review.userId === currentUser?.id && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-icon-small" 
                        onClick={() => handleEditReview(review)}
                        title="Edit review"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon-small" 
                        onClick={() => handleDeleteReview(review.id)}
                        title="Delete review"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-actions">
                <button 
                  className="helpful-btn"
                  onClick={() => handleMarkHelpful(review.id, true)}
                >
                  <ThumbsUp size={14} />
                  Helpful ({review.helpfulCount || 0})
                </button>
                <button 
                  className="helpful-btn"
                  onClick={() => handleMarkHelpful(review.id, false)}
                >
                  <ThumbsDown size={14} />
                  ({review.notHelpfulCount || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseReviews;