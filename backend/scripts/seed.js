const bcrypt = require('bcryptjs');
const { sequelize, testConnection } = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await testConnection();

    // Sync database (force: true will drop existing tables)
    console.log('📊 Syncing database...');
    await sequelize.sync({ force: true });

    console.log('👥 Creating users...');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@iqdidactic.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+260 123 456 789',
      country: 'Zambia',
      city: 'Lusaka'
    });

    // Create Teacher Users
    const teacher1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'teacher@iqdidactic.com',
      password: hashedPassword,
      role: 'teacher',
      phone: '+260 123 456 790',
      country: 'Zambia',
      city: 'Lusaka',
      bio: 'Expert in Web Development with 10+ years experience'
    });

    const teacher2 = await User.create({
      name: 'Prof. David Smith',
      email: 'teacher2@iqdidactic.com',
      password: hashedPassword,
      role: 'teacher',
      phone: '+260 123 456 791',
      country: 'Zambia',
      city: 'Kitwe',
      bio: 'Data Science and AI specialist'
    });

    // Create Student Users
    const student1 = await User.create({
      name: 'Lottie Mukuka',
      email: 'student@iqdidactic.com',
      password: hashedPassword,
      role: 'student',
      phone: '+260 123 456 792',
      country: 'Zambia',
      city: 'Lusaka'
    });

    const student2 = await User.create({
      name: 'John Banda',
      email: 'student2@iqdidactic.com',
      password: hashedPassword,
      role: 'student',
      phone: '+260 123 456 793',
      country: 'Zambia',
      city: 'Ndola'
    });

    console.log('📚 Creating courses...');

    // Create Courses
    const course1 = await Course.create({
      title: 'Complete Web Development Bootcamp',
      description: 'Master web development from scratch with HTML, CSS, JavaScript, React, Node.js and more',
      category: 'Web Development',
      level: 'beginner',
      price: 0,
      published: true,
      duration: '40 hours',
      instructorId: teacher1.id,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      averageRating: 4.8,
      enrollmentCount: 0,
      requirements: 'Basic computer knowledge, Internet connection',
      whatYouLearn: 'HTML5 and CSS3, JavaScript ES6+, React.js, Node.js and Express, Database design'
    });

    const course2 = await Course.create({
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning with Python',
      category: 'Data Science',
      level: 'intermediate',
      price: 0,
      published: true,
      duration: '35 hours',
      instructorId: teacher2.id,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      averageRating: 4.9,
      enrollmentCount: 0,
      requirements: 'Basic Python knowledge',
      whatYouLearn: 'Pandas and NumPy, Data visualization, Machine Learning basics, Real-world projects'
    });

    const course3 = await Course.create({
      title: 'Mobile App Development',
      description: 'Build native mobile apps for iOS and Android',
      category: 'Mobile Development',
      level: 'advanced',
      price: 0,
      published: true,
      duration: '45 hours',
      instructorId: teacher1.id,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
      averageRating: 4.7,
      enrollmentCount: 0,
      requirements: 'JavaScript knowledge, Basic programming skills',
      whatYouLearn: 'React Native, API integration, State management, App deployment'
    });

    console.log('📖 Creating lessons...');

    // Create Lessons for Course 1
    await Lesson.create({
      title: 'Introduction to Web Development',
      description: 'Overview of web development and course structure',
      courseId: course1.id,
      duration: '15 min',
      order: 1,
      videoUrl: 'https://www.youtube.com/watch?v=example1',
      content: 'Welcome to the course!'
    });

    await Lesson.create({
      title: 'HTML Basics',
      description: 'Learn HTML5 fundamentals',
      courseId: course1.id,
      duration: '45 min',
      order: 2,
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      content: 'HTML structure and tags'
    });

    // Create Lessons for Course 2
    await Lesson.create({
      title: 'Python for Data Science',
      description: 'Introduction to Python libraries',
      courseId: course2.id,
      duration: '30 min',
      order: 1,
      videoUrl: 'https://www.youtube.com/watch?v=example3',
      content: 'NumPy and Pandas overview'
    });

    console.log('📝 Creating quizzes...');

    // Create Quizzes
    await Quiz.create({
      title: 'HTML Basics Quiz',
      courseId: course1.id,
      lessonId: null,
      questions: JSON.stringify([
        {
          question: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
          correctAnswer: 0
        },
        {
          question: 'Which tag is used for the largest heading?',
          options: ['<h6>', '<h1>', '<head>'],
          correctAnswer: 1
        }
      ]),
      passingScore: 70,
      timeLimit: 10
    });

    console.log('🎓 Creating enrollments...');

    // Enroll students in courses
    await Enrollment.create({
      userId: student1.id,
      courseId: course1.id,
      progress: 25,
      completed: false
    });

    await Enrollment.create({
      userId: student1.id,
      courseId: course2.id,
      progress: 50,
      completed: false
    });

    await Enrollment.create({
      userId: student2.id,
      courseId: course1.id,
      progress: 75,
      completed: false
    });

    // Update enrollment counts
    await course1.update({ enrollmentCount: 2 });
    await course2.update({ enrollmentCount: 1 });

    console.log('\n✅ Database seeded successfully!\n');
    console.log('📧 Default User Credentials:');
    console.log('----------------------------');
    console.log('Admin:   admin@iqdidactic.com / password123');
    console.log('Teacher: teacher@iqdidactic.com / password123');
    console.log('Student: student@iqdidactic.com / password123');
    console.log('----------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
