# IQ Didactic LMS - Full-Stack Demo

## 🎓 Complete Learning Management System

A modern, full-stack LMS built with React frontend and Node.js/Express/PostgreSQL backend.

## ✨ Features

### Frontend (React)
- ✅ Beautiful landing page with dark/light mode
- ✅ Extended signup (12 fields: name, email, phone, birthday, country, etc.)
- ✅ JWT authentication with session persistence
- ✅ Student dashboard with real-time data
- ✅ Teacher dashboard with course management
- ✅ Admin panel with analytics
- ✅ Course viewing and enrollment
- ✅ Progress tracking with heatmap
- ✅ Quiz system with AI monitoring
- ✅ Discussion forums
- ✅ Course reviews and ratings
- ✅ Achievements and badges
- ✅ Certificate generation
- ✅ User profile management
- ✅ AI Teacher chatbot
- ✅ Notifications center

### Backend (Node.js/Express/PostgreSQL)
- ✅ 60+ REST API endpoints
- ✅ JWT authentication
- ✅ User management (students, teachers, admins)
- ✅ Course CRUD with enrollments
- ✅ Progress tracking
- ✅ Quiz system with auto-grading
- ✅ Review and rating system
- ✅ Discussion forums with voting
- ✅ Achievement system
- ✅ Certificate generation
- ✅ Notification system
- ✅ Admin analytics
- ✅ Birthday notifications (cron job)
- ✅ PostgreSQL database

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 13
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/Lottie128/iq-didactic-lms-demo.git
cd iq-didactic-lms-demo
```

### 2. Setup Frontend

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env
REACT_APP_API_URL=http://localhost:5000/api

# Start frontend
npm start
```

Frontend runs on http://localhost:3000

### 3. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iq_didactic
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Setup Database

**Option A: Local PostgreSQL**
```bash
psql -U postgres
CREATE DATABASE iq_didactic;
\q
```

**Option B: Cloud Database (Recommended)**
- **ElephantSQL** (Free): https://www.elephantsql.com
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

Copy your database connection details to `backend/.env`

### 5. Start Backend

```bash
cd backend
npm run dev  # Development mode with auto-reload
```

Backend runs on http://localhost:5000

Database tables are auto-created on first run!

### 6. Test the Application

1. Open http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Register a new account with all fields
4. Login and explore!

## 📚 API Documentation

See `backend/README.md` for complete API documentation.

### Available Endpoints:
- Authentication (5 endpoints)
- Users (6 endpoints)
- Courses (9 endpoints)
- Progress (4 endpoints)
- Quizzes (7 endpoints)
- Reviews (5 endpoints)
- Discussions (10 endpoints)
- Achievements (3 endpoints)
- Certificates (3 endpoints)
- Notifications (4 endpoints)
- Admin (4 endpoints)

**Total: 60+ API endpoints**

## 🎯 Technology Stack

### Frontend
- React 18
- React Router
- Lucide Icons
- CSS3 with glassmorphism
- LocalStorage for JWT

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT authentication
- bcrypt for passwords
- node-cron for scheduled tasks

## 📁 Project Structure

```
iq-didactic-lms-demo/
├── src/                    # Frontend React app
│   ├── components/        # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API service layer
│   │   └── api.js         # All API calls
│   └── App.js             # Main app component
├── backend/               # Backend Node.js API
│   ├── config/            # Database config
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth, validation
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Helpers
│   └── server.js          # Express server
├── public/                # Static files
└── package.json           # Dependencies
```

## 🔐 Environment Variables

### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iq_didactic
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

## 🛠️ Development

### Run Frontend
```bash
npm start
```

### Run Backend
```bash
cd backend
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect to Vercel/Netlify
3. Set environment variable: `REACT_APP_API_URL`
4. Deploy!

### Backend (Railway/Render)
1. Push backend to GitHub
2. Create PostgreSQL database
3. Create Web Service
4. Set all environment variables
5. Deploy!

See `backend/README.md` for detailed deployment instructions.

## 📝 Features Connected to Backend

| Feature | Status |
|---------|--------|
| Login/Signup | ✅ Connected |
| Session Persistence | ✅ Connected |
| Student Dashboard | ✅ Connected |
| Course Enrollment | ✅ Connected |
| User Profile | ✅ Connected |
| Achievements | ✅ Connected |
| Certificates | ✅ Connected |
| Teacher Dashboard | ✅ Connected |
| Course View | ✅ Connected |
| Progress Tracking | ✅ Connected |
| Quizzes | ✅ Connected |
| Reviews | ✅ Connected |
| Discussions | ✅ Connected |

## 👥 Default Test Accounts

After signup, you can create accounts with different roles:

**Student:**
- Register with role: "student"

**Teacher:**
- Register with role: "teacher"

**Admin:**
- Must be set manually in database

## 🐛 Troubleshooting

### Backend won't connect to database
1. Ensure PostgreSQL is running
2. Check database credentials in `backend/.env`
3. Create database if it doesn't exist

### Frontend API calls failing
1. Check backend is running on port 5000
2. Verify `REACT_APP_API_URL` in `.env`
3. Check browser console for CORS errors

### "Token expired" errors
1. Clear localStorage
2. Login again

## 📚 Resources

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api
- Backend README: `backend/README.md`

## 📝 License

MIT

## 🤝 Support

For issues or questions:
- Create GitHub issue
- Email: support@iqdidactic.com

---

**Built with ❤️ by Lottie Mukuka**

**Demo:** Full-stack LMS with React + Node.js + PostgreSQL
