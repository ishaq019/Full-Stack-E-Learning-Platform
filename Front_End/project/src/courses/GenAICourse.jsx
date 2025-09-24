import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CourseContent.css';

const courseData = {
  materials: [
    {
      id: 1,
      title: 'Generative AI Fundamentals',
      content: `
        • Introduction to Generative AI
        • Types of Generative Models
        • Large Language Models (LLMs)
        • Diffusion Models
        • GANs (Generative Adversarial Networks)
        • Transformer Architecture
      `
    },
    {
      id: 2,
      title: 'Generative AI Applications',
      content: `
        • Text Generation
        • Image Generation
        • Code Generation
        • Audio Synthesis
        • Video Generation
        • Creative Applications
      `
    },
    {
      id: 3,
      title: 'Advanced GenAI Topics',
      content: `
        • Prompt Engineering
        • Fine-tuning Models
        • Ethical Considerations
        • Model Evaluation
        • Deployment Strategies
        • Future Trends
      `
    }
  ],
  quizzes: [
    {
      id: 1,
      question: 'What is Generative AI?',
      options: [
        'AI systems that can create new content',
        'AI systems that only analyze data',
        'A type of computer hardware',
        'A programming language'
      ],
      correct: 0
    },
    {
      id: 2,
      question: 'What are Large Language Models (LLMs)?',
      options: [
        'Models trained on large text datasets to understand and generate human language',
        'Large computer screens',
        'Programming languages',
        'Database systems'
      ],
      correct: 0
    },
    {
      id: 3,
      question: 'What is a GAN?',
      options: [
        'General Access Network',
        'Generative Adversarial Network',
        'Global AI Network',
        'Graphical Analysis Node'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'What is prompt engineering?',
      options: [
        'Writing computer programs',
        'Designing hardware components',
        'Crafting effective inputs for AI models',
        'Network engineering'
      ],
      correct: 2
    },
    {
      id: 5,
      question: 'What are diffusion models used for?',
      options: [
        'Network traffic management',
        'Image generation and editing',
        'Database optimization',
        'Web development'
      ],
      correct: 1
    }
    // Add more quizzes to reach 20
  ]
};

const GenAICourse = () => {
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
    localStorage.setItem(`genai_progress_${username}`, JSON.stringify(score));
    
    // Update enrolled courses progress
    const storedData = localStorage.getItem(`enrolled_${username}`);
    if (storedData) {
      const enrolledCourses = JSON.parse(storedData);
      if (enrolledCourses.genai) {
        enrolledCourses.genai.progress = score;
        enrolledCourses.genai.status = score === 100 ? 'Completed' : 'In Progress';
        enrolledCourses.genai.lastUpdated = new Date().toISOString();
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
        <h1>Generative AI Course</h1>
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

export default GenAICourse;
