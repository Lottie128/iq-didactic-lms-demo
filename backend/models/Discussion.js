const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Discussion = sequelize.define('Discussion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.ENUM('question', 'discussion', 'announcement'),
    defaultValue: 'discussion'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isClosed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  hasBestAnswer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'discussions',
  timestamps: true
});

module.exports = Discussion;