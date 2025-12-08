import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Clock, Award, Sparkles, LogOut, Image, Upload } from 'lucide-react';
import './CreateQuiz.css';

const CreateQuiz = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    duration: 30,
    passingScore: 70,
    course: ''
  });
  const [questions, setQuestions] = useState([
    { id: 1, type: 'multiple-choice', question: '', options: ['', '', '', ''], correct: 0, pairs: [], answer: '', imageUrl: '' }
  ]);

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice', icon: '📝' },
    { value: 'true-false', label: 'True/False', icon: '✓✗' },
    { value: 'short-answer', label: 'Short Answer', icon: '✍️' },
    { value: 'fill-blank', label: 'Fill in the Blank', icon: '___' },
    { value: 'matching', label: 'Matching Pairs', icon: '↔️' },
    { value: 'image-based', label: 'Image-based Question', icon: '🖼️' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quiz created:', { ...formData, questions });
    alert('Quiz created successfully! (Demo only)');
    navigate(-1);
  };

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: questions.length + 1, 
      type: 'multiple-choice',
      question: '', 
      options: ['', '', '', ''], 
      correct: 0,
      pairs: [{ left: '', right: '' }, { left: '', right: '' }],
      answer: '',
      imageUrl: ''
    }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addMatchingPair = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, pairs: [...q.pairs, { left: '', right: '' }] };
      }
      return q;
    }));
  };

  const updateMatchingPair = (questionId, pairIndex, side, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newPairs = [...q.pairs];
        newPairs[pairIndex][side] = value;
        return { ...q, pairs: newPairs };
      }
      return q;
    }));
  };

  const removeMatchingPair = (questionId, pairIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.pairs.length > 2) {
        return { ...q, pairs: q.pairs.filter((_, idx) => idx !== pairIndex) };
      }
      return q;
    }));
  };

  const renderQuestionInputs = (question, qIdx) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="options-section">
            <label>Answer Options *</label>
            {question.options.map((option, oIdx) => (
              <div key={oIdx} className="option-field">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correct === oIdx}
                  onChange={() => updateQuestion(question.id, 'correct', oIdx)}
                />
                <input
                  className="input"
                  type="text"
                  placeholder={`Option ${oIdx + 1}`}
                  value={option}
                  onChange={(e) => updateOption(question.id, oIdx, e.target.value)}
                  required
                />
                <span className="correct-label">{question.correct === oIdx && '✓ Correct'}</span>
              </div>
            ))}
            <p className="hint">Select the radio button to mark the correct answer</p>
          </div>
        );

      case 'true-false':
        return (
          <div className="true-false-section">
            <label>Correct Answer *</label>
            <div className="tf-buttons">
              <button
                type="button"
                className={`tf-btn ${question.answer === 'true' ? 'active true' : ''}`}
                onClick={() => updateQuestion(question.id, 'answer', 'true')}
              >
                ✓ True
              </button>
              <button
                type="button"
                className={`tf-btn ${question.answer === 'false' ? 'active false' : ''}`}
                onClick={() => updateQuestion(question.id, 'answer', 'false')}
              >
                ✗ False
              </button>
            </div>
          </div>
        );

      case 'short-answer':
        return (
          <div className="form-field full-width">
            <label>Expected Answer (Optional - for reference)</label>
            <input
              className="input"
              type="text"
              placeholder="Enter the expected answer or keywords..."
              value={question.answer}
              onChange={(e) => updateQuestion(question.id, 'answer', e.target.value)}
            />
            <p className="hint">This will be manually graded. You can provide expected answer for reference.</p>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="form-field full-width">
            <label>Correct Answer *</label>
            <input
              className="input"
              type="text"
              placeholder="Enter the word/phrase that fills the blank"
              value={question.answer}
              onChange={(e) => updateQuestion(question.id, 'answer', e.target.value)}
              required
            />
            <p className="hint">Use _____ in your question to indicate where the blank should be.</p>
          </div>
        );

      case 'matching':
        return (
          <div className="matching-section">
            <label>Matching Pairs *</label>
            {question.pairs.map((pair, pIdx) => (
              <div key={pIdx} className="matching-pair">
                <input
                  className="input"
                  type="text"
                  placeholder={`Left item ${pIdx + 1}`}
                  value={pair.left}
                  onChange={(e) => updateMatchingPair(question.id, pIdx, 'left', e.target.value)}
                  required
                />
                <span className="match-arrow">↔</span>
                <input
                  className="input"
                  type="text"
                  placeholder={`Right match ${pIdx + 1}`}
                  value={pair.right}
                  onChange={(e) => updateMatchingPair(question.id, pIdx, 'right', e.target.value)}
                  required
                />
                {question.pairs.length > 2 && (
                  <button 
                    type="button" 
                    className="btn-icon-small"
                    onClick={() => removeMatchingPair(question.id, pIdx)}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="btn btn-secondary small"
              onClick={() => addMatchingPair(question.id)}
            >
              <Plus size={14} />
              Add Pair
            </button>
            <p className="hint">Students will match items from left column to right column</p>
          </div>
        );

      case 'image-based':
        return (
          <div className="image-section">
            <div className="form-field full-width">
              <label>Image URL *</label>
              <div className="image-upload">
                <input
                  className="input"
                  type="text"
                  placeholder="Paste image URL or upload..."
                  value={question.imageUrl}
                  onChange={(e) => updateQuestion(question.id, 'imageUrl', e.target.value)}
                  required
                />
                <button type="button" className="btn btn-secondary">
                  <Upload size={16} />
                  Upload
                </button>
              </div>
              {question.imageUrl && (
                <div className="image-preview">
                  <img src={question.imageUrl} alt="Question" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            <div className="options-section">
              <label>Answer Options *</label>
              {question.options.map((option, oIdx) => (
                <div key={oIdx} className="option-field">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correct === oIdx}
                    onChange={() => updateQuestion(question.id, 'correct', oIdx)}
                  />
                  <input
                    className="input"
                    type="text"
                    placeholder={`Option ${oIdx + 1}`}
                    value={option}
                    onChange={(e) => updateOption(question.id, oIdx, e.target.value)}
                    required
                  />
                  <span className="correct-label">{question.correct === oIdx && '✓ Correct'}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-quiz-root">
      <div className="dashboard-bg" />

      <header className="dashboard-header glass">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title">
            <h2>Create Quiz</h2>
            <p>Build assessments with AI proctoring</p>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/ai-teacher')}>
            <Sparkles size={16} />
            <span>AI Help</span>
          </button>
          <div className="user-menu glass">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </nav>
      </header>

      <main className="create-quiz-main fade-in">
        <form onSubmit={handleSubmit} className="quiz-form">
          <section className="form-section glass-strong">
            <h3>Quiz Settings</h3>
            <div className="form-grid">
              <div className="form-field full-width">
                <label>Quiz Title *</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g., Machine Learning Fundamentals - Quiz 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  <Clock size={16} />
                  Duration (minutes) *
                </label>
                <input
                  className="input"
                  type="number"
                  min="5"
                  max="180"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  <Award size={16} />
                  Passing Score (%)
                </label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-field full-width">
                <label>Assign to Course</label>
                <select 
                  className="input"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="">Select a course...</option>
                  <option value="1">Machine Learning</option>
                  <option value="2">React Development</option>
                </select>
              </div>
            </div>

            <div className="ai-proctoring-info glass">
              <Sparkles size={20} />
              <div>
                <p className="info-title">AI Proctoring Enabled</p>
                <p className="info-desc">Automatic tab switching detection, time tracking, and behavior monitoring</p>
              </div>
            </div>
          </section>

          <section className="form-section glass-strong">
            <div className="section-header">
              <h3>Questions ({questions.length})</h3>
              <button type="button" className="btn btn-secondary" onClick={addQuestion}>
                <Plus size={16} />
                Add Question
              </button>
            </div>

            <div className="questions-list">
              {questions.map((question, qIdx) => (
                <div key={question.id} className="question-card glass">
                  <div className="question-header">
                    <span className="question-number">Question {qIdx + 1}</span>
                    <div className="question-actions">
                      <select
                        className="type-select"
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                      >
                        {questionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                      {questions.length > 1 && (
                        <button type="button" className="btn-icon-small" onClick={() => removeQuestion(question.id)}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="form-field full-width">
                    <label>Question Text *</label>
                    <textarea
                      className="input textarea"
                      placeholder="Enter your question here..."
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  {renderQuestionInputs(question, qIdx)}
                </div>
              ))}
            </div>
          </section>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Quiz
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateQuiz;