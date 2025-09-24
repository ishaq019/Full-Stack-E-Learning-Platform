import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'DevOps Fundamentals',
      content: `
        • Introduction to DevOps
        • DevOps Culture and Practices
        • Continuous Integration (CI)
        • Continuous Deployment (CD)
        • Infrastructure as Code
        • Version Control with Git
      `
    },
    {
      id: 2,
      title: 'DevOps Tools',
      content: `
        • Docker and Containerization
        • Kubernetes Orchestration
        • Jenkins Pipeline
        • Ansible Automation
        • Terraform Infrastructure
        • Monitoring Tools
      `
    },
    {
      id: 3,
      title: 'Advanced DevOps',
      content: `
        • Cloud DevOps Practices
        • Security in DevOps (DevSecOps)
        • Microservices Architecture
        • Site Reliability Engineering
        • Performance Optimization
        • DevOps Metrics and KPIs
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What is DevOps?',
      options: [
        'A set of practices combining software development and IT operations',
        'A programming language',
        'A database system',
        'A web framework'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'What is Continuous Integration?',
      options: [
        'Continuously working without breaks',
        'Automatically building and testing code changes',
        'Continuous server maintenance',
        'Integration testing only'
      ],
      correct: 1
    },
    {
      id: 3,
      question: 'What is Docker used for?',
      options: [
        'Database management',
        'Web development',
        'Containerization',
        'Network security'
      ],
      correct: 2
    },
    {
      id: 4,
      question: 'What is Kubernetes?',
      options: [
        'A programming language',
        'A container orchestration platform',
        'A database system',
        'A web server'
      ],
      correct: 1
    },
    {
      id: 5,
      question: 'What is Infrastructure as Code?',
      options: [
        'Writing code in infrastructure',
        'Managing infrastructure through code and automation',
        'Infrastructure documentation',
        'Code deployment'
      ],
      correct: 1
    }
    // Add more quizzes to reach 20
  ]
};

const DevOpsCourse = () => {
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
    localStorage.setItem(`devops_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.devops) {
        enrolledCourses.devops.progress = score;
        enrolledCourses.devops.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.devops.lastUpdated = new Date().toISOString();
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
        <h1>DevOps Course</h1>
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

export default DevOpsCourse;
