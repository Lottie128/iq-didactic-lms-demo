import React, { useState } from 'react';
import { Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Clock, MapPin, Video } from 'lucide-react';
import './ScheduleCalendar.css';

const ScheduleCalendar = ({ events, currentMonth, onMonthChange, onEventClick, onEventDelete, canEdit }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  const getEventsForDate = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDateTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'live-class': '#667eea',
      'quiz': '#ffc107',
      'assignment': '#17a2b8',
      'exam': '#dc3545',
      'office-hours': '#28a745',
      'workshop': '#6c757d',
      'other': '#6c757d'
    };
    return colors[type] || '#6c757d';
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((startingDayOfWeek + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - startingDayOfWeek + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const dayEvents = isValidDay ? getEventsForDate(day) : [];
      const isSelected = selectedDate === day;
      const isTodayDate = isValidDay && isToday(day);

      days.push(
        <div
          key={i}
          className={`calendar-day ${
            !isValidDay ? 'empty' : ''
          } ${
            isSelected ? 'selected' : ''
          } ${
            isTodayDate ? 'today' : ''
          }`}
          onClick={() => isValidDay && setSelectedDate(day)}
        >
          {isValidDay && (
            <>
              <div className="day-number">{day}</div>
              <div className="day-events">
                {dayEvents.slice(0, 3).map(event => (
                  <OverlayTrigger
                    key={event.id}
                    placement="top"
                    overlay={
                      <Tooltip>
                        <strong>{event.title}</strong><br />
                        {new Date(event.startDateTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {event.meetingLink && ' 🎥'}
                        {event.location && ' 📍'}
                      </Tooltip>
                    }
                  >
                    <div
                      className="event-dot"
                      style={{ backgroundColor: getEventTypeColor(event.eventType) }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <span className="event-dot-text">{event.title}</span>
                    </div>
                  </OverlayTrigger>
                ))}
                {dayEvents.length > 3 && (
                  <div className="more-events">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="schedule-calendar">
      <div className="calendar-header">
        <div className="month-navigation">
          <Button variant="light" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft size={18} />
          </Button>
          <h4 className="current-month">
            {monthNames[month]} {year}
          </h4>
          <Button variant="light" size="sm" onClick={handleNextMonth}>
            <ChevronRight size={18} />
          </Button>
        </div>
        <Button variant="primary" size="sm" onClick={handleToday}>
          Today
        </Button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="selected-date-events mt-4">
          <h5 className="mb-3">
            Events for {monthNames[month]} {selectedDate}, {year}
          </h5>
          {getEventsForDate(selectedDate).length === 0 ? (
            <p className="text-muted">No events scheduled for this date.</p>
          ) : (
            <div className="event-list">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="event-card" onClick={() => onEventClick(event)}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <Badge bg="primary" className="mb-2">
                        {event.eventType.replace('-', ' ')}
                      </Badge>
                      <h6 className="mb-1">{event.title}</h6>
                      <p className="text-muted mb-2 small">{event.course?.title}</p>
                      <div className="event-details">
                        <small className="text-muted me-3">
                          <Clock size={14} className="me-1" />
                          {new Date(event.startDateTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {' - '}
                          {new Date(event.endDateTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                        {event.meetingLink && (
                          <small className="text-muted me-3">
                            <Video size={14} className="me-1" />
                            Online
                          </small>
                        )}
                        {event.location && (
                          <small className="text-muted">
                            <MapPin size={14} className="me-1" />
                            {event.location}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;