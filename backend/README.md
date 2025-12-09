# IQ Didactic LMS Backend

## 🚀 Features

- ✅ RESTful API with Express.js
- ✅ PostgreSQL database with Sequelize ORM
- ✅ JWT authentication
- ✅ User management (students, teachers, admins)
- ✅ Course management with enrollments
- ✅ Progress tracking
- ✅ Quiz system with auto-grading
- ✅ Course reviews and ratings
- ✅ Discussion forums
- ✅ Achievements and gamification
- ✅ Certificates
- ✅ Notifications
- ✅ Admin analytics dashboard
- ✅ Birthday notifications (cron job)

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm or yarn

## 🛠️ Installation

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Set up PostgreSQL

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
psql -U postgres
CREATE DATABASE iq_didactic;
\q
```

**Option B: Cloud Database (Recommended)**
- **ElephantSQL** (Free): https://www.elephantsql.com
- **Render PostgreSQL**: https://render.com
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iq_didactic
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Run database migrations

The app will auto-create tables on first run (development mode).

For production, run:
```bash
npm run migrate
```

### 5. Start the server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on http://localhost:5000

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/password` - Update password

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/:id` - Delete user (admin)

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (teacher/admin)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/enrolled/my-courses` - Get enrolled courses
- `GET /api/courses/instructor/my-courses` - Get instructor courses

### Progress
- `GET /api/progress/:courseId` - Get course progress
- `GET /api/progress/lesson/:lessonId` - Get lesson progress
- `PUT /api/progress/lesson/:lessonId` - Update progress
- `POST /api/progress/lesson/:lessonId/complete` - Mark complete

### Quizzes
- `GET /api/quizzes/course/:courseId` - Get course quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes` - Create quiz (teacher/admin)
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/results` - Get quiz results

### Reviews
- `GET /api/reviews/course/:courseId` - Get course reviews
- `POST /api/reviews/course/:courseId` - Add review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark helpful

### Discussions
- `GET /api/discussions/course/:courseId` - Get discussions
- `GET /api/discussions/:id` - Get discussion details
- `POST /api/discussions` - Create discussion
- `PUT /api/discussions/:id` - Update discussion
- `DELETE /api/discussions/:id` - Delete discussion
- `POST /api/discussions/:id/upvote` - Upvote discussion
- `POST /api/discussions/:id/comments` - Add comment
- `PUT /api/discussions/comments/:commentId` - Update comment
- `DELETE /api/discussions/comments/:commentId` - Delete comment
- `POST /api/discussions/comments/:commentId/upvote` - Upvote comment
- `POST /api/discussions/comments/:commentId/best-answer` - Mark best answer

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/user` - Get user achievements
- `POST /api/achievements/check` - Check and unlock achievements

### Certificates
- `GET /api/certificates` - Get user certificates
- `GET /api/certificates/:id` - Get certificate by ID
- `POST /api/certificates/generate/:courseId` - Generate certificate

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/analytics/users` - User analytics
- `GET /api/admin/analytics/courses` - Course analytics
- `GET /api/admin/analytics/revenue` - Revenue analytics

## 🧪 Testing APIs

Use Postman, Insomnia, or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'

# Get courses (with token)
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚀 Deployment

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
railway login
railway init
railway add --database postgresql
railway up
```

### Deploy to Render

1. Create account at https://render.com
2. Create PostgreSQL database
3. Create Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy!

### Deploy to Heroku

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js              # Database connection
│   └── config.js          # App configuration
├── controllers/           # Route handlers
├── middleware/            # Auth, validation, errors
├── models/                # Database models
├── routes/                # API routes
├── utils/                 # Helper functions
├── server.js              # Express app
├── package.json
└── .env.example
```

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Helmet.js for HTTP headers
- CORS enabled
- Rate limiting
- Input validation
- SQL injection protection (Sequelize)

## 📝 License

MIT

## 🤝 Support

For issues, contact: support@iqdidactic.com
