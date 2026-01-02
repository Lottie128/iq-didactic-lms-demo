import { courseAPI } from './api';

// Course Service - Wrapper around courseAPI for easier component imports
class CourseService {
  // Get all courses
  async getAllCourses(params = {}) {
    try {
      const response = await courseAPI.getAllCourses(params);
      return response.data || response;
    } catch (error) {
      console.error('Get all courses error:', error);
      throw error;
    }
  }

  // Get course by ID
  async getCourseById(id) {
    try {
      const response = await courseAPI.getCourseById(id);
      return response.data || response;
    } catch (error) {
      console.error('Get course by ID error:', error);
      throw error;
    }
  }

  // Create course
  async createCourse(courseData) {
    try {
      const response = await courseAPI.createCourse(courseData);
      return response.data || response;
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  }

  // Update course
  async updateCourse(id, courseData) {
    try {
      const response = await courseAPI.updateCourse(id, courseData);
      return response.data || response;
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  }

  // Delete course
  async deleteCourse(id) {
    try {
      const response = await courseAPI.deleteCourse(id);
      return response.data || response;
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  }

  // Enroll in course
  async enrollCourse(id) {
    try {
      const response = await courseAPI.enrollCourse(id);
      return response.data || response;
    } catch (error) {
      console.error('Enroll course error:', error);
      throw error;
    }
  }

  // Get enrolled courses
  async getEnrolledCourses() {
    try {
      const response = await courseAPI.getEnrolledCourses();
      return response.data || response;
    } catch (error) {
      console.error('Get enrolled courses error:', error);
      throw error;
    }
  }

  // Get instructor courses (my courses)
  async getMyCourses() {
    try {
      const response = await courseAPI.getMyCourses();
      return response.data || response;
    } catch (error) {
      console.error('Get my courses error:', error);
      throw error;
    }
  }

  // Upload thumbnail
  async uploadThumbnail(courseId, file) {
    try {
      const response = await courseAPI.uploadThumbnail(courseId, file);
      return response.data || response;
    } catch (error) {
      console.error('Upload thumbnail error:', error);
      throw error;
    }
  }

  // Get preview content
  async getPreviewContent(id) {
    try {
      const response = await courseAPI.getPreviewContent(id);
      return response.data || response;
    } catch (error) {
      console.error('Get preview content error:', error);
      throw error;
    }
  }

  // Duplicate course
  async duplicateCourse(id) {
    try {
      const response = await courseAPI.duplicateCourse(id);
      return response.data || response;
    } catch (error) {
      console.error('Duplicate course error:', error);
      throw error;
    }
  }
}

export default new CourseService();