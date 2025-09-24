import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TakeQuiz.css';

const TakeQuiz = ({ courseId, onQuizSubmit }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const username = localStorage.getItem('name') || 'guest';
  const userEmail = localStorage.getItem('email') || '';

  useEffect(() => {
    if (username !== 'guest' && userEmail && courseId) {
      fetchQuizzes();
    }
  }, [username, userEmail, courseId]);

  const fetchQuizzes = async () => {
    try {
      // Get quizzes for all courses (since we don't have course-specific quizzes yet)
      const response = await axios.get('http://127.0.0.1:8000/courses/');
      if (response.data && response.data.courses) {
        // Create sample quizzes based on available courses
        const sampleQuizzes = response.data.courses.slice(0, 3).map((course) => ({
          id: course.id,
          title: `${course.title} Quiz`,
          course_id: course.id,
          questions: [
            {
              id: 1,
              question: `What is the main focus of ${course.title}?`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct_answer: 'Option A'
            },
            {
              id: 2,
              question: `Which skill is most important for ${course.title}?`,
              options: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'],
              correct_answer: 'Skill 2'
            }
          ],
          passing_score: 70,
          time_limit: 30
        }));
        setQuizzes(sampleQuizzes);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizzes.forEach(quiz => {
      // Check if the answer matches the correct answer for this quiz's questions
      const quizAnswer = quizAnswers[quiz.id];
      const correctAnswerIndex = quiz.questions[0]?.correct_answer === 'Option A' ? 0 :
                                 quiz.questions[0]?.correct_answer === 'Option B' ? 1 :
                                 quiz.questions[0]?.correct_answer === 'Option C' ? 2 : 3;
      if (parseInt(quizAnswer) === correctAnswerIndex) {
        correct++;
      }
    });
    const calculatedScore = ((correct / quizzes.length) * 100).toFixed(2);
    setScore(calculatedScore);
    submitQuizResults();
  };

  const submitQuizResults = async () => {
    try {
      setSubmissionStatus('Submitting...');
      // Assuming quiz_id is the id of the first quiz or course quiz id, adjust as needed
      const quizId = quizzes.length > 0 ? quizzes[0].quiz_id || quizzes[0].id : null;
      if (!quizId) {
        setSubmissionStatus('Failed: Quiz ID not found');
        return;
      }
      const timeTaken = 0; // You can calculate time taken if needed
      const response = await axios.post('http://127.0.0.1:8000/submit_quiz/', {
        email: userEmail,
        quiz_id: quizId,
        answers: quizAnswers,
        time_taken: timeTaken
      });
      if (response.data && response.data.msg) {
        setSubmissionStatus('Submission successful: ' + response.data.msg);
        if (onQuizSubmit) {
          onQuizSubmit(); // Notify parent to refresh data
        }
      } else {
        setSubmissionStatus('Submission completed');
        if (onQuizSubmit) {
          onQuizSubmit();
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setSubmissionStatus('Submission failed: ' + (error.response?.data?.err || error.message));
    }
  };

  if (username === 'guest') {
    return <p>Please log in to take the quiz.</p>;
  }

  if (quizzes.length === 0) {
    return <p>Loading quizzes...</p>;
  }

  if (score !== null) {
    return (
      <div className="quiz-score" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
        <h2>Your Score: {score}%</h2>
        {submissionStatus && <p>{submissionStatus}</p>}
        <button onClick={() => {
          setScore(null);
          setCurrentQuestionIndex(0);
          setQuizAnswers({});
          setSubmissionStatus(null);
        }}>Retake Quiz</button>
      </div>
    );
  }

  const currentQuiz = quizzes[currentQuestionIndex];

  return (
    <div className="take-quiz-container" style={{ maxWidth: '100vw', width: '100vw', padding: '0 20px' }}>
      <h2>Quiz for Course {courseId}</h2>
      <div className="quiz-question">
        <h3>Question {currentQuestionIndex + 1} of {quizzes.length}</h3>
        <p>{currentQuiz.question}</p>
        <div className="quiz-options">
          {currentQuiz.options.map((option, idx) => (
            <label key={idx} className="quiz-option">
              <input
                type="radio"
                name={`question-${currentQuiz.id}`}
                value={idx}
                checked={quizAnswers[currentQuiz.id] === idx}
                onChange={() => handleAnswer(currentQuiz.id, idx)}
              />
              {option}
            </label>
          ))}
        </div>
        <button onClick={handleNext} disabled={quizAnswers[currentQuiz.id] === undefined}>
          {currentQuestionIndex === quizzes.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default TakeQuiz;
