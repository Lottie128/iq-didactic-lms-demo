const User = require('./User');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Lesson = require('./Lesson');
const Progress = require('./Progress');

// Define associations

// User - Course (Instructor)
User.hasMany(Course, { foreignKey: 'instructorId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// User - Enrollment - Course
User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId', as: 'enrolledCourses' });
Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId', as: 'students' });

Enrollment.belongsTo(User, { foreignKey: 'userId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

// Course - Lesson
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

// User - Progress - Lesson
User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

Lesson.hasMany(Progress, { foreignKey: 'lessonId' });
Progress.belongsTo(Lesson, { foreignKey: 'lessonId' });

Course.hasMany(Progress, { foreignKey: 'courseId' });
Progress.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = {
  User,
  Course,
  Enrollment,
  Lesson,
  Progress
};
