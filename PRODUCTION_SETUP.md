# 🚀 IQ Didactic LMS - Production Setup Guide

## 🎯 LIVE SITE

**Frontend:** https://www.iqdidactic.com  
**Backend API:** https://iq-didactic-lms-demo-production.up.railway.app  

---

## 📋 INITIAL DATABASE SETUP

### **Seed Database with Default Users and Courses**

The database needs to be seeded with default data for the app to work properly.

#### **Option 1: Via Railway Dashboard (Recommended)**

1. **Go to Railway Dashboard:** https://railway.app
2. **Select:** IQ Didactic project → Backend service
3. **Click:** Settings tab
4. **Scroll to:** Deploy section
5. **Custom Start Command:** Add this command:
   ```
   npm run seed:prod && npm start
   ```
6. **Click:** Save
7. **Redeploy** the service

**Note:** This will seed the database ONCE on next deployment, then start the server normally.

#### **Option 2: Via Railway CLI**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run seed command
railway run npm run seed
```

#### **Option 3: Manual SQL (Advanced)**

Connect to Railway PostgreSQL and run the seed script manually.

---

## 👥 DEFAULT USER ACCOUNTS

After seeding, these accounts are available:

### **Admin Account**
- **Email:** admin@iqdidactic.com
- **Password:** password123
- **Role:** Admin
- **Access:** Full system access, analytics, user management

### **Teacher Account**
- **Email:** teacher@iqdidactic.com
- **Password:** password123
- **Role:** Teacher  
- **Access:** Create courses, manage lessons, view student progress

### **Student Account**
- **Email:** student@iqdidactic.com
- **Password:** password123
- **Role:** Student
- **Access:** Enroll in courses, take quizzes, track progress

---

## 📚 SEEDED DATA

The seed script creates:

✅ **5 Users** (1 Admin, 2 Teachers, 2 Students)  
✅ **3 Sample Courses** (Web Development, Data Science, Mobile Apps)  
✅ **5 Lessons** across courses  
✅ **2 Quizzes** for testing  
✅ **3 Enrollments** for demo data

---

## 🧪 TESTING THE APP

### **Test Student Dashboard:**
1. Go to: https://www.iqdidactic.com/login
2. Login with: `student@iqdidactic.com` / `password123`
3. Should see:
   - Enrolled courses
   - Progress tracking
   - Available courses to enroll

### **Test Teacher Dashboard:**
1. Login with: `teacher@iqdidactic.com` / `password123`
2. Should see:
   - Created courses
   - Student enrollments
   - Course analytics

### **Test Admin Dashboard:**
1. Login with: `admin@iqdidactic.com` / `password123`
2. Should see:
   - System analytics
   - User management
   - All courses

---

## 🔧 ENVIRONMENT VARIABLES

### **Railway Backend**

Required environment variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://www.iqdidactic.com
```

### **Vercel Frontend**

Required environment variables:

```env
REACT_APP_API_URL=https://iq-didactic-lms-demo-production.up.railway.app/api
```

---

## 🚨 TROUBLESHOOTING

### **Issue: Login fails with "Invalid credentials"**

**Solution:**  
Database hasn't been seeded. Run the seed script (see above).

### **Issue: 401 Unauthorized on dashboard**

**Solution:**  
1. Check if JWT_SECRET is set in Railway
2. Verify token is being saved in localStorage
3. Check browser console for errors

### **Issue: CORS errors**

**Solution:**  
1. Verify FRONTEND_URL in Railway matches your domain
2. Check server.js has your domain in allowedOrigins
3. Redeploy backend after changes

### **Issue: No courses showing**

**Solution:**  
Database hasn't been seeded with sample courses. Run seed script.

---

## 📝 ADDING NEW USERS

Users can sign up at: https://www.iqdidactic.com/signup

Or create via admin dashboard:
1. Login as admin
2. Go to User Management
3. Click "Add User"
4. Fill in details

---

## 🔄 RE-SEEDING DATABASE

⚠️ **WARNING:** This will DELETE all existing data!

```bash
# Via Railway CLI
railway run npm run seed:prod
```

Or update the Railway start command temporarily:
```
npm run seed:prod && npm start
```

Then redeploy.

---

## 📊 DATABASE SCHEMA

The app uses these main tables:
- **users** - User accounts (admin, teacher, student)
- **courses** - Course information
- **lessons** - Course lessons/modules
- **quizzes** - Assessments
- **enrollments** - Student-course relationships
- **progress** - Lesson completion tracking
- **reviews** - Course reviews
- **discussions** - Course forums

---

## 🎯 PRODUCTION CHECKLIST

- [x] Railway backend deployed
- [x] Vercel frontend deployed
- [x] Custom domain configured
- [x] Environment variables set
- [x] CORS configured
- [ ] Database seeded
- [ ] Test all user roles
- [ ] Test course enrollment
- [ ] Test quiz functionality
- [ ] Test file uploads (if applicable)
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy

---

## 🆘 SUPPORT

For issues, contact:
- **Email:** jaylottiemukuka@gmail.com
- **GitHub:** https://github.com/Lottie128/iq-didactic-lms-demo/issues

---

## 📄 LICENSE

MIT License - See LICENSE file for details
