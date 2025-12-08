# IQ Didactic LMS - Apple-Style Demo

![IQ Didactic](https://img.shields.io/badge/IQ-Didactic-black?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A stunning Apple-inspired Learning Management System demo built with React. Features glassmorphism design, role-based dashboards, AI teacher interface, and beautiful video players.

## ✨ Features

### 🎨 Design
- **Apple-style glassmorphism** with black/white color scheme
- **Smooth animations** and transitions throughout
- **Kick-ass loader** with orbital animations
- **Responsive design** for all screen sizes
- **Inter font** for that clean Apple aesthetic

### 👥 User Roles
- **Student Dashboard** - Course progress, video players, AI help
- **Teacher Dashboard** - Course management, student stats, AI assistant
- **Admin Dashboard** - Platform analytics, user management, system settings

### 🎓 Learning Features
- **2 Demo Courses** with real YouTube video integration
- **Beautiful Video Player** with glass design
- **Lesson Progress Tracking** with visual indicators
- **AI Teacher Interface** with chat-style interaction

### 🤖 AI Teacher
- Clean chat interface with glass bubbles
- Pulsing AI avatar animation
- Quick suggestion chips
- Demo responses (no backend required)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Lottie128/iq-didactic-lms-demo.git

# Navigate to project directory
cd iq-didactic-lms-demo

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🎬 Usage

### Login
1. Open the app and you'll see the loader animation
2. Choose a role: **Student**, **Teacher**, or **Admin**
3. Enter any email/password (no backend, all credentials work)
4. You'll be redirected to your role-specific dashboard

### Demo Accounts
- **Student**: See course progress, watch videos, access AI teacher
- **Teacher**: Manage courses, view analytics, use AI for lesson planning
- **Admin**: Platform overview, user management, system settings

### Navigate the App
- **Dashboard**: Overview and quick stats
- **Courses**: Browse and start courses
- **Course View**: Watch videos with beautiful player
- **AI Teacher**: Chat with AI assistant (simulated responses)

## 🎨 Customization

### Change Course Data

Edit `src/data/demoCourses.js` to customize courses:

```javascript
{
  id: 1,
  title: 'Your Course Title',
  level: 'Beginner/Intermediate/Advanced',
  duration: '4 weeks',
  progress: 0,
  category: 'Your Category',
  instructor: 'Instructor Name',
  description: 'Course description',
  students: 1000,
  videos: [
    {
      id: 1,
      title: 'Lesson Title',
      duration: '10:30',
      youtubeUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID',
      completed: false
    }
  ]
}
```

### Update YouTube Links

Replace the `youtubeUrl` in each video object with your YouTube embed URLs:

```javascript
youtubeUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
```

### Modify Colors

Edit `src/App.css` and component CSS files to change the color scheme:

```css
/* For primary buttons */
.btn-primary {
  background: #fff;  /* Change to your color */
  color: #000;
}

/* For glass effects */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
}
```

### Customize Loader

Edit `src/components/Loader.jsx` and `Loader.css` to modify the loading animation:

```javascript
// Change brand name
<span className="brand">IQ</span>
<span className="brand-sub">Didactic</span>
```

## 📁 Project Structure

```
iq-didactic-lms-demo/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Loader.jsx          # Loading screen
│   │   └── Loader.css
│   ├── data/
│   │   └── demoCourses.js      # Course data
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CourseView.jsx      # Video player page
│   │   ├── AITeacher.jsx       # AI chat interface
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   ├── CourseView.css
│   │   └── AITeacher.css
│   ├── App.js                  # Main app with routing
│   ├── App.css                 # Global styles
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎯 Key Components

### Loader
- 3-second animated loader on app start
- Orbital planet animation
- Glass card with progress bar
- IQ Didactic branding

### Authentication
- Clean login/signup forms
- Role selector (Student/Teacher/Admin)
- Glassmorphism cards
- No real backend - demo only

### Dashboards

**Student:**
- Welcome hero section
- Quick stats cards
- "Continue Learning" section
- Course grid with progress

**Teacher:**
- Course management cards
- Student analytics
- AI assistant shortcut
- Create course button

**Admin:**
- Platform metrics
- User management
- Course oversight
- System settings toggles

### Course View
- Responsive video player
- YouTube embed support
- Lesson sidebar with progress
- Glass design throughout

### AI Teacher
- Chat-style interface
- Simulated AI responses
- Quick suggestion chips
- Pulsing avatar animation

## 🛠️ Technologies

- **React 18.2** - UI framework
- **React Router 6** - Navigation
- **Lucide React** - Icons
- **CSS3** - Styling with glassmorphism
- **Create React App** - Build tooling

## 📱 Responsive Design

The app is fully responsive:
- **Desktop**: Full layout with sidebars
- **Tablet**: Adjusted grid layouts
- **Mobile**: Single column, stacked elements

## 🎥 Video Player

The video player supports:
- YouTube embed URLs
- Play overlay
- Lesson navigation
- Progress tracking (UI only)
- Responsive aspect ratio

## 🤖 AI Features

The AI Teacher demo includes:
- Chat interface
- Simulated responses (1-second delay)
- Message history
- Quick suggestions
- Online status indicator

## 🚧 Limitations

- **No Backend**: All data is in-memory, resets on refresh
- **No Authentication**: Any credentials will work
- **No Database**: Course data is hardcoded
- **Simulated AI**: AI responses are pre-scripted
- **No Real Video Upload**: Only YouTube embeds

## 🔧 Building for Production

```bash
# Create optimized production build
npm run build

# The build folder will contain your production files
# Deploy the build folder to any static hosting service
```

## 📝 Presenting to Clients

### Tips:
1. **Start with the loader** - Shows attention to detail
2. **Demo all 3 roles** - Student → Teacher → Admin
3. **Show video player** - Play a YouTube video
4. **Interact with AI** - Type a question, show response
5. **Highlight glassmorphism** - Point out the Apple-style design
6. **Show responsiveness** - Resize browser window

### Key Selling Points:
- Modern, professional Apple-inspired design
- Smooth animations and transitions
- Role-based access control
- AI-powered learning assistant
- Beautiful video learning experience
- Fully responsive across devices

## 🎨 Design Philosophy

This demo follows Apple's design principles:
- **Minimalism**: Clean, uncluttered interfaces
- **Typography**: Inter font with precise spacing
- **Glassmorphism**: Translucent layers with blur
- **Animations**: Smooth, purposeful motion
- **White Space**: Generous padding and margins
- **Contrast**: Black background, white accents

## 📄 License

MIT License - Feel free to use this for client demos and presentations.

## 🙋 Support

For questions or issues:
- Open an issue on GitHub
- Contact: lottie@iqdidactic.app

## 🎉 Credits

Built with ❤️ by ZeroAI Technologies for IQ Didactic

---

**Ready to present?** Clone, customize, and wow your clients! 🚀
