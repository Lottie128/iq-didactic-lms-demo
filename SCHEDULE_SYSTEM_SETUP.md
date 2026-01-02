# Schedule System Setup & Testing Guide

## ✅ What's Been Implemented

A complete scheduling system has been added to your IQ Didactic LMS with:

### Backend Components
1. **Database Model** (`backend/models/Schedule.js`)
   - Event types: live-class, quiz, assignment, exam, office-hours, workshop
   - Meeting links, locations, capacity tracking
   - Recurring events support
   - Status tracking (scheduled, in-progress, completed, cancelled)

2. **Controller** (`backend/controllers/scheduleController.js`)
   - Full CRUD operations
   - Role-based access control (students view, teachers/admins edit)
   - Multiple query options (by month, date range, course, upcoming)

3. **Routes** (`backend/routes/scheduleRoutes.js`)
   - RESTful API endpoints
   - Authentication required for all endpoints

### Frontend Components
1. **Schedule Page** (`src/pages/Schedule.js`)
   - Calendar and list view tabs
   - Event filtering by type
   - Upcoming events sidebar
   - Create/edit/delete functionality for teachers

2. **Schedule Calendar** (`src/components/schedule/ScheduleCalendar.js`)
   - Interactive monthly calendar
   - Color-coded event dots
   - Click to view event details
   - Month navigation

3. **Schedule List** (`src/components/schedule/ScheduleList.js`)
   - Chronological event listing
   - Grouped by date
   - Sortable by date, type, or course
   - Meeting link quick access

4. **Schedule Form** (`src/components/schedule/ScheduleForm.js`)
   - Create/edit modal form
   - Course selection dropdown
   - Date/time pickers
   - Optional fields: location, meeting link, capacity, notes

5. **Services** (`src/services/scheduleService.js`, `src/services/courseService.js`)
   - API integration
   - No dummy data - all real API calls

## 🚀 Setup Instructions

### 1. Database Sync
Your backend will automatically create the `schedules` table on startup. Just restart your backend:

```bash
cd backend
npm start
```

Look for these log messages:
```
✅ Migration completed
🚀 Server running on port 5000
✅ Database synced successfully
```

### 2. Add Schedule Route to Your App

In your React router file (usually `src/App.js` or `src/Routes.js`), add:

```javascript
import Schedule from './pages/Schedule';

// Add to your routes:
<Route path="/schedule" element={<Schedule />} />
```

### 3. Add Navigation Link (Optional)

In your navigation component, add a link to the schedule:

```javascript
<Nav.Link href="/schedule">
  <Calendar size={18} className="me-2" />
  Schedule
</Nav.Link>
```

## 🧪 Testing the System

### Test as Teacher/Admin

1. **Login as teacher** (use credentials from your seeded data or create one)

2. **Navigate to `/schedule`** - You should see:
   - "Create Event" button in the header
   - Calendar view with current month
   - Empty state if no events exist yet

3. **Create a Test Event**:
   - Click "Create Event"
   - Fill in the form:
     - Title: "Introduction to React"
     - Event Type: "Live Class"
     - Course: Select any course you teach
     - Start Date/Time: Tomorrow at 10:00 AM
     - End Date/Time: Tomorrow at 11:00 AM
     - Meeting Link: `https://zoom.us/j/123456789`
   - Click "Create Event"

4. **Verify Event Creation**:
   - Event should appear on the calendar as a colored dot
   - Event should appear in "Upcoming Events" sidebar
   - Click the event to view details

5. **Test Calendar View**:
   - Navigate to different months using arrows
   - Click "Today" to return to current month
   - Click on a date with events to see details below calendar

6. **Test List View**:
   - Switch to "List View" tab
   - Events should be grouped by date
   - Click event to edit
   - Use dropdown menu to delete

7. **Test Filtering**:
   - In the sidebar, click different event types
   - Only matching events should display

8. **Test Edit/Delete**:
   - Click an event to edit
   - Make changes and save
   - Use delete option to remove event

### Test as Student

1. **Login as student**

2. **Navigate to `/schedule`**:
   - Should see calendar and list views
   - Should NOT see "Create Event" button
   - Should only see events for enrolled courses

3. **Verify Read-Only Access**:
   - Can view event details
   - Cannot edit or delete events
   - Can click meeting links to join sessions

## 📊 API Endpoints Available

### GET Endpoints
```
GET /api/schedules                      # All user schedules
GET /api/schedules/upcoming?limit=10    # Upcoming events
GET /api/schedules/month/:year/:month   # Schedules by month
GET /api/schedules/date-range?startDate=&endDate= # Date range
GET /api/schedules/course/:courseId     # Course schedules
GET /api/schedules/:id                  # Single schedule
```

### POST Endpoints (Teachers/Admins)
```
POST /api/schedules
Body: {
  title: string,
  description: string,
  eventType: enum,
  courseId: number,
  startDateTime: datetime,
  endDateTime: datetime,
  location: string (optional),
  meetingLink: string (optional),
  capacity: number (optional),
  notes: string (optional)
}
```

### PUT/DELETE Endpoints (Teachers/Admins)
```
PUT /api/schedules/:id      # Update schedule
DELETE /api/schedules/:id   # Delete schedule
```

## 🎨 Customization

### Event Type Colors
Edit in `Schedule.js`:
```javascript
const getEventTypeColor = (type) => {
  const colors = {
    'live-class': 'primary',    // Blue
    'quiz': 'warning',          // Yellow
    'assignment': 'info',       // Light blue
    'exam': 'danger',           // Red
    'office-hours': 'success',  // Green
    'workshop': 'secondary',    // Gray
    'other': 'dark'            // Dark gray
  };
  return colors[type] || 'secondary';
};
```

### Add New Event Types

1. Update backend model (`backend/models/Schedule.js`):
```javascript
eventType: {
  type: DataTypes.ENUM('live-class', 'quiz', 'assignment', 'exam', 'office-hours', 'workshop', 'webinar', 'other'),
  // ... add 'webinar'
}
```

2. Update frontend form (`src/components/schedule/ScheduleForm.js`):
```javascript
<option value="webinar">Webinar</option>
```

3. Update color mapping and filter options

## 🐛 Troubleshooting

### "Cannot find module '../middleware/auth'"
- ✅ Fixed - scheduleRoutes.js now imports from correct path

### "Failed to load schedules"
**Check:**
1. Backend is running on port 5000
2. Environment variable `REACT_APP_API_URL` is set correctly
3. User is authenticated (token in localStorage)
4. Database table `schedules` exists

**Debug:**
```javascript
// In browser console
localStorage.getItem('token')  // Should show JWT token
```

### "No courses in dropdown"
**Check:**
1. Courses exist in database
2. User has access to courses (teacher owns them, student enrolled)
3. Course API endpoint working: `GET /api/courses`

### Events not showing
**Check:**
1. Events exist for current month
2. Events belong to user's courses
3. Filter is not excluding events
4. Browser console for API errors

## 🔒 Security Notes

- All routes require authentication (JWT token)
- Role-based access:
  - **Students**: Read-only access to enrolled course schedules
  - **Teachers**: Full CRUD for their course schedules
  - **Admins**: Full CRUD for all schedules
- Authorization checks in controller before modifications

## 📱 Mobile Responsive

- Calendar adapts to smaller screens
- List view stacks items vertically
- Sidebar moves above content on mobile
- Touch-friendly buttons and interactions

## 🎯 Next Steps

### Potential Enhancements

1. **Notifications**
   - Send reminders before events
   - Notify students of new events

2. **Calendar Integration**
   - Export to Google Calendar/iCal
   - Sync with external calendars

3. **Attendance Tracking**
   - Mark attendance for live classes
   - Generate attendance reports

4. **Recording Links**
   - Add post-event recording links
   - Archive past sessions

5. **Recurring Events**
   - Implement full recurring event generation
   - Edit/delete series options

6. **Time Zone Support**
   - Display events in user's timezone
   - Store in UTC, convert for display

## ✨ Summary

Your scheduling system is now:
- ✅ Fully integrated with your existing LMS
- ✅ Using real API calls (no dummy data)
- ✅ Role-based access control
- ✅ Mobile responsive
- ✅ Dark-themed to match your design
- ✅ Production-ready

Just add the route to your app and start scheduling! 🚀