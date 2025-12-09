const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Authentication APIs
export const authAPI = {
  async register(userData) {
    const response = await authFetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  async login(email, password, role) {
    const response = await authFetch(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  async logout() {
    await authFetch(`${API_URL}/auth/logout`, {
      method: 'POST'
    });
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getMe() {
    return await authFetch(`${API_URL}/auth/me`);
  },

  async updatePassword(currentPassword, newPassword) {
    return await authFetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

// User APIs
export const userAPI = {
  async getProfile() {
    return await authFetch(`${API_URL}/users/profile`);
  },

  async updateProfile(userData) {
    return await authFetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  async getUserStats() {
    return await authFetch(`${API_URL}/users/stats`);
  },

  async getAllUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/users?${query}`);
  },

  async getUserById(id) {
    return await authFetch(`${API_URL}/users/${id}`);
  },

  async deleteUser(id) {
    return await authFetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
  }
};

// Course APIs
export const courseAPI = {
  async getAllCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/courses?${query}`);
  },

  async getCourseById(id) {
    return await authFetch(`${API_URL}/courses/${id}`);
  },

  async createCourse(courseData) {
    return await authFetch(`${API_URL}/courses`, {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  },

  async updateCourse(id, courseData) {
    return await authFetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData)
    });
  },

  async deleteCourse(id) {
    return await authFetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE'
    });
  },

  async enrollCourse(id) {
    return await authFetch(`${API_URL}/courses/${id}/enroll`, {
      method: 'POST'
    });
  },

  async getEnrolledCourses() {
    return await authFetch(`${API_URL}/courses/enrolled/my-courses`);
  },

  async getMyCourses() {
    return await authFetch(`${API_URL}/courses/instructor/my-courses`);
  }
};

// Progress APIs
export const progressAPI = {
  async getCourseProgress(courseId) {
    return await authFetch(`${API_URL}/progress/${courseId}`);
  },

  async getLessonProgress(lessonId) {
    return await authFetch(`${API_URL}/progress/lesson/${lessonId}`);
  },

  async updateProgress(lessonId, data) {
    return await authFetch(`${API_URL}/progress/lesson/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async markLessonComplete(lessonId) {
    return await authFetch(`${API_URL}/progress/lesson/${lessonId}/complete`, {
      method: 'POST'
    });
  }
};

// Quiz APIs
export const quizAPI = {
  async getCourseQuizzes(courseId) {
    return await authFetch(`${API_URL}/quizzes/course/${courseId}`);
  },

  async getQuizById(id) {
    return await authFetch(`${API_URL}/quizzes/${id}`);
  },

  async createQuiz(quizData) {
    return await authFetch(`${API_URL}/quizzes`, {
      method: 'POST',
      body: JSON.stringify(quizData)
    });
  },

  async updateQuiz(id, quizData) {
    return await authFetch(`${API_URL}/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData)
    });
  },

  async deleteQuiz(id) {
    return await authFetch(`${API_URL}/quizzes/${id}`, {
      method: 'DELETE'
    });
  },

  async submitQuiz(id, answers, timeSpent) {
    return await authFetch(`${API_URL}/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent })
    });
  },

  async getQuizResults(id) {
    return await authFetch(`${API_URL}/quizzes/${id}/results`);
  }
};

// Review APIs
export const reviewAPI = {
  async getCourseReviews(courseId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/reviews/course/${courseId}?${query}`);
  },

  async createReview(courseId, rating, comment) {
    return await authFetch(`${API_URL}/reviews/course/${courseId}`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment })
    });
  },

  async updateReview(id, rating, comment) {
    return await authFetch(`${API_URL}/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ rating, comment })
    });
  },

  async deleteReview(id) {
    return await authFetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE'
    });
  },

  async markHelpful(id, helpful) {
    return await authFetch(`${API_URL}/reviews/${id}/helpful`, {
      method: 'POST',
      body: JSON.stringify({ helpful })
    });
  }
};

// Discussion APIs
export const discussionAPI = {
  async getDiscussions(courseId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/discussions/course/${courseId}?${query}`);
  },

  async getDiscussionById(id) {
    return await authFetch(`${API_URL}/discussions/${id}`);
  },

  async createDiscussion(data) {
    return await authFetch(`${API_URL}/discussions`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateDiscussion(id, data) {
    return await authFetch(`${API_URL}/discussions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteDiscussion(id) {
    return await authFetch(`${API_URL}/discussions/${id}`, {
      method: 'DELETE'
    });
  },

  async upvoteDiscussion(id) {
    return await authFetch(`${API_URL}/discussions/${id}/upvote`, {
      method: 'POST'
    });
  },

  async createComment(discussionId, content, parentId = null) {
    return await authFetch(`${API_URL}/discussions/${discussionId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId })
    });
  },

  async updateComment(commentId, content) {
    return await authFetch(`${API_URL}/discussions/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    });
  },

  async deleteComment(commentId) {
    return await authFetch(`${API_URL}/discussions/comments/${commentId}`, {
      method: 'DELETE'
    });
  },

  async upvoteComment(commentId) {
    return await authFetch(`${API_URL}/discussions/comments/${commentId}/upvote`, {
      method: 'POST'
    });
  },

  async markBestAnswer(commentId) {
    return await authFetch(`${API_URL}/discussions/comments/${commentId}/best-answer`, {
      method: 'POST'
    });
  }
};

// Achievement APIs
export const achievementAPI = {
  async getAllAchievements() {
    return await authFetch(`${API_URL}/achievements`);
  },

  async getUserAchievements() {
    return await authFetch(`${API_URL}/achievements/user`);
  },

  async checkAchievements() {
    return await authFetch(`${API_URL}/achievements/check`, {
      method: 'POST'
    });
  }
};

// Certificate APIs
export const certificateAPI = {
  async getUserCertificates() {
    return await authFetch(`${API_URL}/certificates`);
  },

  async getCertificateById(id) {
    return await authFetch(`${API_URL}/certificates/${id}`);
  },

  async generateCertificate(courseId) {
    return await authFetch(`${API_URL}/certificates/generate/${courseId}`, {
      method: 'POST'
    });
  }
};

// Notification APIs
export const notificationAPI = {
  async getNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/notifications?${query}`);
  },

  async markAsRead(id) {
    return await authFetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  async markAllAsRead() {
    return await authFetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT'
    });
  },

  async deleteNotification(id) {
    return await authFetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE'
    });
  }
};

// Admin APIs
export const adminAPI = {
  async getDashboardStats() {
    return await authFetch(`${API_URL}/admin/stats`);
  },

  async getUserAnalytics(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/admin/analytics/users?${query}`);
  },

  async getCourseAnalytics() {
    return await authFetch(`${API_URL}/admin/analytics/courses`);
  },

  async getRevenueAnalytics() {
    return await authFetch(`${API_URL}/admin/analytics/revenue`);
  }
};

export default {
  auth: authAPI,
  user: userAPI,
  course: courseAPI,
  progress: progressAPI,
  quiz: quizAPI,
  review: reviewAPI,
  discussion: discussionAPI,
  achievement: achievementAPI,
  certificate: certificateAPI,
  notification: notificationAPI,
  admin: adminAPI
};
