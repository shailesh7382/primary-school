import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './Exam.css';

function Exam() {
  return (
    <div className="exam-module">
      <Routes>
        <Route path="/" element={<ExamList />} />
        <Route path="/take/:examId" element={<TakeExam />} />
        <Route path="/result/:examId" element={<ExamResult />} />
      </Routes>
    </div>
  );
}

function ExamList() {
  const navigate = useNavigate();
  
  const exams = [
    { id: 1, title: 'Class 1 - Maths Basic', questions: 10, duration: '15 min', subject: 'Maths' },
    { id: 2, title: 'Class 1 - Science Basic', questions: 10, duration: '15 min', subject: 'Science' },
    { id: 3, title: 'Class 2 - Maths Mid-term', questions: 15, duration: '20 min', subject: 'Maths' },
    { id: 4, title: 'Class 3 - Science Final', questions: 20, duration: '30 min', subject: 'Science' },
    { id: 5, title: 'Class 4 - Maths Advanced', questions: 25, duration: '35 min', subject: 'Maths' },
    { id: 6, title: 'Class 5 - Combined Test', questions: 30, duration: '45 min', subject: 'Both' },
  ];
  
  return (
    <div className="exam-list">
      <h2>📝 Available Exams</h2>
      <p className="subtitle">Select an exam to begin</p>
      
      <div className="exams-grid">
        {exams.map(exam => (
          <div key={exam.id} className="exam-card">
            <div className="exam-header">
              <h3>{exam.title}</h3>
              <span className={`subject-badge ${exam.subject.toLowerCase()}`}>
                {exam.subject}
              </span>
            </div>
            <div className="exam-details">
              <div className="detail-item">
                <span>📋 Questions:</span>
                <strong>{exam.questions}</strong>
              </div>
              <div className="detail-item">
                <span>⏱️ Duration:</span>
                <strong>{exam.duration}</strong>
              </div>
            </div>
            <button 
              className="start-exam-btn"
              onClick={() => navigate(`/exam/take/${exam.id}`)}
            >
              Start Exam
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TakeExam() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  
  const questions = [
    {
      question: 'What is 5 + 3?',
      options: ['6', '7', '8', '9'],
      correct: 2
    },
    {
      question: 'What is 10 - 4?',
      options: ['4', '5', '6', '7'],
      correct: 2
    },
    {
      question: 'How many sides does a triangle have?',
      options: ['2', '3', '4', '5'],
      correct: 1
    },
  ];
  
  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = () => {
    const examId = window.location.pathname.split('/').pop();
    // Save answers to localStorage for demo
    localStorage.setItem(`exam_${examId}`, JSON.stringify(answers));
    navigate(`/exam/result/${examId}`);
  };
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <div className="take-exam">
      <div className="exam-header-bar">
        <h2>📝 Exam in Progress</h2>
        <div className="timer">
          ⏱️ Time Left: {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>
      
      <div className="question-container">
        <div className="question-number">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        
        <h3 className="question-text">{questions[currentQuestion].question}</h3>
        
        <div className="options-list">
          {questions[currentQuestion].options.map((option, idx) => (
            <div 
              key={idx}
              className={`option ${answers[currentQuestion] === idx ? 'selected' : ''}`}
              onClick={() => handleAnswer(idx)}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>
        
        <div className="navigation-buttons">
          <button 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            className="nav-btn"
          >
            ← Previous
          </button>
          
          {currentQuestion < questions.length - 1 ? (
            <button onClick={handleNext} className="nav-btn primary">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} className="nav-btn submit">
              Submit Exam
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ExamResult() {
  const navigate = useNavigate();
  const examId = window.location.pathname.split('/').pop();
  
  // Mock result calculation
  const score = 75;
  const totalQuestions = 10;
  const correctAnswers = 8;
  
  return (
    <div className="exam-result">
      <div className="result-card">
        <div className="result-header">
          <h2>🎉 Exam Completed!</h2>
        </div>
        
        <div className="score-circle">
          <div className="score-value">{score}%</div>
          <div className="score-label">Your Score</div>
        </div>
        
        <div className="result-details">
          <div className="detail-row">
            <span>Correct Answers:</span>
            <strong>{correctAnswers} / {totalQuestions}</strong>
          </div>
          <div className="detail-row">
            <span>Percentage:</span>
            <strong>{score}%</strong>
          </div>
          <div className="detail-row">
            <span>Grade:</span>
            <strong className="grade-badge">B+</strong>
          </div>
        </div>
        
        <div className="result-actions">
          <button 
            className="action-btn primary"
            onClick={() => navigate('/exam')}
          >
            Take Another Exam
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/student-records')}
          >
            View All Records
          </button>
        </div>
      </div>
    </div>
  );
}

export default Exam;
