const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const { sequelize, testConnection, syncDatabase } = require('./config/db');
const seedDatabase = require('./seed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const quizRoutes = require('./routes/quizzes');
const reviewRoutes = require('./routes/reviews');
const discussionRoutes = require('./routes/discussions');
const achievementRoutes = require('./routes/achievements');
const certificateRoutes = require('./routes/certificates');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');
const errorHandler = require('./middleware/errorHandler');
const { createRateLimiter } = require('./middleware/rateLimiter');

const app = express();

// CORS configuration - PERMISSIVE for demo
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400
};

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/auth', createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts. Please try again later.'
}));

app.use('/api/', createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.'
}));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IQ Didactic API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'healthy', 
      uptime: process.uptime(),
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;

// Run migrations
const runMigrations = async () => {
  try {
    console.log('🔄 Running migrations...');
    const migrationsDir = path.join(__dirname, 'migrations');
    
    try {
      await fs.access(migrationsDir);
    } catch (error) {
      console.log('ℹ️  No migrations directory found, skipping migrations');
      return true;
    }

    const files = (await fs.readdir(migrationsDir))
      .filter(f => f.endsWith('.js'))
      .sort();
    
    console.log(`Found ${files.length} migration files`);

    if (files.length === 0) {
      console.log('ℹ️  No migration files found');
      return true;
    }

    for (const file of files) {
      console.log(`📝 Running migration: ${file}`);
      const migration = require(path.join(migrationsDir, file));
      
      try {
        await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        console.log(`✅ Migration completed: ${file}`);
      } catch (error) {
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.message.includes('does not exist')) {
          console.log(`⏭️  Migration already applied: ${file}`);
        } else {
          console.error(`❌ Migration failed: ${file}`);
          throw error;
        }
      }
    }

    console.log('✨ All migrations completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Critical migration error:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
};

// Initialize server
const startServer = async () => {
  try {
    console.log('🚀 Starting IQ Didactic API Server...');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    const migrationsSuccess = await runMigrations();
    if (!migrationsSuccess) {
      console.error('❌ Migrations failed. Server cannot start with incomplete schema.');
      process.exit(1);
    }

    const syncSuccess = await syncDatabase();
    if (!syncSuccess) {
      console.error('❌ Database sync failed. Exiting...');
      process.exit(1);
    }

    try {
      const { User } = require('./models');
      const userCount = await User.count();
      
      if (userCount === 0) {
        console.log('🌱 Database is empty. Seeding with demo data...');
        await seedDatabase();
        console.log('✅ Demo data seeded successfully!');
      } else {
        console.log('ℹ️  Database already has data. Skipping seed.');
      }
    } catch (seedError) {
      console.error('⚠️  Seed error (non-critical):', seedError.message);
    }

    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 Server running on port', PORT);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`✅ CORS: ENABLED (All origins allowed for demo)`);
      console.log(`🤖 AI Features: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Disabled (Set GEMINI_API_KEY)'}`);
      console.log('='.repeat(60) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error.name, error.message);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
    sequelize.close();
  });
});

startServer();

module.exports = app;