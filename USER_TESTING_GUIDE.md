# 🧪 IQ Didactic - User Testing Guide

## 🌐 LIVE WEBSITE

**URL:** https://www.iqdidactic.com

---

## ✅ TESTING SIGNUP (NEW USERS)

### **Test Case 1: Student Signup**

1. **Go to:** https://www.iqdidactic.com/signup

2. **Fill in the form:**
   ```
   Full Name:        Your Name
   Email:            test1@iqdidactic.com
   Mobile Number:    +260 97 123 4567
   Date of Birth:    1990-01-01
   Country:          Zambia
   City:             Lusaka
   Occupation:       Student
   Education Level:  Undergraduate
   Register As:      Student
   Password:         Test123!
   Confirm Password: Test123!
   ✓ Accept terms
   ```

3. **Click:** "Create Account"

4. **Expected Result:**
   - ✅ "Creating Account..." button shows loading state
   - ✅ Redirects to `/student` dashboard
   - ✅ Shows student name in header
   - ✅ Displays available courses
   - ✅ Shows "Get Started" or enrollment options

5. **Verify in Browser Console (F12):**
   ```javascript
   localStorage.getItem('token')    // Should show JWT token
   localStorage.getItem('user')     // Should show user object
   ```

---

### **Test Case 2: Teacher Signup**

1. **Go to:** https://www.iqdidactic.com/signup

2. **Fill in form with:**
   ```
   Register As: Teacher  ← Change this!
   (Fill rest same as above)
   ```

3. **Expected Result:**
   - ✅ Redirects to `/teacher` dashboard
   - ✅ Shows "Create Course" button
   - ✅ Displays teacher analytics
   - ✅ Shows course management interface

---

## 🔐 TESTING LOGIN (EXISTING USERS)

### **Test Case 3: Student Login**

1. **Go to:** https://www.iqdidactic.com/login

2. **Login with:**
   ```
   Email:    test1@iqdidactic.com
   Password: Test123!
   ```

3. **Expected Result:**
   - ✅ "Signing In..." button shows loading
   - ✅ Redirects to student dashboard
   - ✅ Shows enrolled courses (if any)
   - ✅ Displays progress stats

4. **Common Errors:**
   - ❌ "Invalid credentials" → User doesn't exist (use signup first!)
   - ❌ 401 Unauthorized → Backend issue (check Railway logs)
   - ❌ CORS error → Backend not allowing domain

---

### **Test Case 4: Failed Login (Wrong Password)**

1. **Try login with wrong password**

2. **Expected Result:**
   - ✅ Shows error message: "Invalid credentials"
   - ✅ Doesn't redirect
   - ✅ Form still editable

---

## 📊 TESTING DASHBOARDS

### **Student Dashboard Tests:**

1. **Verify UI loads:**
   - ✅ Dashboard header shows student name
   - ✅ Sidebar navigation visible
   - ✅ Stats cards display (courses, progress, etc.)

2. **Test API calls (Check Network tab - F12):**
   ```
   GET /api/users/stats          → 200 OK
   GET /api/courses              → 200 OK
   GET /api/courses/enrolled     → 200 OK
   ```

3. **Expected Data:**
   - ✅ Shows real course list
   - ✅ Enrollment button works
   - ✅ Progress bars display

---

### **Teacher Dashboard Tests:**

1. **Verify UI loads:**
   - ✅ "Create Course" button visible
   - ✅ Course management interface
   - ✅ Student analytics visible

2. **Test Course Creation:**
   - Click "Create Course"
   - Fill in course details
   - Submit
   - ✅ Course appears in "My Courses"

---

## 🐛 COMMON ISSUES & FIXES

### **Issue 1: "Invalid Credentials" on First Login**

**Cause:** User hasn't signed up yet

**Fix:**
1. Go to https://www.iqdidactic.com/signup
2. Create new account
3. Then try login again

---

### **Issue 2: 401 Unauthorized After Login**

**Cause:** Token not being saved or validated

**Debug Steps:**
```javascript
// In browser console (F12)
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// If both are null → signup/login didn't work
// If token exists but still 401 → backend auth issue
```

**Fix:**
- Clear localStorage and try again:
  ```javascript
  localStorage.clear();
  ```
- Re-login

---

### **Issue 3: Dashboard Shows No Data**

**Cause:** Database not seeded

**Fix:** Administrator needs to seed database (see PRODUCTION_SETUP.md)

---

### **Issue 4: CORS Error**

**Cause:** Backend not allowing www.iqdidactic.com

**Check:**
```javascript
// In browser console, look for:
"Access-Control-Allow-Origin header contains invalid value"
```

**Fix:** Backend needs to update CORS (already fixed in latest deployment)

---

### **Issue 5: "Failed to Fetch" Errors**

**Causes:**
1. Backend is down
2. Wrong API URL
3. Network issue

**Debug:**
```javascript
// Check API URL
console.log('API URL:', process.env.REACT_APP_API_URL);

// Should show:
https://iq-didactic-lms-demo-production.up.railway.app/api

// NOT:
http://localhost:5000/api  ← WRONG!
```

---

## 📱 TESTING ON DIFFERENT DEVICES

### **Desktop Browser:**
- ✅ Chrome
- ✅ Firefox  
- ✅ Safari
- ✅ Edge

### **Mobile:**
- ✅ Chrome Mobile
- ✅ Safari iOS
- ✅ Responsive design works

---

## ✅ COMPLETE TEST CHECKLIST

**Signup Flow:**
- [ ] Student can signup
- [ ] Teacher can signup
- [ ] Email validation works
- [ ] Password validation works
- [ ] Token is saved after signup
- [ ] Auto-redirect to dashboard works

**Login Flow:**
- [ ] Student can login
- [ ] Teacher can login
- [ ] Wrong password shows error
- [ ] Token is saved after login
- [ ] Dashboard loads correctly

**Student Dashboard:**
- [ ] Stats display correctly
- [ ] Course list shows
- [ ] Enrollment works
- [ ] Progress tracking works

**Teacher Dashboard:**
- [ ] Course creation works
- [ ] Course list shows
- [ ] Analytics display

**General:**
- [ ] Logout works
- [ ] Navigation works
- [ ] Responsive on mobile
- [ ] No CORS errors
- [ ] No console errors

---

## 🎯 REPORTING ISSUES

If you find bugs, report with:

1. **Steps to reproduce**
2. **Expected result**
3. **Actual result**
4. **Screenshots** (if applicable)
5. **Browser console errors** (F12 → Console tab)
6. **Network errors** (F12 → Network tab)

**Send to:** jaylottiemukuka@gmail.com

---

## 🎊 READY FOR PRODUCTION

Once all tests pass:
- ✅ Users can signup independently
- ✅ Login works reliably
- ✅ All dashboards load with real data
- ✅ No critical bugs

**Your app is live and ready for users!** 🚀
