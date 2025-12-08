import React, { useState } from 'react';
import { Bell, X, Award, BookOpen, MessageCircle, Settings } from 'lucide-react';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      icon: Award,
      title: 'New Badge Earned!',
      message: 'You earned the "Quiz Master" badge',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      type: 'course',
      icon: BookOpen,
      title: 'New Course Available',
      message: 'Advanced Python Programming is now live',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'discussion',
      icon: MessageCircle,
      title: 'New Reply',
      message: 'Instructor replied to your question',
      time: '5 hours ago',
      read: false
    },
    {
      id: 4,
      type: 'system',
      icon: Settings,
      title: 'Quiz Reminder',
      message: 'ML Fundamentals quiz due in 2 days',
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      type: 'achievement',
      icon: Award,
      title: 'Course Completed!',
      message: 'You completed React Development',
      time: '2 days ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="notification-center">
      <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={18} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-panel glass-strong">
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

            <div className="notification-list">
              {notifications.map(notif => {
                const Icon = notif.icon;
                return (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className={`notif-icon ${notif.type}`}>
                      <Icon size={16} />
                    </div>
                    <div className="notif-content">
                      <p className="notif-title">{notif.title}</p>
                      <p className="notif-message">{notif.message}</p>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                    {!notif.read && <div className="unread-dot" />}
                  </div>
                );
              })}
            </div>

            <div className="notification-footer">
              <button className="view-all-btn">View All Notifications</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;