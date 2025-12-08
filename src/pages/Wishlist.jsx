import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, X, Play, LogOut, Clock, Star } from 'lucide-react';
import NotificationCenter from '../components/NotificationCenter';
import './Wishlist.css';

const Wishlist = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: 'Advanced Data Science',
      instructor: 'Dr. Emily Watson',
      duration: '36 hours',
      level: 'Advanced',
      rating: 4.8,
      students: 12450,
      price: 'Free',
      thumbnail: 'https://via.placeholder.com/400x225/667eea/ffffff?text=Data+Science'
    },
    {
      id: 2,
      title: 'Cloud Computing with AWS',
      instructor: 'Prof. David Chen',
      duration: '28 hours',
      level: 'Intermediate',
      rating: 4.6,
      students: 8920,
      price: 'Free',
      thumbnail: 'https://via.placeholder.com/400x225/f093fb/ffffff?text=AWS+Cloud'
    },
    {
      id: 3,
      title: 'Blockchain Development',
      instructor: 'Sarah Martinez',
      duration: '42 hours',
      level: 'Advanced',
      rating: 4.9,
      students: 5630,
      price: 'Free',
      thumbnail: 'https://via.placeholder.com/400x225/4facfe/ffffff?text=Blockchain'
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="wishlist-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>My Wishlist</h2>
            <p>{wishlistItems.length} courses saved</p>
          </div>
        </div>
        <nav className="header-nav">
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

      <main className="wishlist-main fade-in">
        {wishlistItems.length === 0 ? (
          <div className="empty-state glass-strong">
            <Bookmark size={64} />
            <h2>Your wishlist is empty</h2>
            <p>Start adding courses you're interested in!</p>
            <button className="btn btn-primary" onClick={() => navigate('/student')}>
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-card glass">
                <button className="remove-btn" onClick={() => removeFromWishlist(item.id)}>
                  <X size={16} />
                </button>
                <div className="course-thumbnail">
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="play-overlay-small">
                    <Play size={24} />
                  </div>
                </div>
                <div className="course-details">
                  <div className="course-header-small">
                    <span className="course-level">{item.level}</span>
                    <div className="course-rating">
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="instructor">{item.instructor}</p>
                  <div className="course-meta-small">
                    <span><Clock size={12} /> {item.duration}</span>
                    <span>{item.students.toLocaleString()} students</span>
                  </div>
                  <div className="card-footer">
                    <span className="price">{item.price}</span>
                    <button className="btn btn-primary" onClick={() => navigate(`/course/${item.id}`)}>
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;