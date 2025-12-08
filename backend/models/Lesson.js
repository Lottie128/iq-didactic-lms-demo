const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Lesson = db.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resources: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  tableName: 'lessons',
  timestamps: true
});

module.exports = Lesson;
