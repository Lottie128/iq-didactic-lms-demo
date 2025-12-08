import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Users, UserPlus, Edit, Trash2, LogOut, Download, Mail } from 'lucide-react';
import './UserManagement.css';

const UserManagement = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const users = [
    { id: 1, name: 'Alex Student', email: 'alex@iqdidactic.app', role: 'student', status: 'active', courses: 12, joined: '2024-01-15', country: 'USA' },
    { id: 2, name: 'Jordan Teacher', email: 'jordan@iqdidactic.app', role: 'teacher', status: 'active', courses: 8, joined: '2023-11-20', country: 'Canada' },
    { id: 3, name: 'Sarah Chen', email: 'sarah@iqdidactic.app', role: 'teacher', status: 'active', courses: 15, joined: '2023-09-10', country: 'UK' },
    { id: 4, name: 'Mike Johnson', email: 'mike@iqdidactic.app', role: 'student', status: 'active', courses: 6, joined: '2024-02-28', country: 'Australia' },
    { id: 5, name: 'Emily Davis', email: 'emily@iqdidactic.app', role: 'student', status: 'inactive', courses: 3, joined: '2024-03-12', country: 'USA' },
    { id: 6, name: 'Raj Patel', email: 'raj@iqdidactic.app', role: 'teacher', status: 'active', courses: 10, joined: '2023-12-05', country: 'India' },
    { id: 7, name: 'Lisa Wong', email: 'lisa@iqdidactic.app', role: 'student', status: 'active', courses: 18, joined: '2023-10-22', country: 'Singapore' },
    { id: 8, name: 'Admin IQ', email: 'admin@iqdidactic.app', role: 'admin', status: 'active', courses: 0, joined: '2023-08-01', country: 'USA' },
    { id: 9, name: 'Carlos Martinez', email: 'carlos@iqdidactic.app', role: 'student', status: 'active', courses: 9, joined: '2024-01-30', country: 'Mexico' },
    { id: 10, name: 'Anna Schmidt', email: 'anna@iqdidactic.app', role: 'teacher', status: 'active', courses: 12, joined: '2023-11-15', country: 'Germany' }
  ];

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    teachers: users.filter(u => u.role === 'teacher').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Delete user:', userId);
      alert('User deleted! (Demo only)');
    }
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
    alert('Edit user functionality (Demo only)');
  };

  const handleBulkEmail = () => {
    alert(`Send email to ${filteredUsers.length} users (Demo only)`);
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
            <p>Manage students, teachers, and administrators</p>
          </div>
        </div>
        <nav className="header-nav">
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
        <section className="mgmt-stats">
          <div className="stat-card glass">
            <Users size={24} />
            <div>
              <p className="stat-value">{stats.total}</p>
              <p className="stat-label">Total Users</p>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="role-icon student">S</div>
            <div>
              <p className="stat-value">{stats.students}</p>
              <p className="stat-label">Students</p>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="role-icon teacher">T</div>
            <div>
              <p className="stat-value">{stats.teachers}</p>
              <p className="stat-label">Teachers</p>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="role-icon admin">A</div>
            <div>
              <p className="stat-value">{stats.admins}</p>
              <p className="stat-label">Admins</p>
            </div>
          </div>
          <div className="stat-card glass">
            <div className="status-dot active" />
            <div>
              <p className="stat-value">{stats.active}</p>
              <p className="stat-label">Active</p>
            </div>
          </div>
        </section>

        <section className="mgmt-controls glass">
          <div className="search-filter">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={handleBulkEmail}>
              <Mail size={16} />
              Email All
            </button>
            <button className="btn btn-secondary">
              <Download size={16} />
              Export CSV
            </button>
            <button className="btn btn-primary">
              <UserPlus size={16} />
              Add User
            </button>
          </div>
        </section>

        <section className="users-table glass-strong">
          <div className="table-header">
            <div className="col col-user">User</div>
            <div className="col col-role">Role</div>
            <div className="col col-status">Status</div>
            <div className="col col-country">Country</div>
            <div className="col col-courses">Courses</div>
            <div className="col col-joined">Joined</div>
            <div className="col col-actions">Actions</div>
          </div>
          <div className="table-body">
            {filteredUsers.map((u) => (
              <div key={u.id} className="table-row">
                <div className="col col-user">
                  <div className="user-avatar-small">{u.name.charAt(0)}</div>
                  <div>
                    <p className="user-name">{u.name}</p>
                    <p className="user-email">{u.email}</p>
                  </div>
                </div>
                <div className="col col-role">
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </div>
                <div className="col col-status">
                  <span className={`status-badge ${u.status}`}>
                    <span className="status-dot" />
                    {u.status}
                  </span>
                </div>
                <div className="col col-country">{u.country}</div>
                <div className="col col-courses">{u.courses}</div>
                <div className="col col-joined">{u.joined}</div>
                <div className="col col-actions">
                  <button className="action-btn" onClick={() => handleEdit(u.id)}>
                    <Edit size={14} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(u.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="table-footer glass">
          <p>Showing {filteredUsers.length} of {users.length} users</p>
          <div className="pagination">
            <button className="btn btn-secondary" disabled>Previous</button>
            <span>Page 1 of 1</span>
            <button className="btn btn-secondary" disabled>Next</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;