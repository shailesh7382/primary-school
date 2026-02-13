import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const MathsScience = lazy(() => import('mathsScience/MathsScience'));
const Exam = lazy(() => import('exam/Exam'));
const StudentRecords = lazy(() => import('studentRecords/StudentRecords'));

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>🏫 Primary School Education System</h1>
          <p className="subtitle">Classes 1 to 5 - Maths & Science Learning Platform</p>
        </header>
        
        <nav className="nav-bar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/maths-science" className="nav-link">Maths & Science</Link>
          <Link to="/exam" className="nav-link">Exams</Link>
          <Link to="/student-records" className="nav-link">Student Records</Link>
        </nav>

        <main className="main-content">
          <Suspense fallback={<div className="loading">Loading module...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/maths-science/*" element={<MathsScience />} />
              <Route path="/exam/*" element={<Exam />} />
              <Route path="/student-records/*" element={<StudentRecords />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="app-footer">
          <p>© 2024 Primary School Education System | Microfrontend Architecture</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="home">
      <div className="welcome-card">
        <h2>Welcome to Primary School Education System</h2>
        <p>An innovative microfrontend platform for classes 1 to 5</p>
        
        <div className="features">
          <div className="feature-card">
            <h3>📚 Maths & Science</h3>
            <p>Interactive lessons and exercises for all classes</p>
          </div>
          <div className="feature-card">
            <h3>📝 Exams</h3>
            <p>Online tests and assessments</p>
          </div>
          <div className="feature-card">
            <h3>📊 Student Records</h3>
            <p>Track progress and scores</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
