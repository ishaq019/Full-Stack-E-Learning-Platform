import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'HTML Fundamentals',
      content: `
        • Introduction to HTML5
        • Document Structure
        • Elements and Attributes
        • Semantic HTML
        • Forms and Validation
        • HTML Best Practices
      `
    },
    {
      id: 2,
      title: 'CSS Styling',
      content: `
        • CSS Selectors
        • Box Model
        • Flexbox Layout
        • Grid System
        • Responsive Design
        • CSS Animations
      `
    },
    {
      id: 3,
      title: 'JavaScript Basics',
      content: `
        • Variables and Data Types
        • Control Flow
        • Functions and Scope
        • DOM Manipulation
        • Event Handling
        • Async Programming
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Hybrid Text Making Language',
        'Hyper Transfer Markup Language'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'Which CSS property is used to control the spacing between elements?',
      options: ['spacing', 'margin', 'padding', 'gap'],
      correct: 1
    },
    {
      id: 3,
      question: 'What is the correct way to declare a JavaScript variable?',
      options: ['variable x;', 'var x;', 'v x;', 'x = var;'],
      correct: 1
    },
    // Add more quizzes to reach 20
    {
      id: 4,
      question: 'Which HTML tag is used for creating a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correct: 1
    },
    {
      id: 5,
      question: 'What is the purpose of CSS flexbox?',
      options: [
        'To create flexible layouts',
        'To style text',
        'To handle form submissions',
        'To create animations'
      ],
      correct: 0
    }
    // ... Add 15 more quizzes
  ]
};

const WebDevCourse = () => {
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
    localStorage.setItem(`webdev_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.webdev) {
        enrolledCourses.webdev.progress = score;
        enrolledCourses.webdev.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.webdev.lastUpdated = new Date().toISOString();
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
        <h1>Web Development Course</h1>
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

export default WebDevCourse;
