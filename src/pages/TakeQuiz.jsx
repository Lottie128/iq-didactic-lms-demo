import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Clock, CheckCircle, XCircle, AlertCircle, Sparkles, LogOut } from 'lucide-react';
import './TakeQuiz.css';

const TakeQuiz = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [aiMonitoring, setAiMonitoring] = useState(true);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const quiz = {
    title: 'Machine Learning Fundamentals - Quiz 1',
    duration: 30,
    totalQuestions: 5,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: 'What is the primary goal of supervised learning?',
        options: [
          'To find hidden patterns in unlabeled data',
          'To learn from labeled training data to make predictions',
          'To maximize rewards through trial and error',
          'To reduce dimensionality of data'
        ],
        correct: 1
      },
      {
        id: 2,
        question: 'Which algorithm is commonly used for classification tasks?',
        options: [
          'K-Means',
          'Linear Regression',
          'Random Forest',
          'PCA'
        ],
        correct: 2
      },
      {
        id: 3,
        question: 'What does overfitting mean in machine learning?',
        options: [
          'Model performs well on training data but poorly on new data',
          'Model performs poorly on all data',
          'Model is too simple to capture patterns',
          'Model takes too long to train'
        ],
        correct: 0
      },
      {
        id: 4,
        question: 'What is the purpose of cross-validation?',
        options: [
          'To speed up training',
          'To evaluate model performance on different subsets of data',
          'To increase dataset size',
          'To remove outliers'
        ],
        correct: 1
      },
      {
        id: 5,
        question: 'Which metric is best for imbalanced classification problems?',
        options: [
          'Accuracy',
          'Mean Squared Error',
          'F1-Score',
          'R-Squared'
        ],
        correct: 2
      }
    ]
  };

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submitted) {
        setTabSwitches(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = () => {
    const correctAnswers = quiz.questions.filter(
      (q, idx) => answers[q.id] === q.correct
    ).length;
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore({ correct: correctAnswers, total: quiz.questions.length, percentage });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="quiz-root">
        <div className="dashboard-bg" />
        <header className="dashboard-header glass">
          <div className="header-left">
            <button className="btn-icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div className="header-title">
              <h2>Quiz Results</h2>
              <p>{quiz.title}</p>
            </div>
          </div>
          <nav className="header-nav">
            <div className="user-menu glass">
              <div className="user-avatar">{user.name.charAt(0)}</div>
              <span>{user.name}</span>
            </div>
            <button className="btn btn-secondary" onClick={onLogout}>
              <LogOut size={16} />
            </button>
          </nav>
        </header>

        <main className="quiz-main fade-in">
          <div className="results-container glass-strong">
            <div className="results-header">
              {score.percentage >= quiz.passingScore ? (
                <CheckCircle size={64} color="#4ade80" />
              ) : (
                <XCircle size={64} color="#f87171" />
              )}
              <h1>{score.percentage}%</h1>
              <p>{score.percentage >= quiz.passingScore ? 'Congratulations! You passed!' : 'Keep practicing!'}</p>
            </div>

            <div className="results-stats">
              <div className="result-stat glass">
                <p className="stat-value">{score.correct}/{score.total}</p>
                <p className="stat-label">Correct Answers</p>
              </div>
              <div className="result-stat glass">
                <p className="stat-value">{formatTime(1800 - timeLeft)}</p>
                <p className="stat-label">Time Taken</p>
              </div>
              <div className="result-stat glass">
                <p className="stat-value">{tabSwitches}</p>
                <p className="stat-label">Tab Switches</p>
              </div>
            </div>

            <div className="ai-monitoring-result glass">
              <Sparkles size={20} />
              <div>
                <p className="monitor-title">AI Proctoring Summary</p>
                <p className="monitor-desc">
                  {tabSwitches === 0 
                    ? 'No suspicious activity detected. Great focus!'
                    : `${tabSwitches} tab switch(es) detected during the exam.`}
                </p>
              </div>
            </div>

            <div className="results-actions">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                Back to Course
              </button>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                Retake Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="quiz-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>{quiz.title}</h2>
            <p>Question {currentQuestion + 1} of {quiz.totalQuestions}</p>
          </div>
        </div>
        <nav className="header-nav">
          <div className="timer glass">
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="quiz-main fade-in">
        {aiMonitoring && (
          <div className="ai-monitoring glass">
            <div className="ai-indicator">
              <Sparkles size={16} />
              <span>AI Proctoring Active</span>
            </div>
            {tabSwitches > 0 && (
              <div className="warning">
                <AlertCircle size={16} />
                <span>{tabSwitches} tab switch(es) detected</span>
              </div>
            )}
          </div>
        )}

        <div className="quiz-container glass-strong">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          <div className="question-container">
            <h3>Question {currentQuestion + 1}</h3>
            <p className="question-text">{quiz.questions[currentQuestion].question}</p>

            <div className="options-list">
              {quiz.questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  className={`option-btn glass ${
                    answers[quiz.questions[currentQuestion].id] === idx ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswer(quiz.questions[currentQuestion].id, idx)}
                >
                  <div className="option-radio">
                    {answers[quiz.questions[currentQuestion].id] === idx && (
                      <div className="radio-dot" />
                    )}
                  </div>
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== quiz.questions.length}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TakeQuiz;