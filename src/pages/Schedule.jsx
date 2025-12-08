import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Video, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import NotificationCenter from '../components/NotificationCenter';
import './Schedule.css';

const Schedule = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const events = [
    {
      id: 1,
      title: 'Live Session: Neural Networks Deep Dive',
      type: 'live-class',
      date: '2024-12-10',
      time: '10:00 AM - 11:30 AM',
      instructor: 'Dr. Alex Teacher',
      course: 'Machine Learning'
    },
    {
      id: 2,
      title: 'Quiz Due: React Fundamentals',
      type: 'quiz',
      date: '2024-12-12',
      time: '11:59 PM',
      course: 'React Development'
    },
    {
      id: 3,
      title: 'Assignment Deadline: Python Project',
      type: 'assignment',
      date: '2024-12-15',
      time: '11:59 PM',
      course: 'Python Programming'
    },
    {
      id: 4,
      title: 'Live Q&A Session',
      type: 'live-class',
      date: '2024-12-17',
      time: '3:00 PM - 4:00 PM',
      instructor: 'Prof. Sarah Chen',
      course: 'Data Science'
    },
    {
      id: 5,
      title: 'Final Exam: Machine Learning',
      type: 'exam',
      date: '2024-12-20',
      time: '2:00 PM - 4:00 PM',
      course: 'Machine Learning'
    }
  ];

  const upcomingEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const eventTypeConfig = {
    'live-class': { color: '#3b82f6', icon: Video, label: 'Live Class' },
    'quiz': { color: '#fbbf24', icon: Clock, label: 'Quiz' },
    'assignment': { color: '#8b5cf6', icon: Calendar, label: 'Assignment' },
    'exam': { color: '#ef4444', icon: Calendar, label: 'Exam' }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="schedule-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>My Schedule</h2>
            <p>{upcomingEvents.length} upcoming events</p>
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

      <main className="schedule-main fade-in">
        <div className="schedule-grid">
          <section className="calendar-section glass-strong">
            <div className="calendar-header">
              <button className="btn-icon-small" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
                <ChevronLeft size={16} />
              </button>
              <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <button className="btn-icon-small" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="calendar-grid">
              <div className="calendar-day-header">Sun</div>
              <div className="calendar-day-header">Mon</div>
              <div className="calendar-day-header">Tue</div>
              <div className="calendar-day-header">Wed</div>
              <div className="calendar-day-header">Thu</div>
              <div className="calendar-day-header">Fri</div>
              <div className="calendar-day-header">Sat</div>
              {Array.from({ length: 35 }, (_, i) => {
                const dayNum = i - 2;
                const hasEvent = events.some(e => new Date(e.date).getDate() === dayNum);
                return (
                  <div key={i} className={`calendar-day ${dayNum > 0 && dayNum <= 31 ? 'active' : ''} ${hasEvent ? 'has-event' : ''}`}>
                    {dayNum > 0 && dayNum <= 31 ? dayNum : ''}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="events-section">
            <h3>Upcoming Events</h3>
            <div className="events-list">
              {upcomingEvents.map(event => {
                const config = eventTypeConfig[event.type];
                const Icon = config.icon;
                return (
                  <div key={event.id} className="event-card glass" style={{ borderLeftColor: config.color }}>
                    <div className="event-icon" style={{ background: `${config.color}20`, color: config.color }}>
                      <Icon size={20} />
                    </div>
                    <div className="event-details">
                      <div className="event-header">
                        <h4>{event.title}</h4>
                        <span className="event-type" style={{ color: config.color }}>{config.label}</span>
                      </div>
                      <p className="event-course">{event.course}</p>
                      {event.instructor && <p className="event-instructor">with {event.instructor}</p>}
                      <div className="event-time">
                        <Calendar size={14} />
                        <span>{formatDate(event.date)}</span>
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <button className="btn btn-secondary">Join</button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Schedule;