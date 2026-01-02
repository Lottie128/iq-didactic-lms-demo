import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Calendar, Clock, Video, MapPin, FileText, Users } from 'lucide-react';
import courseService from '../../services/courseService';
import './ScheduleForm.css';

const ScheduleForm = ({ show, onHide, event, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'live-class',
    courseId: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    meetingLink: '',
    isRecurring: false,
    recurrencePattern: '',
    recurrenceEndDate: '',
    capacity: '',
    notes: ''
  });

  useEffect(() => {
    if (show) {
      fetchCourses();
      if (event) {
        setFormData({
          title: event.title || '',
          description: event.description || '',
          eventType: event.eventType || 'live-class',
          courseId: event.courseId || '',
          startDateTime: event.startDateTime ? formatDateTimeLocal(event.startDateTime) : '',
          endDateTime: event.endDateTime ? formatDateTimeLocal(event.endDateTime) : '',
          location: event.location || '',
          meetingLink: event.meetingLink || '',
          isRecurring: event.isRecurring || false,
          recurrencePattern: event.recurrencePattern || '',
          recurrenceEndDate: event.recurrenceEndDate ? formatDateTimeLocal(event.recurrenceEndDate) : '',
          capacity: event.capacity || '',
          notes: event.notes || ''
        });
      } else {
        resetForm();
      }
    }
  }, [show, event]);

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'live-class',
      courseId: '',
      startDateTime: '',
      endDateTime: '',
      location: '',
      meetingLink: '',
      isRecurring: false,
      recurrencePattern: '',
      recurrenceEndDate: '',
      capacity: '',
      notes: ''
    });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title || !formData.courseId || !formData.startDateTime || !formData.endDateTime) {
      setError('Please fill in all required fields.');
      return;
    }

    const startDate = new Date(formData.startDateTime);
    const endDate = new Date(formData.endDateTime);
    if (startDate >= endDate) {
      setError('End date/time must be after start date/time.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      onHide();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="schedule-form-modal">
      <Modal.Header closeButton className="border-0">
        <Modal.Title>
          <Calendar className="me-2" size={24} />
          {event ? 'Edit Event' : 'Create New Event'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FileText size={16} className="me-2" />
                  Event Title *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to React"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Event Type *</Form.Label>
                <Form.Select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                >
                  <option value="live-class">Live Class</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="office-hours">Office Hours</option>
                  <option value="workshop">Workshop</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Course *</Form.Label>
                <Form.Select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Event description..."
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <Clock size={16} className="me-2" />
                  Start Date & Time *
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <Clock size={16} className="me-2" />
                  End Date & Time *
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <MapPin size={16} className="me-2" />
                  Location
                </Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Room 101 or Physical Address"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <Video size={16} className="me-2" />
                  Meeting Link
                </Form.Label>
                <Form.Control
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/..."
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <Users size={16} className="me-2" />
                  Capacity (Optional)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  placeholder="Maximum attendees"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="isRecurring"
                  label="Recurring Event"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="mt-4"
                />
              </Form.Group>
            </Col>

            {formData.isRecurring && (
              <>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Recurrence Pattern</Form.Label>
                    <Form.Select
                      name="recurrencePattern"
                      value={formData.recurrencePattern}
                      onChange={handleChange}
                    >
                      <option value="">Select pattern</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Recurrence End Date</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="recurrenceEndDate"
                      value={formData.recurrenceEndDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </>
            )}

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Additional Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information..."
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ScheduleForm;