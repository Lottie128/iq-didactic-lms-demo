import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ScheduleService {
  // Get auth header
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all schedules for logged-in user
  async getUserSchedules() {
    try {
      const response = await axios.get(`${API_URL}/schedules`, {
        headers: this.getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error('Get user schedules error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get schedules by month
  async getSchedulesByMonth(year, month) {
    try {
      const response = await axios.get(`${API_URL}/schedules/month/${year}/${month}`, {
        headers: this.getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error('Get schedules by month error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get schedules by date range
  async getSchedulesByDateRange(startDate, endDate) {
    try {
      const response = await axios.get(`${API_URL}/schedules/date-range`, {
        params: { startDate, endDate },
        headers: this.getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error('Get schedules by date range error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get schedules for a specific course
  async getCourseSchedules(courseId) {
    try {
      const response = await axios.get(`${API_URL}/schedules/course/${courseId}`, {
        headers: this.getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error('Get course schedules error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get upcoming schedules
  async getUpcomingSchedules(limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/schedules/upcoming`, {
        params: { limit },
        headers: this.getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error('Get upcoming schedules error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get single schedule by ID
  async getScheduleById(id) {
    try {
      const response = await axios.get(`${API_URL}/schedules/${id}`, {
        headers: this.getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error('Get schedule by ID error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create new schedule
  async createSchedule(scheduleData) {
    try {
      const response = await axios.post(`${API_URL}/schedules`, scheduleData, {
        headers: this.getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error('Create schedule error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Update schedule
  async updateSchedule(id, scheduleData) {
    try {
      const response = await axios.put(`${API_URL}/schedules/${id}`, scheduleData, {
        headers: this.getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error('Update schedule error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Delete schedule
  async deleteSchedule(id) {
    try {
      const response = await axios.delete(`${API_URL}/schedules/${id}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Delete schedule error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new ScheduleService();