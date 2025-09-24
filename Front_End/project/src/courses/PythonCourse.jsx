import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'Python Basics',
      content: `
        • Introduction to Python
        • Data Types and Variables
        • Control Flow (if/else, loops)
        • Functions and Modules
        • Lists, Tuples, and Dictionaries
        • File Handling
      `
    },
    {
      id: 2,
      title: 'Advanced Python',
      content: `
        • Object-Oriented Programming
        • Exception Handling
        • Regular Expressions
        • Decorators and Generators
        • Context Managers
        • Unit Testing
      `
    },
    {
      id: 3,
      title: 'Python Libraries and Frameworks',
      content: `
        • NumPy and Pandas
        • Data Visualization with Matplotlib
        • Web Scraping with BeautifulSoup
        • API Development with Flask
        • Database Integration
        • Virtual Environments
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What is Python?',
      options: [
        'A high-level programming language',
        'A database system',
        'A web browser',
        'An operating system'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'Which of these is not a Python data type?',
      options: [
        'List',
        'Dictionary',
        'Array',
        'Tuple'
      ],
      correct: 2
    },
    {
      id: 3,
      question: 'What is the correct way to create a function in Python?',
      options: [
        'function myFunction():',
        'def myFunction():',
        'create myFunction():',
        'new myFunction():'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'What does pip stand for in Python?',
      options: [
        'Pip Installs Packages',
        'Python Installation Program',
        'Package Installation Process',
        'Preferred Installer Program'
      ],
      correct: 3
    },
    {
      id: 5,
      question: 'Which of these is used for comments in Python?',
      options: [
        '//',
        '/* */',
        '#',
        '--'
      ],
      correct: 2
    }
    // Add more quizzes to reach 20
  ]
};

const PythonCourse = () => {
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
    localStorage.setItem(`python_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.python) {
        enrolledCourses.python.progress = score;
        enrolledCourses.python.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.python.lastUpdated = new Date().toISOString();
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
        <h1>Python Programming Course</h1>
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

export default PythonCourse;
