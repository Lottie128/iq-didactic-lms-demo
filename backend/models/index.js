const User = require('./User');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Lesson = require('./Lesson');
const Progress = require('./Progress');
const Review = require('./Review');
const Quiz = require('./Quiz');
const QuizSubmission = require('./QuizSubmission');
const Discussion = require('./Discussion');
const Comment = require('./Comment');

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

// User - Review - Course
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Course.hasMany(Review, { foreignKey: 'courseId', as: 'reviews' });
Review.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Course - Quiz
Course.hasMany(Quiz, { foreignKey: 'courseId', as: 'quizzes' });
Quiz.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - QuizSubmission - Quiz
User.hasMany(QuizSubmission, { foreignKey: 'userId', as: 'submissions' });
QuizSubmission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Quiz.hasMany(QuizSubmission, { foreignKey: 'quizId', as: 'submissions' });
QuizSubmission.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

// Course - Discussion
Course.hasMany(Discussion, { foreignKey: 'courseId', as: 'discussions' });
Discussion.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - Discussion
User.hasMany(Discussion, { foreignKey: 'userId', as: 'discussions' });
Discussion.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Discussion - Comment
Discussion.hasMany(Comment, { foreignKey: 'discussionId', as: 'comments' });
Comment.belongsTo(Discussion, { foreignKey: 'discussionId', as: 'discussion' });

// User - Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Comment - Comment (self-referencing for nested replies)
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

module.exports = {
  User,
  Course,
  Enrollment,
  Lesson,
  Progress,
  Review,
  Quiz,
  QuizSubmission,
  Discussion,
  Comment
};