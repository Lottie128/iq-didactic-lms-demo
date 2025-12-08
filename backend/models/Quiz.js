const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Quiz = db.define('Quiz', {
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
  questions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 70,
    validate: {
      min: 0,
      max: 100
    }
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time limit in minutes'
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    comment: 'Maximum attempts allowed'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'quizzes',
  timestamps: true
});

module.exports = Quiz;
