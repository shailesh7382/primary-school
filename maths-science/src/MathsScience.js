import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './MathsScience.css';

function MathsScience() {
  return (
    <div className="maths-science">
      <Routes>
        <Route path="/" element={<SubjectSelection />} />
        <Route path="/maths/:classNum" element={<MathsLessons />} />
        <Route path="/science/:classNum" element={<ScienceLessons />} />
      </Routes>
    </div>
  );
}

function SubjectSelection() {
  return (
    <div className="subject-selection">
      <h2>📚 Maths & Science Learning</h2>
      <p>Choose your subject and class</p>
      
      <div className="subject-grid">
        <div className="subject-section">
          <h3>🔢 Mathematics</h3>
          <div className="class-buttons">
            {[1, 2, 3, 4, 5].map(classNum => (
              <Link key={classNum} to={`/maths-science/maths/${classNum}`} className="class-btn">
                Class {classNum}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="subject-section">
          <h3>🔬 Science</h3>
          <div className="class-buttons">
            {[1, 2, 3, 4, 5].map(classNum => (
              <Link key={classNum} to={`/maths-science/science/${classNum}`} className="class-btn">
                Class {classNum}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MathsLessons() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const navigate = useNavigate();
  
  const topics = {
    1: ['Numbers 1-100', 'Addition', 'Subtraction', 'Shapes'],
    2: ['Numbers 1-1000', 'Multiplication Tables', 'Division', 'Time'],
    3: ['Numbers 1-10000', 'Fractions', 'Measurement', 'Money'],
    4: ['Large Numbers', 'Decimals', 'Geometry', 'Area & Perimeter'],
    5: ['Advanced Operations', 'Advanced Fractions', 'Advanced Geometry', 'Data Handling']
  };
  
  const classNum = parseInt(window.location.pathname.split('/').pop());
  const classTopics = topics[classNum] || topics[1];
  
  return (
    <div className="lessons-container">
      <button onClick={() => navigate('/maths-science')} className="back-btn">← Back</button>
      <h2>🔢 Mathematics - Class {classNum}</h2>
      
      <div className="topics-grid">
        {classTopics.map((topic, idx) => (
          <div 
            key={idx} 
            className={`topic-card ${selectedTopic === topic ? 'selected' : ''}`}
            onClick={() => setSelectedTopic(topic)}
          >
            <h4>{topic}</h4>
            <p>Click to learn more</p>
          </div>
        ))}
      </div>
      
      {selectedTopic && (
        <div className="lesson-content">
          <h3>📖 Lesson: {selectedTopic}</h3>
          <div className="lesson-details">
            <p>This is an interactive lesson about <strong>{selectedTopic}</strong>.</p>
            <p>In a full implementation, this would include:</p>
            <ul>
              <li>Video tutorials</li>
              <li>Interactive exercises</li>
              <li>Practice problems</li>
              <li>Quizzes and assessments</li>
            </ul>
            <button className="practice-btn">Start Practice ✏️</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScienceLessons() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const navigate = useNavigate();
  
  const topics = {
    1: ['Plants', 'Animals', 'Human Body', 'Weather'],
    2: ['Living Things', 'Food & Health', 'Materials', 'Water'],
    3: ['Plant Life', 'Animal Life', 'Forces', 'Light & Sound'],
    4: ['Ecosystems', 'Matter', 'Energy', 'Earth & Space'],
    5: ['Advanced Biology', 'Chemistry Basics', 'Physics Basics', 'Environment']
  };
  
  const classNum = parseInt(window.location.pathname.split('/').pop());
  const classTopics = topics[classNum] || topics[1];
  
  return (
    <div className="lessons-container">
      <button onClick={() => navigate('/maths-science')} className="back-btn">← Back</button>
      <h2>🔬 Science - Class {classNum}</h2>
      
      <div className="topics-grid">
        {classTopics.map((topic, idx) => (
          <div 
            key={idx} 
            className={`topic-card ${selectedTopic === topic ? 'selected' : ''}`}
            onClick={() => setSelectedTopic(topic)}
          >
            <h4>{topic}</h4>
            <p>Click to learn more</p>
          </div>
        ))}
      </div>
      
      {selectedTopic && (
        <div className="lesson-content">
          <h3>📖 Lesson: {selectedTopic}</h3>
          <div className="lesson-details">
            <p>This is an interactive lesson about <strong>{selectedTopic}</strong>.</p>
            <p>In a full implementation, this would include:</p>
            <ul>
              <li>Animated explanations</li>
              <li>Interactive simulations</li>
              <li>Experiments and activities</li>
              <li>Assessment questions</li>
            </ul>
            <button className="practice-btn">Start Learning 🚀</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MathsScience;
