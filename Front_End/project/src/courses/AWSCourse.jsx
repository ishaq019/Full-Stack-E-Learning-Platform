import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'AWS Fundamentals',
      content: `
        • Introduction to Cloud Computing
        • AWS Global Infrastructure
        • AWS Management Console
        • Identity and Access Management (IAM)
        • Security Best Practices
        • AWS Pricing Models
      `
    },
    {
      id: 2,
      title: 'Core AWS Services',
      content: `
        • Amazon EC2 (Elastic Compute Cloud)
        • Amazon S3 (Simple Storage Service)
        • Amazon RDS (Relational Database Service)
        • Amazon VPC (Virtual Private Cloud)
        • AWS Lambda
        • Amazon CloudWatch
      `
    },
    {
      id: 3,
      title: 'Advanced AWS Concepts',
      content: `
        • High Availability and Scalability
        • Serverless Architecture
        • Container Services (ECS/EKS)
        • DevOps on AWS
        • Cloud Security
        • Cost Optimization
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What is AWS?',
      options: [
        'Amazon Web Services - Cloud Computing Platform',
        'Advanced Web System',
        'Automated Web Server',
        'Application Web Service'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'What is Amazon EC2?',
      options: [
        'Email Client',
        'Elastic Compute Cloud',
        'Electronic Commerce',
        'External Computing'
      ],
      correct: 1
    },
    {
      id: 3,
      question: 'What is the purpose of AWS IAM?',
      options: [
        'Internet Access Management',
        'Identity and Access Management',
        'Internal Asset Management',
        'Infrastructure Automation Management'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'What type of storage service is Amazon S3?',
      options: [
        'Object Storage',
        'File Storage',
        'Block Storage',
        'Cache Storage'
      ],
      correct: 0
    },
    {
      id: 5,
      question: 'What is AWS Lambda?',
      options: [
        'Database Service',
        'Storage Service',
        'Serverless Computing Service',
        'Networking Service'
      ],
      correct: 2
    }
    // Add more quizzes to reach 20
  ]
};

const AWSCourse = () => {
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
    localStorage.setItem(`aws_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.aws) {
        enrolledCourses.aws.progress = score;
        enrolledCourses.aws.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.aws.lastUpdated = new Date().toISOString();
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
        <h1>AWS Cloud Computing Course</h1>
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

export default AWSCourse;
