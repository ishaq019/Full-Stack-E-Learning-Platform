import React, { useState, useEffect } from 'react';
import './Courses.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Courses = () => {
  const [courseList, setCourseList] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email') || '';
  const username = localStorage.getItem('name') || 'guest';

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
      localStorage.setItem(`enrolled_${username}`, JSON.stringify(userCoursesData));
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load enrolled courses. Please try again.');
        console.error('Error fetching user courses:', err);
      }
    } finally {
      setLoading(false);
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
        localStorage.setItem(`enrolled_${username}`, JSON.stringify(updated));
        alert('Successfully enrolled in the course!');
      }
    } catch (err) {
      setError('Failed to enroll in the course. Please try again.');
      console.error('Error enrolling in course:', err);
    }
  };

  const updateProgress = async (courseId, newProgress) => {
    try {
      if (!userEmail || !enrolledCourses[courseId]) return;

      const response = await axios.put('http://127.0.0.1:8000/courses/progress/', {
        email: userEmail,
        course_id: courseId,
        progress: newProgress
      });

      if (response.status === 200) {
        const updated = {
          ...enrolledCourses,
          [courseId]: {
            ...enrolledCourses[courseId],
            progress: newProgress,
            status: newProgress === 100 ? 'Completed' : 'In Progress',
            lastUpdated: new Date().toISOString()
          }
        };
        setEnrolledCourses(updated);
        localStorage.setItem(`enrolled_${username}`, JSON.stringify(updated));
      }
    } catch (err) {
      setError('Failed to update progress. Please try again.');
      console.error('Error updating progress:', err);
    }
  };

  const getStatus = (courseId) => {
    return enrolledCourses[courseId]?.status || 'Not Enrolled';
  };

  const getProgress = (courseId) => {
    return enrolledCourses[courseId]?.progress || 0;
  };

  const handleOpenCourse = (courseId) => {
    navigate(`/react/${courseId}`);
  };

  return (
    <div className="courses-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>Available Courses</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <>
          <div className="courses-grid">
            {courseList.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-icon">{course.icon}</div>
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <p className="course-duration">Duration: {course.duration}</p>
                
                {getStatus(course.id) !== 'Not Enrolled' && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${getProgress(course.id)}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{getProgress(course.id)}%</span>
                  </div>
                )}

                <p className={`status ${getStatus(course.id).toLowerCase().replace(' ', '-')}`}>
                  {getStatus(course.id)}
                </p>

                {getStatus(course.id) === 'Not Enrolled' ? (
                  <button 
                    className="enroll-button"
                    onClick={() => enroll(course.id)}
                  >
                    Enroll Now
                  </button>
                ) : (
                  <>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={getProgress(course.id)}
                      onChange={(e) => updateProgress(course.id, parseInt(e.target.value))}
                      className="progress-slider"
                    />
                    <button
                      className="open-course-button"
                      onClick={() => handleOpenCourse(course.id)}
                    >
                      Open Course
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;
