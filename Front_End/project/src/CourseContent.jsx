import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseContent.css';

const courseList = [
  {
    id: 'webdev',
    title: 'Web Development',
    description: 'Learn HTML, CSS, JavaScript, and modern web development practices',
    duration: '12 weeks',
    icon: '🌐'
  },
  {
    id: 'reactjs',
    title: 'ReactJS',
    description: 'Master React.js including hooks, context, and state management',
    duration: '8 weeks',
    icon: '⚛️'
  },
  {
    id: 'expressjs',
    title: 'ExpressJS',
    description: 'Build robust backend services with Express.js and Node.js',
    duration: '6 weeks',
    icon: '🚀'
  },
  {
    id: 'django',
    title: 'Django',
    description: 'Create powerful web applications with Python and Django',
    duration: '10 weeks',
    icon: '🐍'
  },
  {
    id: 'java',
    title: 'Java',
    description: 'Learn core Java programming and enterprise development',
    duration: '14 weeks',
    icon: '☕'
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Master Python programming from basics to advanced concepts',
    duration: '10 weeks',
    icon: '🐍'
  },
  {
    id: 'aws',
    title: 'AWS',
    description: 'Cloud computing and deployment with Amazon Web Services',
    duration: '8 weeks',
    icon: '☁️'
  },
  {
    id: 'ai',
    title: 'AI',
    description: 'Artificial Intelligence fundamentals and applications',
    duration: '12 weeks',
    icon: '🤖'
  },
  {
    id: 'genai',
    title: 'Generative AI',
    description: 'Learn about LLMs, diffusion models, and AI content generation',
    duration: '8 weeks',
    icon: '🎨'
  },
  {
    id: 'devops',
    title: 'DevOps',
    description: 'Master CI/CD, containerization, and deployment automation',
    duration: '10 weeks',
    icon: '⚙️'
  },
];

const CourseContent = () => {
  const [enrolledCourses, setEnrolledCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('name') || 'guest';
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setLoading(true);
      const storedData = localStorage.getItem(`enrolled_${username}`);
      if (storedData) {
        setEnrolledCourses(JSON.parse(storedData));
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load enrolled courses. Please try again.');
      setLoading(false);
    }
  }, [username]);

  const handleOpenCourse = (courseId) => {
    navigate(`/react/${courseId}`);
  };

  return (
    <div className="course-content-container">
      <h2>Your Enrolled Courses</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : (
        <div className="courses-grid">
          {Object.keys(enrolledCourses).length === 0 ? (
            <p>You have not enrolled in any courses yet.</p>
          ) : (
            Object.keys(enrolledCourses).map(courseId => {
              const course = courseList.find(c => c.id === courseId);
              const enrollment = enrolledCourses[courseId];
              if (!course) return null;
              return (
                <div key={courseId} className="course-card">
                  <div className="course-icon">{course.icon}</div>
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <p className="course-duration">Duration: {course.duration}</p>
                  <p className="course-status">Status: {enrollment.status}</p>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{enrollment.progress || 0}%</span>
                  </div>
                  <button 
                    className="open-course-button"
                    onClick={() => handleOpenCourse(courseId)}
                  >
                    Open Course
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CourseContent;
