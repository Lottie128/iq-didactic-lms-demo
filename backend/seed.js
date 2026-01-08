const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');
const { User, Course, Lesson, Enrollment, Progress, Quiz, Question } = require('./models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // CLEAN UP OLD DUMMY DATA FIRST
    console.log('🧹 Cleaning up old data...');
    await Progress.destroy({ where: {}, truncate: true, cascade: true });
    await Enrollment.destroy({ where: {}, truncate: true, cascade: true });
    if (Question) await Question.destroy({ where: {}, truncate: true, cascade: true });
    if (Quiz) await Quiz.destroy({ where: {}, truncate: true, cascade: true });
    await Lesson.destroy({ where: {}, truncate: true, cascade: true });
    await Course.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✓ Old data cleared');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('Demo2025!', 10);

    // Create Users
    console.log('Creating users...');
    const admin = await User.create({
      name: 'Dr. Sarah Mitchell',
      email: 'admin@iqdidactic.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Platform Administrator & Educational Technology Specialist',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=8b5cf6&color=fff'
    });

    const teacher = await User.create({
      name: 'Prof. Michael Chen',
      email: 'teacher@iqdidactic.com',
      password: hashedPassword,
      role: 'teacher',
      bio: 'Senior Software Engineer & ML Educator with 15+ years of experience',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=3b82f6&color=fff'
    });

    const student = await User.create({
      name: 'Alex Johnson',
      email: 'student@iqdidactic.com',
      password: hashedPassword,
      role: 'student',
      bio: 'Aspiring full-stack developer and AI enthusiast',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=22c55e&color=fff'
    });

    console.log('✓ Users created');

    // Create 2 HIGH-QUALITY COURSES
    console.log('Creating courses...');
    
    // COURSE 1: Machine Learning Recipes by Google
    const mlCourse = await Course.create({
      title: 'Machine Learning Recipes',
      description: 'Learn machine learning fundamentals with Google\'s practical recipe-style tutorials. This free course from YouTube covers essential ML concepts through hands-on examples, perfect for beginners looking to understand AI and machine learning basics. Build your first ML models with TensorFlow and understand how machines learn from data.',
      instructorId: teacher.id,
      category: 'Artificial Intelligence',
      level: 'beginner',
      duration: '5 lessons',
      price: 0, // Free course
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
      averageRating: 4.9,
      enrollmentCount: 0,
      requirements: 'Basic Python knowledge, Curiosity about AI',
      whatYouLearn: 'Machine Learning Basics, Decision Trees, Feature Engineering, ML Pipelines, Building Classifiers from Scratch'
    });

    // COURSE 2: Full Stack Web Development
    const webDevCourse = await Course.create({
      title: 'Full Stack Web Development',
      description: 'Master modern web development from frontend to backend. Learn HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Build real-world applications and understand the complete development lifecycle. This comprehensive course covers everything you need to become a professional full-stack developer, including responsive design, API development, authentication, and cloud deployment.',
      instructorId: teacher.id,
      category: 'Web Development',
      level: 'beginner',
      duration: '8 lessons',
      price: 49.99,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
      averageRating: 4.8,
      enrollmentCount: 0,
      requirements: 'Computer with internet, Basic computer skills, No prior coding experience needed',
      whatYouLearn: 'HTML5 & CSS3, JavaScript ES6+, React.js, Node.js & Express, PostgreSQL, RESTful APIs, Authentication, Cloud Deployment'
    });

    console.log('✓ Courses created');

    // Create ML Course Lessons
    console.log('Creating ML course lessons...');
    const mlLessons = [
      {
        courseId: mlCourse.id,
        title: 'Hello World - Machine Learning Recipes #1',
        description: 'Introduction to machine learning with a simple classifier',
        content: 'Welcome to Machine Learning Recipes! In this first episode, we\'ll write our first machine learning program using scikit-learn. We\'ll start with a simple "Hello World" example that classifies fruits based on their features like weight and texture. You\'ll learn what supervised learning is and how to train your first classifier in just 6 lines of code. By the end, you\'ll understand the basic workflow: import dataset → train classifier → make predictions. This foundational lesson sets the stage for everything else in machine learning.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=cKxRvEZd3Mw',
        videoPlatform: 'youtube',
        duration: 6,
        order: 1,
        published: true
      },
      {
        courseId: mlCourse.id,
        title: 'Visualizing a Decision Tree - ML Recipes #2',
        description: 'Learn how to visualize and understand decision trees',
        content: 'In this lesson, we dive deeper into decision trees - one of the most intuitive machine learning algorithms. You\'ll learn how to visualize your decision tree to understand exactly how it makes predictions. We\'ll explore how the tree asks questions about your data and follows different branches to reach conclusions. Understanding decision trees is crucial because they form the foundation for more advanced algorithms like random forests. We\'ll use graphviz to create beautiful visualizations that make the \'black box\' of ML transparent and understandable.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=tNa99PG8hR8',
        videoPlatform: 'youtube',
        duration: 7,
        order: 2,
        published: true
      },
      {
        courseId: mlCourse.id,
        title: 'What Makes a Good Feature? - ML Recipes #3',
        description: 'Understand feature engineering and selection',
        content: 'Features are the fuel of machine learning. In this essential lesson, you\'ll learn what makes a good feature and how to think about your data like a data scientist. We\'ll explore the concept of feature engineering - transforming raw data into meaningful inputs that help your model learn better. You\'ll discover how to avoid redundant features, handle missing data, and choose features that are informative and independent. Good features can make the difference between a mediocre model and an excellent one.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=N9fDIAflCMY',
        videoPlatform: 'youtube',
        duration: 7,
        order: 3,
        published: true
      },
      {
        courseId: mlCourse.id,
        title: 'Let\'s Write a Pipeline - ML Recipes #4',
        description: 'Build production-ready ML pipelines',
        content: 'Real-world machine learning isn\'t just about training models - it\'s about building robust pipelines. In this lesson, you\'ll learn how to replace one classifier with another using scikit-learn\'s powerful pipeline feature. We\'ll compare different algorithms (Decision Trees, K-Nearest Neighbors, etc.) using the same training and testing framework. You\'ll understand the importance of separating training and test data, and why you should never test on data you trained on.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=84gqSbLcBFE',
        videoPlatform: 'youtube',
        duration: 8,
        order: 4,
        published: true
      },
      {
        courseId: mlCourse.id,
        title: 'Writing Our First Classifier - ML Recipes #5',
        description: 'Implement your own machine learning algorithm from scratch',
        content: 'Time to get your hands dirty! In this advanced lesson, we\'ll write our own image classifier from scratch using just Python and NumPy. You\'ll implement the k-Nearest Neighbors algorithm yourself to truly understand how machine learning works under the hood. We\'ll classify handwritten digits from the MNIST dataset, one of the most famous datasets in ML history. By building your own classifier, you\'ll gain deep insights into how distance metrics work, how training data is stored, and how predictions are made.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=AoeEHqVSNOw',
        videoPlatform: 'youtube',
        duration: 8,
        order: 5,
        published: true
      }
    ];

    for (const lessonData of mlLessons) {
      await Lesson.create(lessonData);
    }
    console.log('✓ ML course lessons created');

    // Create Web Dev Course Lessons
    console.log('Creating web dev course lessons...');
    const webDevLessons = [
      {
        courseId: webDevCourse.id,
        title: 'Web Development Fundamentals',
        description: 'Understanding how the web works',
        content: 'Welcome to Full Stack Web Development! In this foundational lesson, we\'ll explore how the internet and web actually work. You\'ll learn about clients and servers, HTTP/HTTPS protocols, DNS, and how browsers render web pages. We\'ll cover the request-response cycle and understand what happens when you type a URL into your browser. You\'ll also get an overview of the full-stack architecture - frontend (what users see), backend (business logic and data), and databases (data storage).',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
        videoPlatform: 'youtube',
        duration: 9,
        order: 1,
        published: true
      },
      {
        courseId: webDevCourse.id,
        title: 'HTML5 & Semantic Markup',
        description: 'Building the structure of web pages',
        content: 'HTML is the backbone of every website. In this lesson, you\'ll master HTML5 and semantic markup principles. Learn how to structure content using proper tags like header, nav, main, article, section, and footer. We\'ll explore forms, tables, lists, and multimedia elements. You\'ll understand the importance of semantic HTML for SEO, accessibility, and maintainability. By the end, you\'ll be able to create well-structured, accessible web pages that follow modern best practices.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
        videoPlatform: 'youtube',
        duration: 10,
        order: 2,
        published: true
      },
      {
        courseId: webDevCourse.id,
        title: 'CSS3 & Modern Layouts',
        description: 'Styling and responsive design with CSS',
        content: 'Transform your plain HTML into beautiful, responsive designs! This lesson covers CSS3 fundamentals including selectors, the box model, positioning, and layout techniques. You\'ll master Flexbox and CSS Grid for modern, responsive layouts that work on any device. Learn about CSS variables, transitions, animations, and transforms to create engaging user experiences. We\'ll explore mobile-first design principles and media queries.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
        videoPlatform: 'youtube',
        duration: 12,
        order: 3,
        published: true
      },
      {
        courseId: webDevCourse.id,
        title: 'JavaScript ES6+ Essentials',
        description: 'Modern JavaScript programming',
        content: 'JavaScript is the programming language of the web. In this comprehensive lesson, you\'ll learn modern JavaScript (ES6+) from the ground up. Master variables (let, const), arrow functions, template literals, destructuring, spread/rest operators, and modules. Understand asynchronous JavaScript with Promises and async/await. Learn about the DOM API and how to manipulate web pages dynamically.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        videoPlatform: 'youtube',
        duration: 15,
        order: 4,
        published: true
      },
      {
        courseId: webDevCourse.id,
        title: 'React Fundamentals & Hooks',
        description: 'Building interactive UIs with React',
        content: 'React is the most popular JavaScript library for building user interfaces. Learn React fundamentals including JSX, components, props, and state. Master React Hooks like useState, useEffect, useContext, and useReducer. Understand component lifecycle and how to manage side effects. We\'ll build several projects including a todo app, weather dashboard, and shopping cart.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
        videoPlatform: 'youtube',
        duration: 18,
        order: 5,
        published: true
      },
      {
        courseId: webDevCourse.id,
        title: 'Backend with Node.js & Express',
        description: 'Server-side JavaScript development',
        content: 'Take your JavaScript skills to the server! Learn Node.js and Express to build powerful backend APIs. Understand the event loop, modules, and npm ecosystem. Master Express routing, middleware, error handling, and authentication. We\'ll build RESTful APIs with proper HTTP methods, status codes, and JSON responses. Learn about JWT authentication, password hashing with bcrypt, and securing your APIs.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        videoPlatform: 'youtube',
        duration: 16,
        order: 6,
        published: true
      },
      {
        courseId: webDevCourse.id,
        title: 'Database Design & PostgreSQL',
        description: 'Working with relational databases',
        content: 'Data is at the heart of every application. Learn database design principles and PostgreSQL, the world\'s most advanced open-source database. Master SQL queries (SELECT, JOIN, GROUP BY, etc.), table design, relationships (one-to-many, many-to-many), and normalization. Understand indexes, transactions, and constraints. We\'ll use Prisma ORM to interact with databases from Node.js in a type-safe way.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
        videoPlatform: 'youtube',
        duration: 14,
        order: 7,
        published: true
      },
      {
        courseId: webDevCourse.id,
        title: 'Full Stack Integration & Deployment',
        description: 'Connecting frontend, backend, and deploying to production',
        content: 'Bring it all together! In this final lesson, you\'ll integrate React frontend with Express backend, handle CORS, manage authentication flows, and deploy your full-stack application to production. Learn about environment management (dev, staging, prod), CI/CD pipelines, and monitoring. We\'ll deploy the frontend to Vercel, backend to Railway, and database to Supabase.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=l134cBAJCuc',
        videoPlatform: 'youtube',
        duration: 17,
        order: 8,
        published: true
      }
    ];

    for (const lessonData of webDevLessons) {
      await Lesson.create(lessonData);
    }
    console.log('✓ Web dev course lessons created');

    // Create QUIZZES (if Quiz model exists)
    if (Quiz && Question) {
      console.log('Creating quizzes...');
      
      const mlQuiz = await Quiz.create({
        courseId: mlCourse.id,
        title: 'Machine Learning Fundamentals Quiz',
        description: 'Test your understanding of ML concepts from the course',
        passingScore: 70,
        timeLimit: 15,
        published: true
      });

      const mlQuestions = [
        {
          quizId: mlQuiz.id,
          question: 'What is supervised learning?',
          options: JSON.stringify([
            'Learning with labeled training data',
            'Learning without any data',
            'Learning from unlabeled data',
            'Learning from reinforcement'
          ]),
          correctAnswer: 0,
          points: 10
        },
        {
          quizId: mlQuiz.id,
          question: 'What makes a good feature in machine learning?',
          options: JSON.stringify([
            'It should be informative and independent',
            'It should be redundant',
            'It should be random',
            'It should be constant'
          ]),
          correctAnswer: 0,
          points: 10
        }
      ];

      for (const q of mlQuestions) {
        await Question.create(q);
      }

      const webQuiz = await Quiz.create({
        courseId: webDevCourse.id,
        title: 'Full Stack Web Development Quiz',
        description: 'Test your knowledge of web development concepts',
        passingScore: 70,
        timeLimit: 20,
        published: true
      });

      const webQuestions = [
        {
          quizId: webQuiz.id,
          question: 'What does HTML stand for?',
          options: JSON.stringify([
            'HyperText Markup Language',
            'High Tech Modern Language',
            'Home Tool Markup Language',
            'Hyperlink and Text Markup Language'
          ]),
          correctAnswer: 0,
          points: 10
        },
        {
          quizId: webQuiz.id,
          question: 'Which React Hook is used for side effects?',
          options: JSON.stringify([
            'useEffect',
            'useState',
            'useContext',
            'useReducer'
          ]),
          correctAnswer: 0,
          points: 10
        }
      ];

      for (const q of webQuestions) {
        await Question.create(q);
      }

      console.log('✓ Quizzes and questions created');
    }

    // Enroll student in BOTH courses with 0% progress (fresh start)
    console.log('Creating enrollments...');
    await Enrollment.create({
      userId: student.id,
      courseId: mlCourse.id,
      progress: 0
    });

    await Enrollment.create({
      userId: student.id,
      courseId: webDevCourse.id,
      progress: 0
    });
    console.log('✓ Enrollments created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n🔐 Demo Credentials:');
    console.log('   Admin:   admin@iqdidactic.com / Demo2025!');
    console.log('   Teacher: teacher@iqdidactic.com / Demo2025!');
    console.log('   Student: student@iqdidactic.com / Demo2025!');
    console.log('\n📚 Courses Created:');
    console.log('   1. Machine Learning Recipes (5 lessons + quiz)');
    console.log('   2. Full Stack Web Development (8 lessons + quiz)');
    console.log('\n✨ All dummy data cleared - fresh realistic data loaded!');
    console.log('\n⚠️  NOTE: Students signing up will get CLEAN dashboards with NO dummy data!');

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
};

module.exports = seedDatabase;