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
    const hashedPassword = await bcrypt.hash('Demo2025!', 12);

    // Create Admin User
    const admin = await User.create({
      name: 'Dr. Sarah Mitchell',
      email: 'admin@iqdidactic.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+260 123 456 789',
      country: 'Zambia',
      city: 'Lusaka',
      bio: 'Platform Administrator & Educational Technology Specialist'
    });

    // Create Teacher User
    const teacher = await User.create({
      name: 'Prof. Michael Chen',
      email: 'teacher@iqdidactic.com',
      password: hashedPassword,
      role: 'teacher',
      phone: '+260 123 456 790',
      country: 'Zambia',
      city: 'Lusaka',
      bio: 'Senior Software Engineer & ML Educator with 15+ years of experience'
    });

    // Create Student User
    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@iqdidactic.com',
      password: hashedPassword,
      role: 'student',
      phone: '+260 123 456 792',
      country: 'Zambia',
      city: 'Lusaka',
      bio: 'Aspiring full-stack developer and AI enthusiast'
    });

    console.log('📚 Creating courses...');

    // COURSE 1: Machine Learning Recipes by Google
    const mlCourse = await Course.create({
      title: 'Machine Learning Recipes',
      description: 'Learn machine learning fundamentals with Google\'s practical recipe-style tutorials. This free course from YouTube covers essential ML concepts through hands-on examples, perfect for beginners looking to understand AI and machine learning basics. Build your first ML models with TensorFlow and understand how machines learn from data.',
      category: 'Artificial Intelligence',
      level: 'beginner',
      price: 0,
      published: true,
      duration: '5 lessons',
      instructorId: teacher.id,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
      averageRating: 4.9,
      enrollmentCount: 0,
      requirements: 'Basic Python knowledge, Curiosity about AI',
      whatYouLearn: 'Machine Learning Basics, Decision Trees, Feature Engineering, ML Pipelines, Building Classifiers from Scratch'
    });

    // COURSE 2: Full Stack Web Development
    const webDevCourse = await Course.create({
      title: 'Full Stack Web Development',
      description: 'Master modern web development from frontend to backend. Learn HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Build real-world applications and understand the complete development lifecycle. This comprehensive course covers everything you need to become a professional full-stack developer.',
      category: 'Web Development',
      level: 'beginner',
      price: 49.99,
      published: true,
      duration: '8 lessons',
      instructorId: teacher.id,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
      averageRating: 4.8,
      enrollmentCount: 0,
      requirements: 'Computer with internet, Basic computer skills, No prior coding experience needed',
      whatYouLearn: 'HTML5 & CSS3, JavaScript ES6+, React.js, Node.js & Express, PostgreSQL, RESTful APIs, Authentication, Cloud Deployment'
    });

    console.log('📖 Creating lessons...');

    // ML Course Lessons (duration in seconds)
    await Lesson.create({
      title: 'Hello World - Machine Learning Recipes #1',
      description: 'Introduction to machine learning with a simple classifier',
      courseId: mlCourse.id,
      duration: 360,
      order: 1,
      videoUrl: 'https://www.youtube.com/watch?v=cKxRvEZd3Mw',
      content: 'Welcome to Machine Learning Recipes! Write your first ML program using scikit-learn. Learn supervised learning and train a classifier in 6 lines of code.'
    });

    await Lesson.create({
      title: 'Visualizing a Decision Tree - ML Recipes #2',
      description: 'Learn how to visualize and understand decision trees',
      courseId: mlCourse.id,
      duration: 420,
      order: 2,
      videoUrl: 'https://www.youtube.com/watch?v=tNa99PG8hR8',
      content: 'Dive deeper into decision trees. Visualize your tree to understand how it makes predictions and follows different branches.'
    });

    await Lesson.create({
      title: 'What Makes a Good Feature? - ML Recipes #3',
      description: 'Understand feature engineering and selection',
      courseId: mlCourse.id,
      duration: 390,
      order: 3,
      videoUrl: 'https://www.youtube.com/watch?v=N9fDIAflCMY',
      content: 'Features are the fuel of ML. Learn feature engineering, avoiding redundant features, and choosing informative inputs.'
    });

    await Lesson.create({
      title: 'Let\'s Write a Pipeline - ML Recipes #4',
      description: 'Build production-ready ML pipelines',
      courseId: mlCourse.id,
      duration: 450,
      order: 4,
      videoUrl: 'https://www.youtube.com/watch?v=84gqSbLcBFE',
      content: 'Build robust pipelines using scikit-learn. Compare different algorithms and learn the importance of train/test separation.'
    });

    await Lesson.create({
      title: 'Writing Our First Classifier - ML Recipes #5',
      description: 'Implement your own ML algorithm from scratch',
      courseId: mlCourse.id,
      duration: 480,
      order: 5,
      videoUrl: 'https://www.youtube.com/watch?v=AoeEHqVSNOw',
      content: 'Write your own image classifier from scratch using Python and NumPy. Implement k-Nearest Neighbors and classify MNIST digits.'
    });

    // Web Dev Course Lessons
    await Lesson.create({
      title: 'Web Development Fundamentals',
      description: 'Understanding how the web works',
      courseId: webDevCourse.id,
      duration: 540,
      order: 1,
      videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
      content: 'Learn how the internet works: clients, servers, HTTP/HTTPS, DNS, and the request-response cycle.'
    });

    await Lesson.create({
      title: 'HTML5 & Semantic Markup',
      description: 'Building the structure of web pages',
      courseId: webDevCourse.id,
      duration: 600,
      order: 2,
      videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
      content: 'Master HTML5 and semantic markup. Learn proper tags, forms, tables, and create accessible web pages.'
    });

    await Lesson.create({
      title: 'CSS3 & Modern Layouts',
      description: 'Styling and responsive design with CSS',
      courseId: webDevCourse.id,
      duration: 720,
      order: 3,
      videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
      content: 'Transform HTML with CSS. Master Flexbox, CSS Grid, responsive layouts, animations, and modern design.'
    });

    await Lesson.create({
      title: 'JavaScript ES6+ Essentials',
      description: 'Modern JavaScript programming',
      courseId: webDevCourse.id,
      duration: 900,
      order: 4,
      videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
      content: 'Learn modern JavaScript: variables, functions, async/await, DOM manipulation, and ES6+ features.'
    });

    await Lesson.create({
      title: 'React Fundamentals & Hooks',
      description: 'Building interactive UIs with React',
      courseId: webDevCourse.id,
      duration: 1080,
      order: 5,
      videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
      content: 'Master React: components, props, state, hooks (useState, useEffect), and build modern UIs.'
    });

    await Lesson.create({
      title: 'Backend with Node.js & Express',
      description: 'Server-side JavaScript development',
      courseId: webDevCourse.id,
      duration: 960,
      order: 6,
      videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
      content: 'Build backend APIs with Node.js and Express. Learn routing, middleware, authentication, and RESTful design.'
    });

    await Lesson.create({
      title: 'Database Design & PostgreSQL',
      description: 'Working with relational databases',
      courseId: webDevCourse.id,
      duration: 840,
      order: 7,
      videoUrl: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
      content: 'Master database design with PostgreSQL. Learn SQL queries, table relationships, and use Prisma ORM.'
    });

    await Lesson.create({
      title: 'Full Stack Integration & Deployment',
      description: 'Deploying to production',
      courseId: webDevCourse.id,
      duration: 1020,
      order: 8,
      videoUrl: 'https://www.youtube.com/watch?v=l134cBAJCuc',
      content: 'Integrate frontend and backend, handle CORS, authentication, and deploy to Vercel, Railway, and Supabase.'
    });

    console.log('📝 Creating quizzes...');

    // ML Course Quiz
    await Quiz.create({
      title: 'Machine Learning Fundamentals Quiz',
      courseId: mlCourse.id,
      lessonId: null,
      questions: JSON.stringify([
        {
          question: 'What is supervised learning?',
          options: [
            'Learning with labeled training data',
            'Learning without any data',
            'Learning from unlabeled data',
            'Learning from reinforcement'
          ],
          correctAnswer: 0
        },
        {
          question: 'What makes a good feature in machine learning?',
          options: [
            'It should be informative and independent',
            'It should be redundant',
            'It should be random',
            'It should be constant'
          ],
          correctAnswer: 0
        },
        {
          question: 'What is the k-Nearest Neighbors algorithm used for?',
          options: [
            'Classification and regression',
            'Only clustering',
            'Feature extraction',
            'Data visualization'
          ],
          correctAnswer: 0
        }
      ]),
      passingScore: 70,
      timeLimit: 15
    });

    // Web Dev Course Quiz
    await Quiz.create({
      title: 'Full Stack Web Development Quiz',
      courseId: webDevCourse.id,
      lessonId: null,
      questions: JSON.stringify([
        {
          question: 'What does HTML stand for?',
          options: [
            'HyperText Markup Language',
            'High Tech Modern Language',
            'Home Tool Markup Language',
            'Hyperlink and Text Markup Language'
          ],
          correctAnswer: 0
        },
        {
          question: 'Which React Hook is used for side effects?',
          options: [
            'useEffect',
            'useState',
            'useContext',
            'useReducer'
          ],
          correctAnswer: 0
        },
        {
          question: 'What is REST in web development?',
          options: [
            'Representational State Transfer',
            'Remote Execution Service Technology',
            'Reliable External System Transfer',
            'Rapid Entry Service Tool'
          ],
          correctAnswer: 0
        }
      ]),
      passingScore: 70,
      timeLimit: 20
    });

    console.log('🎓 Creating enrollments...');

    // Enroll student in BOTH courses with 0% progress (fresh start)
    await Enrollment.create({
      userId: student.id,
      courseId: mlCourse.id,
      progress: 0,
      completed: false
    });

    await Enrollment.create({
      userId: student.id,
      courseId: webDevCourse.id,
      progress: 0,
      completed: false
    });

    console.log('\n✅ Database seeded successfully!\n');
    console.log('🔐 Demo Credentials:');
    console.log('----------------------------');
    console.log('Admin:   admin@iqdidactic.com / Demo2025!');
    console.log('Teacher: teacher@iqdidactic.com / Demo2025!');
    console.log('Student: student@iqdidactic.com / Demo2025!');
    console.log('----------------------------');
    console.log('\n📚 Courses Created:');
    console.log('1. Machine Learning Recipes (5 lessons + quiz)');
    console.log('2. Full Stack Web Development (8 lessons + quiz)');
    console.log('\n✨ All dummy data cleared - fresh realistic data!');
    console.log('\n⚠️  NOTE: New students will get CLEAN dashboards with NO dummy data!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();