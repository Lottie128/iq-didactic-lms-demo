const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Comment = db.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  discussionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'discussions',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
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
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'comments',
      key: 'id'
    }
  }
}, {
  tableName: 'comments',
  timestamps: true
});

Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parentId' });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parentId' });

module.exports = Comment;
