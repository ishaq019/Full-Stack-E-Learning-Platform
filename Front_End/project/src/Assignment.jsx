import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Assignment.css';

const Assignment = () => {
  const [courses, setCourses] = useState([]);
  const username = localStorage.getItem('name') || 'guest';
  const userEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    if (username !== 'guest' && userEmail) {
      fetchAssignments();
    }
  }, [username, userEmail]);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/user/assignments/?email=${userEmail}`);
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  return (
    <div className="assignment-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>Your Assignments</h2>
      {username === 'guest' ? (
        <p>Please log in to view your assignments.</p>
      ) : courses.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        courses.map(course => (
          <div key={course.course_id} className="course-assignments">
            <h3>{course.course_title}</h3>
            <ul className="assignment-list">
              {course.assignments.map(assignment => (
                <li key={assignment.assignment_id} className={`assignment-item status-${assignment.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  <h4>{assignment.title}</h4>
                  <p>{assignment.description}</p>
                  <p>Due Date: {assignment.due_date || 'N/A'}</p>
                  <p>Status: <strong>{assignment.status}</strong></p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Assignment;
3