const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');
const { User, Course, Lesson, Enrollment, Progress } = require('./models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Users
    console.log('Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@iqdidactic.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'Platform Administrator',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=667eea&color=fff'
    });

    const teacher1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah@iqdidactic.com',
      password: hashedPassword,
      role: 'teacher',
      bio: 'Senior Software Engineer with 10+ years of experience in web development',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=22c55e&color=fff'
    });

    const teacher2 = await User.create({
      name: 'Prof. Michael Chen',
      email: 'michael@iqdidactic.com',
      password: hashedPassword,
      role: 'teacher',
      bio: 'Data Science expert and AI researcher',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=3b82f6&color=fff'
    });

    const students = [];
    const studentNames = [
      'Alice Williams',
      'Bob Smith',
      'Carol Martinez',
      'David Brown',
      'Emma Davis',
      'Frank Wilson',
      'Grace Lee',
      'Henry Taylor'
    ];

    for (let i = 0; i < studentNames.length; i++) {
      const student = await User.create({
        name: studentNames[i],
        email: `student${i + 1}@iqdidactic.com`,
        password: hashedPassword,
        role: 'student',
        bio: `Passionate learner interested in technology and innovation`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentNames[i])}&background=random&color=fff`
      });
      students.push(student);
    }

    console.log('✅ Users created');

    // Create Courses
    console.log('Creating courses...');
    const course1 = await Course.create({
      title: 'Complete Web Development Bootcamp 2025',
      description: 'Master full-stack web development with HTML, CSS, JavaScript, React, Node.js, and PostgreSQL. Build real-world projects and launch your career as a web developer.',
      instructorId: teacher1.id,
      category: 'Programming',
      level: 'beginner',
      duration: '12 weeks',
      price: 49.99,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
      averageRating: 4.8,
      enrollmentCount: 156,
      requirements: 'Basic computer skills, No prior programming experience needed',
      whatYouLearn: 'HTML5 & CSS3, JavaScript ES6+, React.js, Node.js & Express, PostgreSQL, RESTful APIs, Git & GitHub, Deployment'
    });

    const course2 = await Course.create({
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning using Python. Work with real datasets and build predictive models.',
      instructorId: teacher2.id,
      category: 'Data Science',
      level: 'intermediate',
      duration: '10 weeks',
      price: 59.99,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
      averageRating: 4.9,
      enrollmentCount: 234,
      requirements: 'Basic Python knowledge, Understanding of mathematics',
      whatYouLearn: 'NumPy & Pandas, Data Visualization, Statistical Analysis, Machine Learning, Deep Learning Basics, Real Projects'
    });

    const course3 = await Course.create({
      title: 'UI/UX Design Fundamentals',
      description: 'Master the principles of user interface and user experience design. Create beautiful, user-friendly digital products.',
      instructorId: teacher1.id,
      category: 'Design',
      level: 'beginner',
      duration: '8 weeks',
      price: 39.99,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
      averageRating: 4.7,
      enrollmentCount: 189,
      requirements: 'Creative mindset, Basic computer skills',
      whatYouLearn: 'Design Principles, Figma & Adobe XD, User Research, Wireframing, Prototyping, Design Systems'
    });

    const course4 = await Course.create({
      title: 'Digital Marketing Masterclass',
      description: 'Learn SEO, social media marketing, content marketing, and paid advertising to grow businesses online.',
      instructorId: teacher2.id,
      category: 'Marketing',
      level: 'beginner',
      duration: '6 weeks',
      price: 34.99,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      averageRating: 4.6,
      enrollmentCount: 312,
      requirements: 'Basic internet knowledge',
      whatYouLearn: 'SEO Fundamentals, Social Media Strategy, Content Creation, Email Marketing, Analytics, Ad Campaigns'
    });

    console.log('✅ Courses created');

    // Create Lessons for Course 1
    console.log('Creating lessons...');
    const course1Lessons = [
      {
        courseId: course1.id,
        title: 'Introduction to Web Development',
        description: 'Overview of web development, tools, and what you\'ll learn in this course',
        content: 'Welcome to the Complete Web Development Bootcamp! In this lesson, we\'ll cover the fundamentals of how the web works and what technologies you\'ll be learning.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
        videoPlatform: 'youtube',
        duration: 15,
        order: 1,
        published: true
      },
      {
        courseId: course1.id,
        title: 'HTML Basics - Structure Your Web Pages',
        description: 'Learn HTML tags, elements, and semantic markup',
        content: 'HTML is the foundation of all web pages. You\'ll learn how to structure content using tags, create links, add images, and build forms.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
        videoPlatform: 'youtube',
        duration: 25,
        order: 2,
        published: true
      },
      {
        courseId: course1.id,
        title: 'CSS Styling - Make It Beautiful',
        description: 'Master CSS selectors, properties, and layouts',
        content: 'CSS brings your HTML to life with colors, fonts, layouts, and animations. Learn Flexbox and Grid for modern responsive designs.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
        videoPlatform: 'youtube',
        duration: 30,
        order: 3,
        published: true
      },
      {
        courseId: course1.id,
        title: 'JavaScript Fundamentals',
        description: 'Variables, functions, and control flow in JavaScript',
        content: 'JavaScript adds interactivity to your web pages. Learn variables, data types, functions, loops, and conditional statements.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        videoPlatform: 'youtube',
        duration: 35,
        order: 4,
        published: true
      },
      {
        courseId: course1.id,
        title: 'React.js - Build Modern UIs',
        description: 'Introduction to React components and state management',
        content: 'React is the most popular JavaScript library for building user interfaces. Learn components, props, state, and hooks.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
        videoPlatform: 'youtube',
        duration: 40,
        order: 5,
        published: true
      }
    ];

    for (const lessonData of course1Lessons) {
      await Lesson.create(lessonData);
    }

    // Create Lessons for Course 2
    const course2Lessons = [
      {
        courseId: course2.id,
        title: 'Python for Data Science',
        description: 'Python basics and libraries for data analysis',
        content: 'Python is the most popular language for data science. Learn the essentials and key libraries like NumPy and Pandas.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
        videoPlatform: 'youtube',
        duration: 28,
        order: 1,
        published: true
      },
      {
        courseId: course2.id,
        title: 'Data Manipulation with Pandas',
        description: 'Master DataFrames and data cleaning techniques',
        content: 'Pandas is essential for data manipulation. Learn to load, clean, transform, and analyze data efficiently.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
        videoPlatform: 'youtube',
        duration: 32,
        order: 2,
        published: true
      },
      {
        courseId: course2.id,
        title: 'Data Visualization',
        description: 'Create compelling charts and graphs',
        content: 'Visualize your data with Matplotlib and Seaborn. Learn to create professional charts that tell stories.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=6GUZXDef2U0',
        videoPlatform: 'youtube',
        duration: 25,
        order: 3,
        published: true
      }
    ];

    for (const lessonData of course2Lessons) {
      await Lesson.create(lessonData);
    }

    // Create Lessons for Course 3
    const course3Lessons = [
      {
        courseId: course3.id,
        title: 'Introduction to UI/UX Design',
        description: 'Understanding user-centered design principles',
        content: 'UI/UX design is about creating intuitive, beautiful experiences. Learn the fundamental principles and processes.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
        videoPlatform: 'youtube',
        duration: 20,
        order: 1,
        published: true
      },
      {
        courseId: course3.id,
        title: 'Figma Basics',
        description: 'Getting started with Figma for design',
        content: 'Figma is the industry-standard design tool. Learn the interface, tools, and collaborative features.',
        type: 'video',
        videoUrl: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        videoPlatform: 'youtube',
        duration: 30,
        order: 2,
        published: true
      }
    ];

    for (const lessonData of course3Lessons) {
      await Lesson.create(lessonData);
    }

    console.log('✅ Lessons created');

    // Create Enrollments
    console.log('Creating enrollments...');
    const enrollments = [
      // Course 1 enrollments
      { userId: students[0].id, courseId: course1.id, progress: 80 },
      { userId: students[1].id, courseId: course1.id, progress: 60 },
      { userId: students[2].id, courseId: course1.id, progress: 100 },
      { userId: students[3].id, courseId: course1.id, progress: 40 },
      { userId: students[4].id, courseId: course1.id, progress: 20 },
      { userId: students[5].id, courseId: course1.id, progress: 90 },

      // Course 2 enrollments
      { userId: students[1].id, courseId: course2.id, progress: 45 },
      { userId: students[2].id, courseId: course2.id, progress: 75 },
      { userId: students[4].id, courseId: course2.id, progress: 30 },
      { userId: students[6].id, courseId: course2.id, progress: 85 },
      { userId: students[7].id, courseId: course2.id, progress: 15 },

      // Course 3 enrollments
      { userId: students[0].id, courseId: course3.id, progress: 50 },
      { userId: students[3].id, courseId: course3.id, progress: 70 },
      { userId: students[5].id, courseId: course3.id, progress: 35 },
      { userId: students[6].id, courseId: course3.id, progress: 95 },

      // Course 4 enrollments
      { userId: students[1].id, courseId: course4.id, progress: 25 },
      { userId: students[4].id, courseId: course4.id, progress: 55 },
      { userId: students[7].id, courseId: course4.id, progress: 10 }
    ];

    for (const enrollment of enrollments) {
      await Enrollment.create(enrollment);
    }

    console.log('✅ Enrollments created');

    // Create Progress for some lessons
    console.log('Creating progress records...');
    const course1LessonIds = await Lesson.findAll({ where: { courseId: course1.id }, attributes: ['id'] });
    
    // Student 0 (80% progress) - completed 4 out of 5 lessons
    for (let i = 0; i < 4; i++) {
      await Progress.create({
        userId: students[0].id,
        courseId: course1.id,
        lessonId: course1LessonIds[i].id,
        completed: true,
        timeSpent: i === 3 ? 20 : 0
      });
    }

    // Student 2 (100% progress) - completed all lessons
    for (let i = 0; i < course1LessonIds.length; i++) {
      await Progress.create({
        userId: students[2].id,
        courseId: course1.id,
        lessonId: course1LessonIds[i].id,
        completed: true,
        timeSpent: 0
      });
    }

    console.log('✅ Progress records created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('Admin: admin@iqdidactic.com / password123');
    console.log('Teacher 1: sarah@iqdidactic.com / password123');
    console.log('Teacher 2: michael@iqdidactic.com / password123');
    console.log('Students: student1@iqdidactic.com to student8@iqdidactic.com / password123');
    console.log('\n✅ All seed data created!');

  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
};

module.exports = seedDatabase;