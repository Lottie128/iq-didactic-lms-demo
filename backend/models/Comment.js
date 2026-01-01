const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discussionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'discussions',
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
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isBestAnswer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'comments',
  timestamps: true
});

module.exports = Comment;