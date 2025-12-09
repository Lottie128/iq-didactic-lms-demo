import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, Award, TrendingUp, Settings, LogOut, Bell, 
  Search, Menu, X, User, Calendar, MessageSquare, BarChart,
  Users, FileText, Target, Trophy, GraduationCap
} from 'lucide-react';
import ThemeToggler from './ThemeToggler';
import './Layout.css';

const Layout = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const studentNavItems = [
    { icon: Home, label: 'Dashboard', path: '/student' },
    { icon: BookOpen, label: 'My Courses', path: '/student' },
    { icon: TrendingUp, label: 'Progress', path: '/progress' },
    { icon: Trophy, label: 'Achievements', path: '/achievements' },
    { icon: GraduationCap, label: 'Certificates', path: '/certificates' },
    { icon: MessageSquare, label: 'Discussions', path: '/discussions' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
  ];

  const teacherNavItems = [
    { icon: Home, label: 'Dashboard', path: '/teacher' },
    { icon: BookOpen, label: 'My Courses', path: '/teacher' },
    { icon: FileText, label: 'Create Course', path: '/create-course' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: BarChart, label: 'Analytics', path: '/analytics' },
  ];

  const adminNavItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    { icon: BarChart, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const getNavItems = () => {
    if (user.role === 'student') return studentNavItems;
    if (user.role === 'teacher') return teacherNavItems;
    if (user.role === 'admin') return adminNavItems;
    return studentNavItems;
  };

  const navItems = getNavItems();

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar glass ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo" onClick={() => navigate('/')}>
            <div className="logo-icon glass">IQ</div>
            <span className="logo-text">IQ Didactic</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`nav-item ${window.location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => navigate('/profile')}>
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="nav-item" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <header className="top-nav glass">
          <div className="top-nav-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="top-nav-right">
            <ThemeToggler />
            
            <div className="notification-wrapper">
              <button 
                className="icon-btn"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell size={20} />
                <span className="notification-badge">3</span>
              </button>
              
              {notificationOpen && (
                <div className="notification-dropdown glass">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <button className="btn-text">Mark all read</button>
                  </div>
                  <div className="notification-list">
                    <div className="notification-item">
                      <div className="notification-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                        <BookOpen size={16} color="#3b82f6" />
                      </div>
                      <div>
                        <p className="notification-text">New course available: Advanced React</p>
                        <span className="notification-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-icon" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                        <Award size={16} color="#22c55e" />
                      </div>
                      <div>
                        <p className="notification-text">Achievement unlocked: 5 Day Streak!</p>
                        <span className="notification-time">1 day ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-icon" style={{ background: 'rgba(168, 85, 247, 0.2)' }}>
                        <Trophy size={16} color="#a855f7" />
                      </div>
                      <div>
                        <p className="notification-text">You earned 50 XP for completing a lesson</p>
                        <span className="notification-time">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="user-menu" onClick={() => navigate('/profile')}>
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;