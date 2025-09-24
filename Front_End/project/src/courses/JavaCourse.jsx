import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'Java Fundamentals',
      content: `
        • Introduction to Java
        • Object-Oriented Programming
        • Data Types and Variables
        • Control Flow Statements
        • Methods and Classes
        • Exception Handling
      `
    },
    {
      id: 2,
      title: 'Java Advanced Concepts',
      content: `
        • Collections Framework
        • Generics
        • Multithreading
        • File I/O
        • JDBC
        • Lambda Expressions
      `
    },
    {
      id: 3,
      title: 'Enterprise Java',
      content: `
        • Spring Framework
        • Hibernate ORM
        • RESTful Web Services
        • Microservices
        • Testing with JUnit
        • Build Tools (Maven/Gradle)
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What is the main method signature in Java?',
      options: [
        'public static void main(String[] args)',
        'public void main(String[] args)',
        'public static void main()',
        'void main(String[] args)'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'Which of these is not a Java access modifier?',
      options: [
        'public',
        'private',
        'protected',
        'friend'
      ],
      correct: 3
    },
    {
      id: 3,
      question: 'What is inheritance in Java?',
      options: [
        'A mechanism to reuse code',
        'A way to create objects',
        'A type of variable',
        'A method declaration'
      ],
      correct: 0
    },
    {
      id: 4,
      question: 'Which collection does not allow duplicate elements?',
      options: [
        'ArrayList',
        'LinkedList',
        'HashSet',
        'Vector'
      ],
      correct: 2
    },
    {
      id: 5,
      question: 'What is the purpose of the "final" keyword?',
      options: [
        'To prevent inheritance',
        'To create constants',
        'Both A and B',
        'None of the above'
      ],
      correct: 2
    }
    // Add more quizzes to reach 20
  ]
};

const JavaCourse = () => {
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
    localStorage.setItem(`java_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.java) {
        enrolledCourses.java.progress = score;
        enrolledCourses.java.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.java.lastUpdated = new Date().toISOString();
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
        <h1>Java Programming Course</h1>
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

export default JavaCourse;
