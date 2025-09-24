import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Schedule.css';

const Schedule = () => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const username = localStorage.getItem('name') || 'guest';
  const userEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    if (username !== 'guest' && userEmail) {
      fetchSchedule();
    }
  }, [username, userEmail]);

  const fetchSchedule = async () => {
    try {
      // Replace with actual backend API endpoint for schedule
      const response = await axios.get(`http://127.0.0.1:8000/user/schedule/?email=${userEmail}`);
      if (response.data && response.data.schedule) {
        setScheduleItems(response.data.schedule);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  return (
    <div className="schedule-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>Your Schedule</h2>
      {username === 'guest' ? (
        <p>Please log in to view your schedule.</p>
      ) : scheduleItems.length === 0 ? (
        <p>No scheduled items found.</p>
      ) : (
        <ul className="schedule-list">
          {scheduleItems.map(item => (
            <li key={item.id} className="schedule-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Date: {item.date}</p>
              <p>Time: {item.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Schedule;
