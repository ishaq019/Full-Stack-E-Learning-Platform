import React, { useState, useEffect } from 'react';
import './Certifications.css';
import axios from 'axios';

const Certifications = () => {
  const [eligibleCourses, setEligibleCourses] = useState([]);
  const username = localStorage.getItem('name') || 'guest';
  const userEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    if (username && username !== 'guest' && userEmail) {
      fetchEligibleCourses();
    }
  }, [username, userEmail]);

  const fetchEligibleCourses = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/user/courses/?email=${userEmail}`);
      if (response.data && response.data.courses) {
        const eligible = response.data.courses
          .filter(course => course.progress >= 80)
          .map(course => ({
            id: course.course_id,
            progress: course.progress,
            lastUpdated: course.last_updated,
            status: course.status,
            certificateIssued: course.certificate_issued,
            completionDate: course.completion_date
          }));
        setEligibleCourses(eligible);
      }
    } catch (error) {
      console.error('Error fetching eligible courses:', error);
    }
  };

  const handleGetCertificate = async (courseId) => {
    try {
      if (!userEmail) {
        alert('Please log in to get your certificate.');
        return;
      }
      const response = await axios.post('http://127.0.0.1:8000/certificate/issue/', {
        email: userEmail,
        course_id: courseId
      });
      if (response.data.msg) {
        alert(response.data.msg);
        fetchEligibleCourses(); // Refresh the list to update certificate status
      }
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert('Failed to issue certificate. Please try again later.');
    }
  };

  const formatCourseName = (courseId) => {
    return courseId
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  return (
    <div className="certifications-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>Your Certifications</h2>
      {username === 'guest' ? (
        <p className="no-certificates">Please log in to view your certifications.</p>
      ) : eligibleCourses.length === 0 ? (
        <div className="no-certificates">
          <p>Complete at least 80% of any course to earn a certificate.</p>
          <p className="debug-info">Current user: {username}</p>
        </div>
      ) : (
        <div className="certifications-grid" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
          {eligibleCourses.map((course) => (
            <div key={course.id} className="certificate-card">
              <h3>{formatCourseName(course.id)}</h3>
              <div className="progress-info">
                <p>Completion: {course.progress.toFixed(1)}%</p>
                <p>Status: {course.status}</p>
                {course.certificateIssued && (
                  <p>Certificate Issued on: {new Date(course.completionDate).toLocaleDateString()}</p>
                )}
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
              {!course.certificateIssued && (
                <button 
                  className="get-certificate-btn"
                  onClick={() => handleGetCertificate(course.id)}
                >
                  Get Certificate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certifications;
