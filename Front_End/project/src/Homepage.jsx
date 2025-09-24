import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Homepage.css';

const Homepage = () => {
  const [courseList, setCourseList] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('name') || 'guest';
  const userEmail = localStorage.getItem('email') || '';
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    if (userEmail) {
      fetchUserCourses();
    }
  }, [userEmail]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/courses/');
      setCourseList(response.data.courses);
    } catch (err) {
      setError('Failed to load courses. Please try again.');
      console.error('Error fetching courses:', err);
    }
  };

  const fetchUserCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/user/courses/?email=${userEmail}`);
      const userCoursesData = {};
      response.data.courses.forEach(course => {
        userCoursesData[course.course_id] = {
          status: course.status,
          progress: course.progress,
          enrolledDate: course.enrolled_date,
          lastUpdated: course.last_updated,
          quizScores: course.quiz_scores
        };
      });
      setEnrolledCourses(userCoursesData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load enrolled courses. Please try again.');
      setLoading(false);
      console.error('Error fetching user courses:', err);
    }
  };

  const enroll = async (courseId) => {
    try {
      if (!userEmail || username === 'guest') {
        alert('Please login to enroll in courses');
        return;
      }

      if (enrolledCourses[courseId]) {
        alert(`You are already enrolled in ${courseList.find(c => c.id === courseId)?.title}`);
        return;
      }

      const response = await axios.post('http://127.0.0.1:8000/courses/enroll/', {
        email: userEmail,
        course_id: courseId
      });

      if (response.status === 200) {
        // Update local state
        const updated = {
          ...enrolledCourses,
          [courseId]: {
            status: 'Enrolled',
            progress: 0,
            enrolledDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            quizScores: []
          }
        };
        setEnrolledCourses(updated);
        alert('Successfully enrolled in the course!');
      }
    } catch (err) {
      setError('Failed to enroll in the course. Please try again.');
      console.error('Error enrolling in course:', err);
    }
  };

  const getStatus = (courseId) => {
    return enrolledCourses[courseId]?.status || 'Not Enrolled';
  };

  return (
    <div className="homepage-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <header className="homepage-header">
        <h1>E-learning platform</h1>
        <p>Engage with interactive courses, track your progress, and earn certificates.</p>
        <button className="homepage-button" onClick={() => navigate('/react/courses')}>
          Explore Courses
        </button>
      </header>
      <section className="courses-section">
        <h2>E-learning courses</h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Loading courses...</div>
        ) : (
          <div className="courses-grid">
            {courseList.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-icon">{course.icon}</div>
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <p className="course-duration">Duration: {course.duration}</p>
                <p className={`status ${getStatus(course.id).toLowerCase().replace(' ', '-')}`}>
                  {getStatus(course.id)}
                </p>
                {getStatus(course.id) === 'Not Enrolled' && (
                  <button 
                    className="enroll-button"
                    onClick={() => enroll(course.id)}
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Homepage;
