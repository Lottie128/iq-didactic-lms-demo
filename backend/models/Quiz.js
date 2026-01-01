const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Quiz = sequelize.define('Quiz', {
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
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Time limit in minutes'
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 70,
    comment: 'Percentage required to pass'
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'quizzes',
  timestamps: true
});

module.exports = Quiz;