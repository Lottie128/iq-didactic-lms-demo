import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Award, BookOpen, MessageCircle, Settings, Loader, Trash2 } from 'lucide-react';
import { notificationAPI } from '../services/api';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // Auto-refresh notifications every 30 seconds when panel is open
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        loadNotifications(true); // Silent refresh
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target) && 
          !event.target.closest('.notification-bell')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const loadNotifications = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError('');
      
      const response = await notificationAPI.getNotifications({ limit: 20, sort: 'recent' });
      const notificationsData = response.data || [];
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Error loading notifications:', err);
      if (!silent) setError('Failed to load notifications');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id, event) => {
    event.stopPropagation();
    
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      achievement: Award,
      course: BookOpen,
      discussion: MessageCircle,
      message: MessageCircle,
      quiz: BookOpen,
      system: Settings,
      default: Bell
    };
    return icons[type] || icons.default;
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
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-center">
      <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={18} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div ref={panelRef} className="notification-panel glass-strong">
          <div className="notification-header">
            <div>
              <h3>Notifications</h3>
              <p>{unreadCount} unread</p>
            </div>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button className="mark-read-btn" onClick={markAllAsRead}>
                  Mark all read
                </button>
              )}
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          {error && (
            <div className="notification-error">
              {error}
            </div>
          )}

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <Loader className="spinner" size={24} />
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={48} style={{ opacity: 0.3 }} />
                <p>No notifications yet</p>
                <span>We'll notify you when something new happens</span>
              </div>
            ) : (
              notifications.map(notif => {
                const Icon = getNotificationIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className={`notif-icon ${notif.type || 'default'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="notif-content">
                      <p className="notif-title">{notif.title}</p>
                      <p className="notif-message">{notif.message}</p>
                      <span className="notif-time">{formatTime(notif.createdAt)}</span>
                    </div>
                    <div className="notif-actions">
                      {!notif.read && <div className="unread-dot" />}
                      <button 
                        className="notif-delete-btn"
                        onClick={(e) => deleteNotification(notif.id, e)}
                        title="Delete notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button className="view-all-btn" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;