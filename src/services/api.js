// API Configuration with fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

if (!process.env.REACT_APP_API_URL) {
  console.warn('REACT_APP_API_URL not set, using default:', API_URL);
}

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() };

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Token expired or invalid - clear auth and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

// Helper for file uploads
const uploadFile = async (url, file, additionalData = {}) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  
  // Add any additional form data
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Upload failed! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
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

  async login(email, password) {
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
    try {
      await authFetch(`${API_URL}/auth/logout`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local cleanup even if API fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getMe() {
    return await authFetch(`${API_URL}/auth/me`);
  },

  async updatePassword(currentPassword, newPassword) {
    return await authFetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  // NEW: Email verification
  async sendVerificationEmail() {
    return await authFetch(`${API_URL}/auth/send-verification`, {
      method: 'POST'
    });
  },

  async verifyEmail(token) {
    return await authFetch(`${API_URL}/auth/verify-email/${token}`, {
      method: 'GET'
    });
  },

  // NEW: Password reset
  async forgotPassword(email) {
    return await authFetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(token, newPassword) {
    return await authFetch(`${API_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password: newPassword })
    });
  },

  async validateResetToken(token) {
    return await authFetch(`${API_URL}/auth/validate-reset-token/${token}`, {
      method: 'GET'
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
    return await authFetch(`${API_URL}/users${query ? `?${query}` : ''}`);
  },

  async getUserById(id) {
    return await authFetch(`${API_URL}/users/${id}`);
  },

  async deleteUser(id) {
    return await authFetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });
  },

  // NEW: Upload avatar
  async uploadAvatar(file) {
    return await uploadFile(`${API_URL}/users/avatar`, file);
  },

  async removeAvatar() {
    return await authFetch(`${API_URL}/users/avatar`, {
      method: 'DELETE'
    });
  }
};

// Course APIs
export const courseAPI = {
  async getAllCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/courses${query ? `?${query}` : ''}`);
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
  },

  // NEW: Upload course thumbnail
  async uploadThumbnail(courseId, file) {
    return await uploadFile(`${API_URL}/courses/${courseId}/thumbnail`, file);
  },

  // NEW: Preview course (no enrollment required)
  async getPreviewContent(id) {
    return await authFetch(`${API_URL}/courses/${id}/preview`);
  },

  // NEW: Export course
  async exportCourse(id) {
    const token = getToken();
    window.open(`${API_URL}/courses/${id}/export?token=${token}`, '_blank');
  },

  // NEW: Import course
  async importCourse(file) {
    return await uploadFile(`${API_URL}/courses/import`, file);
  },

  // NEW: Duplicate course
  async duplicateCourse(id) {
    return await authFetch(`${API_URL}/courses/${id}/duplicate`, {
      method: 'POST'
    });
  }
};

// Lesson APIs
export const lessonAPI = {
  async getCourseLessons(courseId) {
    return await authFetch(`${API_URL}/lessons/course/${courseId}`);
  },

  async getLessonById(id) {
    return await authFetch(`${API_URL}/lessons/${id}`);
  },

  async createLesson(lessonData) {
    return await authFetch(`${API_URL}/lessons`, {
      method: 'POST',
      body: JSON.stringify(lessonData)
    });
  },

  async updateLesson(id, lessonData) {
    return await authFetch(`${API_URL}/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData)
    });
  },

  async deleteLesson(id) {
    return await authFetch(`${API_URL}/lessons/${id}`, {
      method: 'DELETE'
    });
  },

  async reorderLessons(courseId, lessonOrders) {
    return await authFetch(`${API_URL}/lessons/reorder`, {
      method: 'POST',
      body: JSON.stringify({ courseId, lessonOrders })
    });
  },

  // NEW: Upload lesson video
  async uploadVideo(lessonId, file, onProgress) {
    // For large video files, we'll need progress tracking
    const token = getToken();
    const formData = new FormData();
    formData.append('video', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_URL}/lessons/${lessonId}/video`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },

  // NEW: Upload lesson resources
  async uploadResource(lessonId, file) {
    return await uploadFile(`${API_URL}/lessons/${lessonId}/resource`, file);
  },

  async deleteResource(lessonId, resourceId) {
    return await authFetch(`${API_URL}/lessons/${lessonId}/resource/${resourceId}`, {
      method: 'DELETE'
    });
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
  },

  // NEW: Export quiz
  async exportQuiz(id, format = 'json') {
    const token = getToken();
    window.open(`${API_URL}/quizzes/${id}/export?format=${format}&token=${token}`, '_blank');
  },

  // NEW: Import quiz
  async importQuiz(file, courseId) {
    return await uploadFile(`${API_URL}/quizzes/import`, file, { courseId });
  },

  // NEW: Duplicate quiz
  async duplicateQuiz(id) {
    return await authFetch(`${API_URL}/quizzes/${id}/duplicate`, {
      method: 'POST'
    });
  }
};

// Review APIs
export const reviewAPI = {
  async getCourseReviews(courseId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/reviews/course/${courseId}${query ? `?${query}` : ''}`);
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
    return await authFetch(`${API_URL}/discussions/course/${courseId}${query ? `?${query}` : ''}`);
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
  },

  // NEW: Download certificate as PDF
  async downloadCertificate(id) {
    const token = getToken();
    window.open(`${API_URL}/certificates/${id}/download?token=${token}`, '_blank');
  },

  // NEW: Verify certificate
  async verifyCertificate(certificateCode) {
    return await authFetch(`${API_URL}/certificates/verify/${certificateCode}`);
  }
};

// Notification APIs
export const notificationAPI = {
  async getNotifications(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/notifications${query ? `?${query}` : ''}`);
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
  },

  // NEW: Bulk delete notifications
  async bulkDeleteNotifications(ids) {
    return await authFetch(`${API_URL}/notifications/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  }
};

// Admin APIs
export const adminAPI = {
  async getDashboardStats() {
    return await authFetch(`${API_URL}/admin/stats`);
  },

  async getAllUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/users${query ? `?${query}` : ''}`);
  },

  async createUser(userData) {
    // Admin-specific user creation - doesn't save token
    return await authFetch(`${API_URL}/admin/users`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async getUserAnalytics(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/admin/analytics/users${query ? `?${query}` : ''}`);
  },

  async getCourseAnalytics() {
    return await authFetch(`${API_URL}/admin/analytics/courses`);
  },

  async getRevenueAnalytics() {
    return await authFetch(`${API_URL}/admin/analytics/revenue`);
  },

  // NEW: Bulk operations
  async bulkDeleteUsers(userIds) {
    return await authFetch(`${API_URL}/admin/users/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ userIds })
    });
  },

  async bulkUpdateUsers(userIds, updateData) {
    return await authFetch(`${API_URL}/admin/users/bulk-update`, {
      method: 'PUT',
      body: JSON.stringify({ userIds, updateData })
    });
  },

  async bulkEnrollStudents(courseId, studentIds) {
    return await authFetch(`${API_URL}/admin/courses/${courseId}/bulk-enroll`, {
      method: 'POST',
      body: JSON.stringify({ studentIds })
    });
  },

  async bulkDeleteCourses(courseIds) {
    return await authFetch(`${API_URL}/admin/courses/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ courseIds })
    });
  },

  // NEW: Export operations
  async exportUsers(format = 'csv') {
    const token = getToken();
    window.open(`${API_URL}/admin/export/users?format=${format}&token=${token}`, '_blank');
  },

  async exportCourses(format = 'csv') {
    const token = getToken();
    window.open(`${API_URL}/admin/export/courses?format=${format}&token=${token}`, '_blank');
  },

  async exportAnalytics(format = 'pdf', dateRange = {}) {
    const token = getToken();
    const params = new URLSearchParams({ format, token, ...dateRange });
    window.open(`${API_URL}/admin/export/analytics?${params}`, '_blank');
  },

  // NEW: System health
  async getSystemHealth() {
    return await authFetch(`${API_URL}/admin/system/health`);
  },

  async getSystemLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/admin/system/logs${query ? `?${query}` : ''}`);
  }
};

// NEW: Coupon/Discount APIs (for future monetization)
export const couponAPI = {
  async getAllCoupons(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await authFetch(`${API_URL}/coupons${query ? `?${query}` : ''}`);
  },

  async createCoupon(couponData) {
    return await authFetch(`${API_URL}/coupons`, {
      method: 'POST',
      body: JSON.stringify(couponData)
    });
  },

  async updateCoupon(id, couponData) {
    return await authFetch(`${API_URL}/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData)
    });
  },

  async deleteCoupon(id) {
    return await authFetch(`${API_URL}/coupons/${id}`, {
      method: 'DELETE'
    });
  },

  async validateCoupon(code, courseId) {
    return await authFetch(`${API_URL}/coupons/validate`, {
      method: 'POST',
      body: JSON.stringify({ code, courseId })
    });
  },

  async applyCoupon(code, courseId) {
    return await authFetch(`${API_URL}/coupons/apply`, {
      method: 'POST',
      body: JSON.stringify({ code, courseId })
    });
  }
};

export default {
  auth: authAPI,
  user: userAPI,
  course: courseAPI,
  lesson: lessonAPI,
  progress: progressAPI,
  quiz: quizAPI,
  review: reviewAPI,
  discussion: discussionAPI,
  achievement: achievementAPI,
  certificate: certificateAPI,
  notification: notificationAPI,
  admin: adminAPI,
  coupon: couponAPI
};