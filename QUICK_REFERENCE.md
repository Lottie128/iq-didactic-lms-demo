# 📝 IQ Didactic LMS - Quick Reference

## 🚀 Quick Commands

### Development

```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm start

# Run migrations
cd backend && npm run migrate

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Production

```bash
# Build frontend
npm run build

# Start backend (production)
cd backend && npm start

# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup.sql
```

---

## 🔑 Environment Variables

### Backend (.env)
```bash
JWT_SECRET=your-64-char-secret-here
DATABASE_URL=postgresql://user:pass@host:5432/db
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (Railway/Render)
```bash
JWT_SECRET=<strong-secret>
DATABASE_URL=<production-db-url>
FRONTEND_URL=https://your-domain.vercel.app
NODE_ENV=production
PORT=5000
```

---

## 📚 File Structure

```
iq-didactic-lms-demo/
├── backend/
│   ├── config/
│   │   └── db.js              # Database config
│   ├── controllers/
│   │   └── authController.js  # Auth logic
│   ├── middleware/
│   │   ├── auth.js            # JWT validation
│   │   ├── rateLimiter.js     # Rate limiting
│   │   └── validators.js      # Input validation
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Course.js          # Course model
│   │   └── Lesson.js          # Lesson model
│   ├── routes/
│   │   └── auth.js            # Auth routes
│   ├── utils/
│   │   └── responseFormatter.js # Standard responses
│   └── server.js              # Main server
├── src/
│   ├── components/
│   │   └── ErrorBoundary.js   # Error handling
│   ├── pages/
│   ├── services/
│   │   └── api.js             # API client
│   └── App.js                 # Main app
└── Documentation/
    ├── FIXES_SUMMARY.md       # All fixes
    ├── PERFORMANCE_GUIDE.md   # Optimization
    ├── DEPLOYMENT_GUIDE.md    # Deploy steps
    └── QUICK_REFERENCE.md     # This file
```

---

## 🔌 API Endpoints

### Authentication
```bash
POST   /api/auth/register     # Register user
POST   /api/auth/login        # Login
GET    /api/auth/me           # Get current user
POST   /api/auth/logout       # Logout
PUT    /api/auth/password     # Update password
```

### Courses
```bash
GET    /api/courses           # List courses
GET    /api/courses/:id       # Get course
POST   /api/courses           # Create course
PUT    /api/courses/:id       # Update course
DELETE /api/courses/:id       # Delete course
POST   /api/courses/:id/enroll # Enroll in course
```

### Lessons
```bash
GET    /api/lessons/course/:id # Get course lessons
GET    /api/lessons/:id       # Get lesson
POST   /api/lessons           # Create lesson
PUT    /api/lessons/:id       # Update lesson
DELETE /api/lessons/:id       # Delete lesson
```

### Health
```bash
GET    /                      # API info
GET    /health                # Health check
```

---

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character

### Rate Limits
- **Auth endpoints**: 10 requests / 15 minutes
- **API endpoints**: 100 requests / 15 minutes

### Token Expiration
- Default: 30 days (configurable in config/config.js)

---

## 🛠️ Common Tasks

### Add New API Endpoint

1. **Create Route** (`backend/routes/yourRoute.js`):
```javascript
const router = require('express').Router();
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  // Your logic
  return res.json({ success: true, data: [] });
});

module.exports = router;
```

2. **Register Route** (`backend/server.js`):
```javascript
const yourRoutes = require('./routes/yourRoute');
app.use('/api/your-endpoint', yourRoutes);
```

3. **Add Validation** (optional):
```javascript
const { body } = require('express-validator');

exports.validateYourEndpoint = [
  body('field').notEmpty().withMessage('Field required'),
  handleValidationErrors
];
```

### Add New Database Model

1. **Create Model** (`backend/models/YourModel.js`):
```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const YourModel = sequelize.define('YourModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'your_table',
  timestamps: true,
  indexes: [
    { fields: ['name'] }
  ]
});

module.exports = YourModel;
```

2. **Import in** `backend/models/index.js`

### Add Frontend Page

1. **Create Page** (`src/pages/YourPage.js`):
```javascript
import React from 'react';

function YourPage({ user, onLogout }) {
  return (
    <div>
      <h1>Your Page</h1>
    </div>
  );
}

export default YourPage;
```

2. **Add Route** (`src/App.js`):
```javascript
import YourPage from './pages/YourPage';

<Route 
  path="/your-page" 
  element={user ? <YourPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
/>
```

---

## 🐛 Debugging Tips

### Backend Not Starting
```bash
# Check logs
npm run dev

# Common issues:
# 1. Missing JWT_SECRET
# 2. Database not running
# 3. Port 5000 in use

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Frontend Can't Connect
```bash
# Check:
# 1. Backend is running
# 2. REACT_APP_API_URL is correct
# 3. CORS allows localhost:3000

# Test backend
curl http://localhost:5000/health
```

### Database Issues
```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1;"

# List tables
psql $DATABASE_URL -c "\dt"

# Check migrations
psql $DATABASE_URL -c "SELECT * FROM SequelizeMeta;"
```

### Token Issues
```bash
# Check token in browser:
# 1. Open DevTools > Application > Local Storage
# 2. Look for 'token' and 'user'
# 3. Decode JWT at jwt.io

# Clear local storage
localStorage.clear()
```

---

## 📈 Performance Tips

### Database Query Optimization
```javascript
// ❌ Bad - N+1 queries
const courses = await Course.findAll();
for (const course of courses) {
  course.instructor = await User.findByPk(course.instructorId);
}

// ✅ Good - Eager loading
const courses = await Course.findAll({
  include: [{ model: User, as: 'instructor' }]
});
```

### API Response Optimization
```javascript
// ❌ Bad - All fields
const users = await User.findAll();

// ✅ Good - Specific fields
const users = await User.findAll({
  attributes: ['id', 'name', 'email']
});
```

### Pagination
```javascript
const limit = 10;
const page = 1;
const offset = (page - 1) * limit;

const { count, rows } = await Course.findAndCountAll({
  limit,
  offset
});
```

---

## 📊 Monitoring

### Key Metrics to Watch

**Backend:**
- Response time < 200ms
- CPU usage < 80%
- Memory usage < 80%
- Database connections < max pool

**Frontend:**
- Time to Interactive < 3s
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s

### Health Checks

```bash
# Production health check
curl https://your-backend.railway.app/health

# Expected response
{
  "status": "healthy",
  "database": "connected",
  "uptime": 12345.67
}
```

---

## 🎓 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register with valid data
- [ ] Register with weak password (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Token persists after refresh
- [ ] Expired token triggers logout

**Authorization:**
- [ ] Student can't access admin routes
- [ ] Teacher can't access admin routes
- [ ] Unauthenticated users redirected to login

**Rate Limiting:**
- [ ] 11th auth request blocked
- [ ] 101st API request blocked

**Error Handling:**
- [ ] Error boundary catches component errors
- [ ] API errors show user-friendly messages
- [ ] Network errors detected

---

## 📦 Git Workflow

### Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "feat: add your feature"

# Push to GitHub
git push origin feature/your-feature

# Create PR, get review, merge
```

### Hotfix
```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug

# Fix bug
git add .
git commit -m "hotfix: fix critical bug"

# Push and merge immediately
git push origin hotfix/critical-bug
```

### Deploy to Production
```bash
# Merge to main
git checkout main
git merge feature/your-feature
git push origin main

# Railway/Render auto-deploys
# Vercel auto-deploys
```

---

## 📞 Support

### Documentation
- [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) - All fixes
- [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md) - Optimization
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deploy steps
- [BRANCH_README.md](./BRANCH_README.md) - Quick start

### External Resources
- [Sequelize Docs](https://sequelize.org/docs)
- [Express Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)

---

**Last Updated**: December 17, 2025  
**Version**: 1.0.0  
**Branch**: `fix/critical-security-and-improvements`
