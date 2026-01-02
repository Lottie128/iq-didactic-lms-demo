import React, { useState } from 'react';
import { Card, Badge, Button, Dropdown } from 'react-bootstrap';
import { Clock, MapPin, Video, MoreVertical, Edit, Trash2, ExternalLink } from 'lucide-react';
import './ScheduleList.css';

const ScheduleList = ({ events, onEventClick, onEventDelete, canEdit }) => {
  const [sortBy, setSortBy] = useState('date');

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

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'info',
      'in-progress': 'warning',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.startDateTime) - new Date(b.startDateTime);
    } else if (sortBy === 'type') {
      return a.eventType.localeCompare(b.eventType);
    } else if (sortBy === 'course') {
      return (a.course?.title || '').localeCompare(b.course?.title || '');
    }
    return 0;
  });

  const groupEventsByDate = (events) => {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.startDateTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate(sortedEvents);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start, end) => {
    const duration = (new Date(end) - new Date(start)) / (1000 * 60);
    if (duration < 60) {
      return `${duration} min`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <div className="schedule-list">
      <div className="list-header">
        <h5>All Events ({events.length})</h5>
        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" size="sm">
            Sort by: {sortBy === 'date' ? 'Date' : sortBy === 'type' ? 'Type' : 'Course'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSortBy('date')}>Date</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy('type')}>Type</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortBy('course')}>Course</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {Object.keys(groupedEvents).length === 0 ? (
        <div className="text-center py-5 text-muted">
          <Clock size={48} className="mb-3 opacity-25" />
          <p>No events scheduled</p>
        </div>
      ) : (
        Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="date-group">
            <h6 className="date-header">{date}</h6>
            <div className="events-container">
              {dateEvents.map(event => (
                <Card key={event.id} className="event-card-list">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <Badge bg={getEventTypeColor(event.eventType)}>
                            {event.eventType.replace('-', ' ')}
                          </Badge>
                          <Badge bg={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <h5 className="event-title mb-2">{event.title}</h5>
                        {event.description && (
                          <p className="text-muted mb-2 small">{event.description}</p>
                        )}
                        <div className="event-meta">
                          <span className="meta-item">
                            <Clock size={14} className="me-1" />
                            {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}
                            <span className="text-muted ms-2">({formatDuration(event.startDateTime, event.endDateTime)})</span>
                          </span>
                          {event.course && (
                            <span className="meta-item">
                              📚 {event.course.title}
                            </span>
                          )}
                          {event.instructor && (
                            <span className="meta-item">
                              👤 {event.instructor.name}
                            </span>
                          )}
                        </div>
                        <div className="event-location mt-2">
                          {event.meetingLink && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 me-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(event.meetingLink, '_blank');
                              }}
                            >
                              <Video size={14} className="me-1" />
                              Join Meeting
                              <ExternalLink size={12} className="ms-1" />
                            </Button>
                          )}
                          {event.location && (
                            <span className="text-muted small">
                              <MapPin size={14} className="me-1" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      {canEdit && (
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="link"
                            className="text-muted p-0"
                            style={{ boxShadow: 'none' }}
                          >
                            <MoreVertical size={20} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => onEventClick(event)}>
                              <Edit size={14} className="me-2" />
                              Edit Event
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => onEventDelete(event.id)}
                              className="text-danger"
                            >
                              <Trash2 size={14} className="me-2" />
                              Delete Event
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduleList;