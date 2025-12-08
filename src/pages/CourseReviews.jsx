import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import './CourseReviews.css';

const CourseReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'Sarah Chen',
      userAvatar: 'S',
      rating: 5,
      date: '2024-12-05',
      comment: 'Absolutely amazing course! The instructor explains complex concepts in a very understandable way. The hands-on projects really helped solidify my understanding.',
      helpful: 24,
      notHelpful: 2
    },
    {
      id: 2,
      userName: 'Mike Johnson',
      userAvatar: 'M',
      rating: 4,
      date: '2024-12-03',
      comment: 'Great content and well-structured. Would have loved more advanced topics towards the end, but overall very satisfied with the course.',
      helpful: 18,
      notHelpful: 1
    },
    {
      id: 3,
      userName: 'Priya Sharma',
      userAvatar: 'P',
      rating: 5,
      date: '2024-12-01',
      comment: 'This course exceeded my expectations! Clear explanations, practical examples, and excellent support from the instructor.',
      helpful: 31,
      notHelpful: 0
    },
    {
      id: 4,
      userName: 'Alex Rivera',
      userAvatar: 'A',
      rating: 4,
      date: '2024-11-28',
      comment: 'Very comprehensive course. The quizzes were challenging and the AI teacher feature is incredibly helpful.',
      helpful: 15,
      notHelpful: 3
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }));

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      userName: 'You',
      userAvatar: 'Y',
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      helpful: 0,
      notHelpful: 0
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating, size = 16) => {
    return (
      <div className="stars" style={{ fontSize: size }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? '#fbbf24' : 'none'}
            color={star <= rating ? '#fbbf24' : '#666'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Student Reviews</h3>
        {!showReviewForm && (
          <button className="btn btn-primary" onClick={() => setShowReviewForm(true)}>
            Write a Review
          </button>
        )}
      </div>

      <div className="reviews-overview glass">
        <div className="rating-summary">
          <div className="avg-rating">
            <h2>{averageRating}</h2>
            {renderStars(Math.round(parseFloat(averageRating)), 20)}
            <p>{reviews.length} reviews</p>
          </div>
        </div>
        <div className="rating-breakdown">
          {ratingDistribution.map(item => (
            <div key={item.star} className="rating-bar-row">
              <span className="star-label">{item.star} {renderStars(1, 12)}</span>
              <div className="rating-bar">
                <div className="rating-fill" style={{ width: `${item.percentage}%` }} />
              </div>
              <span className="rating-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {showReviewForm && (
        <form className="review-form glass" onSubmit={handleSubmitReview}>
          <h4>Write Your Review</h4>
          <div className="form-field">
            <label>Your Rating</label>
            <div className="star-selector">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={28}
                  fill={star <= newReview.rating ? '#fbbf24' : 'none'}
                  color={star <= newReview.rating ? '#fbbf24' : '#666'}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
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
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowReviewForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card glass">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="user-avatar-small">{review.userAvatar}</div>
                <div>
                  <p className="reviewer-name">{review.userName}</p>
                  <p className="review-date">{review.date}</p>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-actions">
              <button className="helpful-btn">
                <ThumbsUp size={14} />
                Helpful ({review.helpful})
              </button>
              <button className="helpful-btn">
                <ThumbsDown size={14} />
                ({review.notHelpful})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseReviews;