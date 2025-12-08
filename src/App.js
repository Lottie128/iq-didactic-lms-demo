import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseView from './pages/CourseView';
import AITeacher from './pages/AITeacher';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <Login onLogin={handleLogin} />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to={`/${user.role}`} /> : <Signup onSignup={handleLogin} />} />
        <Route path="/student" element={user?.role === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/teacher" element={user?.role === 'teacher' ? <TeacherDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/course/:id" element={user ? <CourseView user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/ai-teacher" element={user ? <AITeacher user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;