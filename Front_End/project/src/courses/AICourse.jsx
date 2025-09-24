import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'AI Fundamentals',
      content: `
        • Introduction to Artificial Intelligence
        • Machine Learning Basics
        • Neural Networks
        • Deep Learning Concepts
        • Supervised Learning
        • Unsupervised Learning
      `
    },
    {
      id: 2,
      title: 'AI Tools and Frameworks',
      content: `
        • Python for AI
        • TensorFlow
        • PyTorch
        • Scikit-learn
        • Keras
        • Data Preprocessing
      `
    },
    {
      id: 3,
      title: 'Advanced AI Applications',
      content: `
        • Computer Vision
        • Natural Language Processing
        • Reinforcement Learning
        • AI Ethics and Bias
        • Model Deployment
        • AI in Production
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What is Artificial Intelligence?',
      options: [
        'The simulation of human intelligence by machines',
        'A type of computer hardware',
        'A programming language',
        'A database system'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'What is Machine Learning?',
      options: [
        'A subset of AI that enables systems to learn from data',
        'A type of computer memory',
        'A hardware component',
        'A networking protocol'
      ],
      correct: 0
    },
    {
      id: 3,
      question: 'What is a Neural Network?',
      options: [
        'A computer network topology',
        'A biological network',
        'A mathematical model inspired by biological neural networks',
        'A type of database'
      ],
      correct: 2
    },
    {
      id: 4,
      question: 'What is Deep Learning?',
      options: [
        'Learning while sleeping',
        'A subset of machine learning using neural networks with multiple layers',
        'A database structure',
        'A programming paradigm'
      ],
      correct: 1
    },
    {
      id: 5,
      question: 'What is TensorFlow?',
      options: [
        'A machine learning framework',
        'A type of tensor',
        'A mathematical concept',
        'A hardware component'
      ],
      correct: 0
    }
    // Add more quizzes to reach 20
  ]
};

const AICourse = () => {
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
    localStorage.setItem(`ai_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.ai) {
        enrolledCourses.ai.progress = score;
        enrolledCourses.ai.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.ai.lastUpdated = new Date().toISOString();
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
        <h1>Artificial Intelligence Course</h1>
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

export default AICourse;
