import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseView from './pages/CourseView';
import AITeacher from './pages/AITeacher';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import UserProfile from './pages/UserProfile';
import TakeQuiz from './pages/TakeQuiz';
import CreateQuiz from './pages/CreateQuiz';
import AdminAnalytics from './pages/AdminAnalytics';
import UserManagement from './pages/UserManagement';
import TeacherStudentManagement from './pages/TeacherStudentManagement';
import StudentProgress from './pages/StudentProgress';
import Certificates from './pages/Certificates';
import Achievements from './pages/Achievements';
import DiscussionForum from './pages/DiscussionForum';
import Wishlist from './pages/Wishlist';
import Schedule from './pages/Schedule';
import ErrorBoundary from './components/ErrorBoundary';
import { authAPI } from './services/api';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing session and verify token
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Parse saved user data
          const parsedUser = JSON.parse(savedUser);
          
          // Verify token is still valid by calling the API
          try {
            const response = await authAPI.getMe();
            // Update user data with fresh data from server
            const freshUser = response.data;
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          } catch (error) {
            console.error('Token verification failed:', error);
            // Token is invalid or expired - clear auth
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Session initialization error:', error);
          // Clear corrupted data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      
      // Loading complete
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (userData) => {
    console.log('Login data:', userData);
    
    // User data and token are already saved in localStorage by authAPI.login()
    // Just update the state
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/signup" element={user ? <Navigate to={`/${user.role}`} replace /> : <Signup onSignup={handleLogin} />} />
          
          {/* Password Reset Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Dashboard Routes */}
          <Route path="/student" element={user?.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/teacher" element={user?.role === 'teacher' ? <TeacherDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          
          {/* Course Routes */}
          <Route path="/course/:id" element={user ? <CourseView user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/create-course" element={user ? <CreateCourse user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/edit-course/:id" element={user ? <EditCourse user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          
          {/* Quiz Routes */}
          <Route path="/quiz/:id" element={user ? <TakeQuiz user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/create-quiz" element={user ? <CreateQuiz user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          
          {/* Student Features */}
          <Route path="/progress" element={user ? <StudentProgress user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/certificates" element={user ? <Certificates user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/achievements" element={user ? <Achievements user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/wishlist" element={user ? <Wishlist user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/schedule" element={user ? <Schedule user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          
          {/* Discussion Routes */}
          <Route path="/course/:id/discussions" element={user ? <DiscussionForum user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin/analytics" element={user?.role === 'admin' ? <AdminAnalytics user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/admin/users" element={user?.role === 'admin' ? <UserManagement user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/students" element={user?.role === 'teacher' ? <TeacherStudentManagement user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          
          {/* General Routes */}
          <Route path="/ai-teacher" element={user ? <AITeacher user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={user ? <UserProfile user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
          
          {/* 404 Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;