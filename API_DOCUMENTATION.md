# IQ Didactic LMS API Documentation

## Base URL
```
Production: https://iq-didactic-lms-demo-production.up.railway.app
```

---

## Authentication
All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Analytics Endpoints

### 1. Student Dashboard Analytics
**GET** `/api/analytics/student`

**Auth Required:** Yes (Student role)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCourses": 3,
      "completedCourses": 1,
      "inProgressCourses": 2,
      "avgProgress": 65,
      "completedLessons": 12,
      "streak": 5,
      "totalHours": 15
    },
    "recentCourses": [
      {
        "id": 1,
        "title": "Complete Web Development Bootcamp 2025",
        "instructor": "Dr. Sarah Johnson",
        "progress": 80,
        "thumbnail": "https://...",
        "lastAccessed": "2025-12-17T..."
      }
    ]
  }
}
```

---

### 2. Teacher Dashboard Analytics
**GET** `/api/analytics/teacher`

**Auth Required:** Yes (Teacher or Admin role)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCourses": 2,
      "publishedCourses": 2,
      "totalLessons": 8,
      "totalStudents": 6,
      "totalEnrollments": 11,
      "avgCompletion": 65,
      "revenue": "549.89"
    },
    "coursePerformance": [
      {
        "id": 1,
        "title": "Complete Web Development Bootcamp 2025",
        "students": 6,
        "avgProgress": 65,
        "published": true,
        "lessons": 5
      },
      {
        "id": 3,
        "title": "UI/UX Design Fundamentals",
        "students": 4,
        "avgProgress": 62,
        "published": true,
        "lessons": 2
      }
    ],
    "recentStudents": [
      {
        "id": 9,
        "name": "Henry Taylor",
        "email": "student8@iqdidactic.com",
        "avatar": "https://...",
        "enrolledAt": "2025-12-17T...",
        "courseId": 2,
        "progress": 15
      }
    ]
  }
}
```

---

### 3. Teacher's Students List
**GET** `/api/analytics/teacher/students`

**Auth Required:** Yes (Teacher or Admin role)

**Query Parameters:**
- `courseId` (optional): Filter by specific course
- `search` (optional): Search by name or email
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "userId": 2,
        "name": "Alice Williams",
        "email": "student1@iqdidactic.com",
        "avatar": "https://...",
        "courseId": 1,
        "courseTitle": "Complete Web Development Bootcamp 2025",
        "progress": 80,
        "enrolledAt": "2025-12-17T...",
        "lastActive": "2025-12-17T..."
      }
    ],
    "courses": [
      { "id": 1, "title": "Complete Web Development Bootcamp 2025" },
      { "id": 3, "title": "UI/UX Design Fundamentals" }
    ],
    "pagination": {
      "total": 11,
      "page": 1,
      "pages": 1
    }
  }
}
```

---

## Admin Endpoints

### 1. Admin Dashboard Stats
**GET** `/api/admin/stats`

**Auth Required:** Yes (Admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 11,
      "students": 8,
      "teachers": 2,
      "pendingTeachers": 0
    },
    "courses": {
      "total": 4,
      "published": 4,
      "draft": 0
    },
    "enrollments": {
      "total": 18,
      "recent": 18,
      "avgCompletion": 57
    },
    "lessons": 13,
    "revenue": "2234.82"
  }
}
```

---

### 2. Get All Users
**GET** `/api/admin/users`

**Auth Required:** Yes (Admin only)

**Query Parameters:**
- `role` (optional): Filter by role (student, teacher, admin)
- `verified` (optional): Filter by verification status (true/false)
- `search` (optional): Search by name or email
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Admin User",
        "email": "admin@iqdidactic.com",
        "role": "admin",
        "verified": true,
        "avatar": "https://...",
        "isActive": true,
        "createdAt": "2025-12-17T..."
      }
    ],
    "pagination": {
      "total": 11,
      "page": 1,
      "pages": 1
    }
  }
}
```

---

### 3. Get Pending Teachers
**GET** `/api/admin/teachers/pending`

**Auth Required:** Yes (Admin only)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "teacher",
      "verified": false,
      "bio": "Experienced educator...",
      "createdAt": "2025-12-17T..."
    }
  ]
}
```

---

### 4. Verify Teacher
**PUT** `/api/admin/teachers/:id/verify`

**Auth Required:** Yes (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Teacher verified successfully",
  "data": {
    "id": 15,
    "name": "John Doe",
    "email": "john@example.com",
    "verified": true
  }
}
```

---

### 5. Reject Teacher
**DELETE** `/api/admin/teachers/:id/reject`

**Auth Required:** Yes (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Teacher application rejected"
}
```

---

### 6. Update User
**PUT** `/api/admin/users/:id`

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "role": "teacher",
  "verified": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 15,
    "name": "Updated Name",
    "email": "newemail@example.com",
    "role": "teacher",
    "verified": true
  }
}
```

---

### 7. Delete User
**DELETE** `/api/admin/users/:id`

**Auth Required:** Yes (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 8. Get All Courses (Admin)
**GET** `/api/admin/courses`

**Auth Required:** Yes (Admin only)

**Query Parameters:**
- `published` (optional): Filter by published status (true/false)
- `search` (optional): Search by title or description
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "title": "Complete Web Development Bootcamp 2025",
        "description": "Master full-stack...",
        "category": "Programming",
        "level": "beginner",
        "price": "49.99",
        "published": true,
        "enrollmentCount": 156,
        "instructor": {
          "id": 2,
          "name": "Dr. Sarah Johnson",
          "email": "sarah@iqdidactic.com"
        },
        "createdAt": "2025-12-17T..."
      }
    ],
    "pagination": {
      "total": 4,
      "page": 1,
      "pages": 1
    }
  }
}
```

---

## Frontend Integration Examples

### Example: Fetch Teacher Analytics
```javascript
const fetchTeacherAnalytics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      'https://iq-didactic-lms-demo-production.up.railway.app/api/analytics/teacher',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const { data } = await response.json();
    
    // Use real data
    setTotalCourses(data.overview.totalCourses);
    setTotalEnrollments(data.overview.totalEnrollments);
    setAvgProgress(data.overview.avgCompletion);
    setRevenue(data.overview.revenue);
    setCourses(data.coursePerformance);
    setRecentStudents(data.recentStudents);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
  }
};
```

### Example: Fetch Teacher's Students
```javascript
const fetchStudents = async (courseId = null, page = 1) => {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    params.append('page', page);
    params.append('limit', 20);
    
    const response = await fetch(
      `https://iq-didactic-lms-demo-production.up.railway.app/api/analytics/teacher/students?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const { data } = await response.json();
    
    // Use real data
    setStudents(data.students);
    setCoursesList(data.courses);
    setPagination(data.pagination);
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
};
```

### Example: Verify Teacher (Admin)
```javascript
const verifyTeacher = async (teacherId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `https://iq-didactic-lms-demo-production.up.railway.app/api/admin/teachers/${teacherId}/verify`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = await response.json();
    if (result.success) {
      alert('Teacher verified successfully!');
      // Refresh pending teachers list
      fetchPendingTeachers();
    }
  } catch (error) {
    console.error('Failed to verify teacher:', error);
  }
};
```

---

## Key Changes Needed in Frontend

### Teacher Dashboard
**Replace dummy data with:**
1. Call `GET /api/analytics/teacher` on mount
2. Use `data.overview` for stats cards
3. Use `data.coursePerformance` for course list
4. Use `data.recentStudents` for recent students

### Student Management (Teacher)
**Replace dummy data with:**
1. Call `GET /api/analytics/teacher/students` on mount
2. Use `data.students` for student list
3. Use `data.courses` for course filter dropdown
4. Use `data.pagination` for pagination controls

### Admin Dashboard
**Replace dummy data with:**
1. Call `GET /api/admin/stats` on mount
2. Call `GET /api/admin/users` for user management
3. Call `GET /api/admin/teachers/pending` for verification queue
4. Call `GET /api/admin/courses` for course management

---

## Notes
- All timestamps are in ISO 8601 format
- All prices are strings (formatted decimals)
- Pagination uses standard page/limit parameters
- Search is case-insensitive partial match
- All authenticated endpoints return 401 if token is invalid
- Admin endpoints return 403 if user is not admin
