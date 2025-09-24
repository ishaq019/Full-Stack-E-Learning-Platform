import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'Django Fundamentals',
      content: `
        • Introduction to Django
        • MVT Architecture
        • URL Routing
        • Views and Templates
        • Models and ORM
        • Forms and Validation
      `
    },
    {
      id: 2,
      title: 'Django Advanced Features',
      content: `
        • Authentication and Authorization
        • Class-Based Views
        • REST Framework
        • Database Management
        • Caching Strategies
        • Security Features
      `
    },
    {
      id: 3,
      title: 'Django Best Practices',
      content: `
        • Project Structure
        • Testing Django Applications
        • Performance Optimization
        • Deployment Strategies
        • Django Admin Customization
        • Third-party Integrations
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What is Django?',
      options: [
        'A high-level Python web framework',
        'A JavaScript library',
        'A database system',
        'A frontend framework'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'What does MVT stand for in Django?',
      options: [
        'Model View Template',
        'Modern View Technology',
        'Multiple Virtual Tables',
        'Minimal Viable Test'
      ],
      correct: 0
    },
    {
      id: 3,
      question: 'Which command creates a new Django project?',
      options: [
        'django startproject',
        'django-admin startproject',
        'python manage.py startproject',
        'django new project'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'What is Django ORM?',
      options: [
        'Object-Relational Mapping',
        'Online Resource Management',
        'Optimized Runtime Module',
        'Output Response Monitor'
      ],
      correct: 0
    },
    {
      id: 5,
      question: 'Which file contains URL patterns in Django?',
      options: [
        'urls.py',
        'routes.py',
        'paths.py',
        'views.py'
      ],
      correct: 0
    }
    // Add more quizzes to reach 20
  ]
};

const DjangoCourse = () => {
  const [activeSection, setActiveSection] = useState('materials');
  const [quizAnswers, setQuizAnswers] = useState({});
  const navigate = useNavigate();
  const username = localStorage.getItem('name') || 'guest';

  useEffect(() => {
    // Progress is handled via localStorage directly
  }, [username]);

  const handleQuizAnswer = (quizId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [quizId]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    Object.entries(quizAnswers).forEach(([id, answer]) => {
      const quiz = courseData.quizzes.find(q => q.id === parseInt(id));
      if (quiz && quiz.correct === answer) {
        correct++;
      }
    });
    return (correct / courseData.quizzes.length) * 100;
  };

  const handleComplete = () => {
    const score = calculateScore();
    localStorage.setItem(`django_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.django) {
        enrolledCourses.django.progress = score;
        enrolledCourses.django.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.django.lastUpdated = new Date().toISOString();
        localStorage.setItem(`enrolled_${username}`, JSON.stringify(enrolledCourses));
      }
    }

    alert(`Your score: ${score.toFixed(2)}%`);
    navigate('/CourseContent');
  };

  return (
    <div className="course-view-fullscreen">
      <div className="course-header">
        <button className="back-button" onClick={() => navigate('/CourseContent')}>
          Back to Courses
        </button>
        <h1>Django Course</h1>
      </div>

      <div className="content-nav">
        <button
          className={`nav-button ${activeSection === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveSection('materials')}
        >
          Course Materials
        </button>
        <button
          className={`nav-button ${activeSection === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveSection('quizzes')}
        >
          Quizzes
        </button>
      </div>

      <div className="content-section">
        {activeSection === 'materials' ? (
          <div className="materials">
            {courseData.materials.map(material => (
              <div key={material.id} className="material-card">
                <h3>{material.title}</h3>
                <pre>{material.content}</pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="quizzes">
            {courseData.quizzes.map(quiz => (
              <div key={quiz.id} className="quiz-card">
                <h3>Question {quiz.id}</h3>
                <p>{quiz.question}</p>
                <div className="options">
                  {quiz.options.map((option, idx) => (
                    <label key={idx} className="option">
                      <input
                        type="radio"
                        name={`quiz-${quiz.id}`}
                        value={idx}
                        checked={quizAnswers[quiz.id] === idx}
                        onChange={() => handleQuizAnswer(quiz.id, idx)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button className="complete-button" onClick={handleComplete}>
              Complete Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DjangoCourse;
