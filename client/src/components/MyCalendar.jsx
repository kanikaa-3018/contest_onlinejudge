import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaCode, FaTrophy } from 'react-icons/fa'; // Import icons

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // Fetch both upcoming and recent contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch('https://codeforces.com/api/contest.list');
        const data = await res.json();

        const contests = data.result
          .filter(contest => contest.phase === 'BEFORE' || contest.phase === 'FINISHED')
          .slice(0, 30) // Get recent + upcoming
          .map(contest => ({
            title: contest.name,
            start: new Date(contest.startTimeSeconds * 1000),
            end: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
            site: 'codeforces',
            status: contest.phase === 'BEFORE' ? 'upcoming' : 'past',
          }));

        setEvents(contests);
      } catch (err) {
        console.error('Failed to fetch contests:', err);
      }
    };

    fetchContests();
  }, []);

  
  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = moment.utc(event.start).startOf('day').format('YYYY-MM-DD');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  // Custom date cell with dot and tooltip
  const CustomDateCell = ({ value, children }) => {
    const key = moment.utc(value).startOf('day').format('YYYY-MM-DD');
    const dayEvents = eventsByDate[key] || [];

    return (
      <div style={{ position: 'relative', height: '100%' }}>
        {children}
        {dayEvents.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 2,
            right: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 2,
          }}>
            {dayEvents.map((event, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: event.status === 'upcoming' ? 'rgba(99, 255, 184, 0.8)' : 'rgba(253,253,253,0.7)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                }} />
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#F0ECE5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px', // Reduced font size for contest name
                  whiteSpace: 'nowrap',
                  visibility: 'hidden',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(4px)', 
                }}
                  className="tooltip-box"
                >
                  {/* Add icon before the contest name */}
                  {event.site === 'codeforces' ? <FaCode className="inline mr-2" /> : <FaTrophy className="inline mr-2" />}
                  {event.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Different styles for past and upcoming events
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.status === 'upcoming' ? '#9f00ff' : '#777', 
      color: '#F0ECE5',
      borderRadius: '6px',
      padding: '4px',
      fontSize: '0.75em', 
      // fontWeight: 'medium',
      textAlign: 'center',
      cursor: 'pointer',
      backdropFilter: 'blur(4px)', 
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)', 
    },
  });

  // Tooltip handlers
  useEffect(() => {
    const boxes = document.querySelectorAll('.tooltip-box');
    boxes.forEach(box => {
      const parent = box.parentElement;
      if (parent) {
        parent.addEventListener('mouseenter', () => {
          box.style.visibility = 'visible';
          box.style.opacity = 1;
        });
        parent.addEventListener('mouseleave', () => {
          box.style.visibility = 'hidden';
          box.style.opacity = 0;
        });
      }
    });
  }, [events]);

  // Navigation
  const handleToday = () => setDate(new Date());
  const handleNext = () => setDate(moment(date).add(1, view).toDate());
  const handleBack = () => setDate(moment(date).subtract(1, view).toDate());

  return (
    <div style={{ height: 540, maxWidth: 1000, margin: '0 auto', paddingTop: 20 }}>
      {/* Month Name */}
      <h2 style={{
        textAlign: 'center',
        color: '#F0ECE5',
        marginBottom: '12px',
        fontSize: '20px', 
        fontWeight: '500',
      }}>
        {moment(date).format('MMMM YYYY')}
      </h2>

      {/* Controls */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <button onClick={handleBack} style={btnStyle}>← Back</button>
        <button onClick={handleToday} style={btnStyle}>Today</button>
        <button onClick={handleNext} style={btnStyle}>Next →</button>
        {['month', 'week', 'day', 'agenda'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              ...btnStyle,
              backgroundColor: view === v ? '#222831' : '#31304D',
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)} View
          </button>
        ))}
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}
        views={['month', 'week', 'day', 'agenda']}
        components={{ dateCellWrapper: CustomDateCell }}
        eventPropGetter={eventStyleGetter}
        style={{
          height: '100%',
          border: '1px solid #666', 
          borderRadius: '10px',
          backgroundColor: '#1E1E2E',
          color: '#F0ECE5',
        }}
        toolbar={false}
      />
    </div>
  );
};

const btnStyle = {
  margin: '0 5px',
  padding: '6px 12px',
  backgroundColor: '#31304D',
  color: '#F0ECE5',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default MyCalendar;
