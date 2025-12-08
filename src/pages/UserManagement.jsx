import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, UserPlus, Edit, Trash2, Mail, LogOut, X, Save, MoreVertical, Shield, CheckCircle, XCircle } from 'lucide-react';
import NotificationCenter from '../components/NotificationCenter';
import ThemeToggler from '../components/ThemeToggler';
import './UserManagement.css';

const UserManagement = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      role: 'student',
      status: 'active',
      enrolled: 5,
      completed: 2,
      joinDate: '2024-01-15',
      lastActive: '2024-12-08'
    },
    {
      id: 2,
      name: 'Dr. Alex Teacher',
      email: 'alex.teacher@example.com',
      role: 'teacher',
      status: 'active',
      courses: 8,
      students: 2130,
      joinDate: '2023-06-10',
      lastActive: '2024-12-09'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      role: 'student',
      status: 'active',
      enrolled: 3,
      completed: 1,
      joinDate: '2024-03-22',
      lastActive: '2024-12-07'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      role: 'student',
      status: 'inactive',
      enrolled: 2,
      completed: 0,
      joinDate: '2024-05-18',
      lastActive: '2024-11-10'
    },
    {
      id: 5,
      name: 'Prof. Sarah Chen',
      email: 'prof.chen@example.com',
      role: 'teacher',
      status: 'active',
      courses: 6,
      students: 1850,
      joinDate: '2023-08-05',
      lastActive: '2024-12-08'
    },
    {
      id: 6,
      name: 'Admin User',
      email: 'admin@iqdidactic.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-01-01',
      lastActive: '2024-12-09'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    status: 'active'
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      ...formData,
      enrolled: 0,
      completed: 0,
      courses: 0,
      students: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setFormData({ name: '', email: '', role: 'student', password: '', status: 'active' });
    setShowAddUser(false);
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'student', password: '', status: 'active' });
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      status: user.status
    });
    setShowAddUser(false);
  };

  const toggleUserSelection = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const bulkDelete = () => {
    if (window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
      setUsers(users.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    }
  };

  const bulkActivate = () => {
    setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u));
    setSelectedUsers([]);
  };

  const bulkDeactivate = () => {
    setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u));
    setSelectedUsers([]);
  };

  const roleConfig = {
    student: { color: '#60a5fa', icon: '🎓' },
    teacher: { color: '#a78bfa', icon: '👨‍🏫' },
    admin: { color: '#f59e0b', icon: '⚡' }
  };

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
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowAddUser(true); setEditingUser(null); }}>
            <UserPlus size={16} />
            Add User
          </button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="bulk-actions glass">
            <span>{selectedUsers.length} selected</span>
            <div className="bulk-btns">
              <button className="btn btn-secondary" onClick={bulkActivate}>
                <CheckCircle size={14} />
                Activate
              </button>
              <button className="btn btn-secondary" onClick={bulkDeactivate}>
                <XCircle size={14} />
                Deactivate
              </button>
              <button className="btn btn-danger" onClick={bulkDelete}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        )}

        {(showAddUser || editingUser) && (
          <div className="user-form-overlay">
            <div className="user-form glass-strong">
              <div className="form-header">
                <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button className="btn-icon" onClick={() => { setShowAddUser(false); setEditingUser(null); }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={editingUser ? handleEditUser : handleAddUser}>
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
                  <label>Password {editingUser && '(leave blank to keep current)'}</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </div>
                <div className="form-field">
                  <label>Status *</label>
                  <select
                    className="input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowAddUser(false); setEditingUser(null); }}>
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
                <th width="40">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => setSelectedUsers(e.target.checked ? filteredUsers.map(u => u.id) : [])}
                  />
                </th>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Stats</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => toggleUserSelection(u.id)}
                    />
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">{u.name.charAt(0)}</div>
                      <div>
                        <p className="user-name">{u.name}</p>
                        <p className="user-email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="role-badge" style={{ background: `${roleConfig[u.role].color}20`, color: roleConfig[u.role].color }}>
                      {roleConfig[u.role].icon} {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${u.status}`}>
                      {u.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {u.role === 'student' && (
                      <span className="stats-text">{u.enrolled} enrolled • {u.completed} completed</span>
                    )}
                    {u.role === 'teacher' && (
                      <span className="stats-text">{u.courses} courses • {u.students} students</span>
                    )}
                    {u.role === 'admin' && <span className="stats-text">—</span>}
                  </td>
                  <td>{u.joinDate}</td>
                  <td>{u.lastActive}</td>
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
        </div>
      </main>
    </div>
  );
};

export default UserManagement;