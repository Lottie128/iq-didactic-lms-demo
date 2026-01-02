import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge, Spinner, Alert } from 'react-bootstrap';
import { Calendar, Clock, Video, MapPin, Users, Plus, Filter } from 'lucide-react';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import ScheduleList from '../components/schedule/ScheduleList';
import ScheduleForm from '../components/schedule/ScheduleForm';
import scheduleService from '../services/scheduleService';
import { useAuth } from '../context/AuthContext';
import './Schedule.css';

const Schedule = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('calendar');
  const [schedules, setSchedules] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchSchedules();
    fetchUpcomingEvents();
  }, [currentMonth, filterType]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const data = await scheduleService.getSchedulesByMonth(year, month);
      
      let filtered = data;
      if (filterType !== 'all') {
        filtered = data.filter(s => s.eventType === filterType);
      }
      
      setSchedules(filtered);
      setError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const data = await scheduleService.getUpcomingSchedules(5);
      setUpcomingEvents(data);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await scheduleService.deleteSchedule(eventId);
        fetchSchedules();
        fetchUpcomingEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedEvent) {
        await scheduleService.updateSchedule(selectedEvent.id, formData);
      } else {
        await scheduleService.createSchedule(formData);
      }
      setShowForm(false);
      fetchSchedules();
      fetchUpcomingEvents();
    } catch (err) {
      console.error('Error saving event:', err);
      throw err;
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'live-class': 'primary',
      'quiz': 'warning',
      'assignment': 'info',
      'exam': 'danger',
      'office-hours': 'success',
      'workshop': 'secondary',
      'other': 'dark'
    };
    return colors[type] || 'secondary';
  };

  const eventTypeOptions = [
    { value: 'all', label: 'All Events', icon: Calendar },
    { value: 'live-class', label: 'Live Classes', icon: Video },
    { value: 'quiz', label: 'Quizzes', icon: Clock },
    { value: 'assignment', label: 'Assignments', icon: Clock },
    { value: 'exam', label: 'Exams', icon: Clock },
    { value: 'office-hours', label: 'Office Hours', icon: Users },
    { value: 'workshop', label: 'Workshops', icon: MapPin }
  ];

  const canCreateEvents = user?.role === 'teacher' || user?.role === 'admin';

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <Container fluid>
          <Row className="align-items-center mb-4">
            <Col md={6}>
              <h1 className="page-title">
                <Calendar className="me-2" size={32} />
                My Schedule
              </h1>
              <p className="text-muted mb-0">Manage your classes, events, and deadlines</p>
            </Col>
            <Col md={6} className="text-md-end">
              {canCreateEvents && (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleCreateEvent}
                  className="create-event-btn"
                >
                  <Plus size={20} className="me-2" />
                  Create Event
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid>
        <Row>
          {/* Sidebar - Upcoming Events */}
          <Col lg={3} className="mb-4">
            <Card className="upcoming-card">
              <Card.Header className="bg-transparent border-bottom">
                <h5 className="mb-0">
                  <Clock size={18} className="me-2" />
                  Upcoming Events
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <Calendar size={48} className="mb-3 opacity-25" />
                    <p className="mb-0">No upcoming events</p>
                  </div>
                ) : (
                  <div className="upcoming-list">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="upcoming-item">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <Badge bg={getEventTypeColor(event.eventType)} className="mb-2">
                            {event.eventType.replace('-', ' ')}
                          </Badge>
                          <small className="text-muted">
                            {new Date(event.startDateTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </small>
                        </div>
                        <h6 className="mb-1">{event.title}</h6>
                        <small className="text-muted d-block mb-2">
                          <Clock size={12} className="me-1" />
                          {new Date(event.startDateTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                        <small className="text-muted">{event.course?.title}</small>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Event Type Filter */}
            <Card className="mt-3 filter-card">
              <Card.Header className="bg-transparent border-bottom">
                <h6 className="mb-0">
                  <Filter size={16} className="me-2" />
                  Filter by Type
                </h6>
              </Card.Header>
              <Card.Body className="p-2">
                {eventTypeOptions.map(option => (
                  <div
                    key={option.value}
                    className={`filter-option ${filterType === option.value ? 'active' : ''}`}
                    onClick={() => setFilterType(option.value)}
                  >
                    <option.icon size={16} className="me-2" />
                    {option.label}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            <Card className="schedule-card">
              <Card.Header className="bg-transparent border-bottom">
                <Nav variant="tabs" activeKey={activeView} onSelect={setActiveView}>
                  <Nav.Item>
                    <Nav.Link eventKey="calendar">
                      <Calendar size={16} className="me-2" />
                      Calendar View
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="list">
                      <Clock size={16} className="me-2" />
                      List View
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading schedule...</p>
                  </div>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : (
                  <>
                    {activeView === 'calendar' ? (
                      <ScheduleCalendar
                        events={schedules}
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                        onEventClick={handleEditEvent}
                        onEventDelete={handleDeleteEvent}
                        canEdit={canCreateEvents}
                      />
                    ) : (
                      <ScheduleList
                        events={schedules}
                        onEventClick={handleEditEvent}
                        onEventDelete={handleDeleteEvent}
                        canEdit={canCreateEvents}
                      />
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Event Form Modal */}
      <ScheduleForm
        show={showForm}
        onHide={() => setShowForm(false)}
        event={selectedEvent}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Schedule;