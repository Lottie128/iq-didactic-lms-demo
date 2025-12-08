const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
db.authenticate()
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch(err => console.error('❌ Database connection error:', err));

// Sync database (development only)
if (process.env.NODE_ENV === 'development') {
  db.sync({ alter: true })
    .then(() => console.log('✅ Database synced'))
    .catch(err => console.error('❌ Database sync error:', err));
}

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IQ Didactic API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      quizzes: '/api/quizzes',
      reviews: '/api/reviews',
      discussions: '/api/discussions',
      achievements: '/api/achievements',
      admin: '/api/admin'
    }
  });
});

app.use('/api/auth', authRoutes);

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/api/docs\n`);
});

module.exports = app;
