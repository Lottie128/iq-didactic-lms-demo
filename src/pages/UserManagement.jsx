import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, UserPlus, Edit, Trash2, Mail, LogOut, X, Save, MoreVertical, Shield, CheckCircle, XCircle } from 'lucide-react';
import NotificationCenter from '../components/NotificationCenter';
import ThemeToggler from '../components/ThemeToggler';
import { adminAPI, authAPI } from '../services/api';
import './UserManagement.css';

const UserManagement = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    phone: '',
    country: 'Zambia',
    city: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers({ limit: 100 });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Create user via register API
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || '+260 000 000 000',
        country: formData.country,
        city: formData.city || 'Lusaka',
        birthday: '1990-01-01',
        occupation: formData.role === 'teacher' ? 'Teacher' : 'Student',
        educationLevel: 'Undergraduate'
      });

      setSuccess(`User ${formData.name} created successfully!`);
      setFormData({ name: '', email: '', role: 'student', password: '', phone: '', country: 'Zambia', city: '' });
      setShowAddUser(false);
      
      // Reload users
      await loadUsers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      // Note: We need to add delete user endpoint
      setError('Delete functionality will be added soon');
      // await adminAPI.deleteUser(userId);
      // await loadUsers();
      // setSuccess('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Failed to delete user');
    }
  };

  const startEdit = (editUser) => {
    setEditingUser(editUser);
    setFormData({
      name: editUser.name,
      email: editUser.email,
      role: editUser.role,
      password: '',
      phone: editUser.phone || '',
      country: editUser.country || 'Zambia',
      city: editUser.city || ''
    });
    setShowAddUser(false);
  };

  const toggleUserSelection = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const roleConfig = {
    student: { color: '#60a5fa', icon: '🎓' },
    teacher: { color: '#a78bfa', icon: '👨‍🏫' },
    admin: { color: '#f59e0b', icon: '⚡' }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (loading) {
    return (
      <div className="user-mgmt-root">
        <div className="dashboard-bg" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loader">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-mgmt-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate('/admin')}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>User Management</h2>
            <p>{users.length} total users</p>
          </div>
        </div>
        <nav className="header-nav">
          <ThemeToggler />
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

      <main className="user-mgmt-main fade-in">
        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#ef4444', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#22c55e', marginBottom: '20px' }}>
            {success}
          </div>
        )}

        <div className="controls-bar glass">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filters">
            <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowAddUser(true); setEditingUser(null); setError(''); }}>
            <UserPlus size={16} />
            Add User
          </button>
        </div>

        {(showAddUser || editingUser) && (
          <div className="user-form-overlay">
            <div className="user-form glass-strong">
              <div className="form-header">
                <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button className="btn-icon" onClick={() => { setShowAddUser(false); setEditingUser(null); setError(''); }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddUser}>
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email Address *</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input
                    className="input"
                    type="tel"
                    placeholder="+260 97 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>City</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Lusaka"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Role *</label>
                  <select
                    className="input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Password *</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    minLength={8}
                  />
                  <small>Minimum 8 characters</small>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowAddUser(false); setEditingUser(null); setError(''); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} />
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="users-table glass">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">{u.name?.charAt(0) || 'U'}</div>
                      <div>
                        <p className="user-name">{u.name}</p>
                        <p className="user-email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="role-badge" style={{ background: `${roleConfig[u.role]?.color || '#666'}20`, color: roleConfig[u.role]?.color || '#666' }}>
                      {roleConfig[u.role]?.icon || '👤'} {u.role}
                    </span>
                  </td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>{u.city ? `${u.city}, ${u.country}` : u.country || 'N/A'}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>{formatDate(u.lastLogin) || 'Never'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon-small" onClick={() => startEdit(u)} title="Edit">
                        <Edit size={14} />
                      </button>
                      <button className="btn-icon-small" onClick={() => window.location.href = `mailto:${u.email}`} title="Email">
                        <Mail size={14} />
                      </button>
                      <button className="btn-icon-small danger" onClick={() => handleDeleteUser(u.id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>
              <p>No users found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagement;