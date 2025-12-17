const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    defaultValue: 'student'
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  occupation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  educationLevel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC'
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en'
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      fields: ['email'],
      name: 'users_email_idx'
    },
    {
      fields: ['role'],
      name: 'users_role_idx'
    },
    {
      fields: ['isActive'],
      name: 'users_is_active_idx'
    },
    {
      fields: ['role', 'isActive'],
      name: 'users_role_active_idx'
    },
    {
      fields: ['lastLogin'],
      name: 'users_last_login_idx'
    },
    {
      fields: ['xp'],
      name: 'users_xp_idx'
    },
    {
      fields: ['level'],
      name: 'users_level_idx'
    },
    {
      fields: ['createdAt'],
      name: 'users_created_at_idx'
    }
  ]
});

module.exports = User;