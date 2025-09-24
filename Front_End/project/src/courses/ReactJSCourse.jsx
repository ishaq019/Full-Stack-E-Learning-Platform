import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'React Fundamentals',
      content: `
        • Introduction to React
        • JSX and Components
        • Props and State
        • Component Lifecycle
        • React Hooks
        • Virtual DOM
      `
    },
    {
      id: 2,
      title: 'State Management',
      content: `
        • useState Hook
        • useEffect Hook
        • Context API
        • Redux Basics
        • Redux Toolkit
        • State Management Patterns
      `
    },
    {
      id: 3,
      title: 'Advanced React',
      content: `
        • Performance Optimization
        • Custom Hooks
        • Error Boundaries
        • React Router
        • Code Splitting
        • Server-Side Rendering
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What hook is used for side effects in React?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      correct: 1
    },
    {
      id: 2,
      question: 'What is JSX?',
      options: [
        'JavaScript XML - A syntax extension for JavaScript',
        'Java Syntax Extension',
        'JavaScript Extra Features',
        'JavaScript Execute'
      ],
      correct: 0
    },
    {
      id: 3,
      question: 'Which method is used to change state in React?',
      options: ['this.state()', 'setState()', 'changeState()', 'updateState()'],
      correct: 1
    },
    {
      id: 4,
      question: 'What is the virtual DOM?',
      options: [
        'A lightweight copy of the actual DOM',
        'A new browser feature',
        'A JavaScript library',
        'A CSS framework'
      ],
      correct: 0
    },
    {
      id: 5,
      question: 'What is a React component?',
      options: [
        'A reusable piece of UI',
        'A JavaScript function',
        'A CSS class',
        'A HTML element'
      ],
      correct: 0
    }
    // Add 15 more quizzes following the same pattern
  ]
};

const ReactJSCourse = () => {
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
    localStorage.setItem(`reactjs_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.reactjs) {
        enrolledCourses.reactjs.progress = score;
        enrolledCourses.reactjs.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.reactjs.lastUpdated = new Date().toISOString();
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
        <h1>React.js Course</h1>
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

export default ReactJSCourse;
