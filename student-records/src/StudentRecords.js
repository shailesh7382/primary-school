import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './StudentRecords.css';

function StudentRecords() {
  return (
    <div className="student-records">
      <Routes>
        <Route path="/" element={<RecordsList />} />
        <Route path="/student/:studentId" element={<StudentDetail />} />
      </Routes>
    </div>
  );
}

function RecordsList() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('all');
  
  const students = [
    { id: 1, name: 'Alice Johnson', class: 1, mathsAvg: 85, scienceAvg: 90, examsCompleted: 5 },
    { id: 2, name: 'Bob Smith', class: 1, mathsAvg: 78, scienceAvg: 82, examsCompleted: 5 },
    { id: 3, name: 'Charlie Brown', class: 2, mathsAvg: 92, scienceAvg: 88, examsCompleted: 6 },
    { id: 4, name: 'Diana Prince', class: 2, mathsAvg: 88, scienceAvg: 91, examsCompleted: 6 },
    { id: 5, name: 'Ethan Hunt', class: 3, mathsAvg: 95, scienceAvg: 93, examsCompleted: 7 },
    { id: 6, name: 'Fiona Apple', class: 3, mathsAvg: 87, scienceAvg: 89, examsCompleted: 7 },
    { id: 7, name: 'George Miller', class: 4, mathsAvg: 90, scienceAvg: 92, examsCompleted: 8 },
    { id: 8, name: 'Hannah Montana', class: 4, mathsAvg: 84, scienceAvg: 86, examsCompleted: 8 },
    { id: 9, name: 'Ivan Drago', class: 5, mathsAvg: 91, scienceAvg: 94, examsCompleted: 9 },
    { id: 10, name: 'Julia Roberts', class: 5, mathsAvg: 96, scienceAvg: 95, examsCompleted: 9 },
  ];
  
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.class === parseInt(selectedClass));
  
  const getGrade = (avg) => {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  };
  
  return (
    <div className="records-list">
      <div className="records-header">
        <h2>📊 Student Records</h2>
        <div className="filter-section">
          <label>Filter by Class:</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="class-filter"
          >
            <option value="all">All Classes</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>Class {num}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{filteredStudents.length}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.round(filteredStudents.reduce((acc, s) => acc + s.mathsAvg, 0) / filteredStudents.length)}%
          </div>
          <div className="stat-label">Avg Maths Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.round(filteredStudents.reduce((acc, s) => acc + s.scienceAvg, 0) / filteredStudents.length)}%
          </div>
          <div className="stat-label">Avg Science Score</div>
        </div>
      </div>
      
      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class</th>
              <th>Maths Average</th>
              <th>Science Average</th>
              <th>Overall Grade</th>
              <th>Exams Completed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => {
              const overallAvg = (student.mathsAvg + student.scienceAvg) / 2;
              const grade = getGrade(overallAvg);
              return (
                <tr key={student.id}>
                  <td className="student-name">{student.name}</td>
                  <td>Class {student.class}</td>
                  <td>
                    <span className={`score-badge ${student.mathsAvg >= 80 ? 'good' : 'average'}`}>
                      {student.mathsAvg}%
                    </span>
                  </td>
                  <td>
                    <span className={`score-badge ${student.scienceAvg >= 80 ? 'good' : 'average'}`}>
                      {student.scienceAvg}%
                    </span>
                  </td>
                  <td>
                    <span className={`grade-badge grade-${grade}`}>{grade}</span>
                  </td>
                  <td>{student.examsCompleted}</td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/student-records/student/${student.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentDetail() {
  const navigate = useNavigate();
  const studentId = parseInt(window.location.pathname.split('/').pop());
  
  // Mock student data
  const student = {
    id: studentId,
    name: 'Alice Johnson',
    class: 1,
    rollNumber: 'STD001',
    email: 'alice@primaryschool.edu',
  };
  
  const examHistory = [
    { id: 1, subject: 'Maths', date: '2024-01-15', score: 85, maxScore: 100, grade: 'B+' },
    { id: 2, subject: 'Science', date: '2024-01-18', score: 90, maxScore: 100, grade: 'A-' },
    { id: 3, subject: 'Maths', date: '2024-02-01', score: 88, maxScore: 100, grade: 'B+' },
    { id: 4, subject: 'Science', date: '2024-02-05', score: 92, maxScore: 100, grade: 'A' },
    { id: 5, subject: 'Combined', date: '2024-02-15', score: 87, maxScore: 100, grade: 'B+' },
  ];
  
  const overallStats = {
    mathsAvg: 85,
    scienceAvg: 90,
    totalExams: 5,
    attendance: 95,
  };
  
  return (
    <div className="student-detail">
      <button onClick={() => navigate('/student-records')} className="back-btn">
        ← Back to Records
      </button>
      
      <div className="student-header">
        <div className="student-avatar">
          {student.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="student-info">
          <h2>{student.name}</h2>
          <p>Class {student.class} • Roll No: {student.rollNumber}</p>
          <p>{student.email}</p>
        </div>
      </div>
      
      <div className="detail-stats">
        <div className="detail-stat-card">
          <div className="stat-icon">🔢</div>
          <div className="stat-content">
            <div className="stat-value">{overallStats.mathsAvg}%</div>
            <div className="stat-label">Maths Average</div>
          </div>
        </div>
        <div className="detail-stat-card">
          <div className="stat-icon">🔬</div>
          <div className="stat-content">
            <div className="stat-value">{overallStats.scienceAvg}%</div>
            <div className="stat-label">Science Average</div>
          </div>
        </div>
        <div className="detail-stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{overallStats.totalExams}</div>
            <div className="stat-label">Exams Completed</div>
          </div>
        </div>
        <div className="detail-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{overallStats.attendance}%</div>
            <div className="stat-label">Attendance</div>
          </div>
        </div>
      </div>
      
      <div className="exam-history">
        <h3>📋 Exam History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Max Score</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {examHistory.map(exam => (
              <tr key={exam.id}>
                <td>{exam.date}</td>
                <td>{exam.subject}</td>
                <td>{exam.score}</td>
                <td>{exam.maxScore}</td>
                <td>{Math.round((exam.score / exam.maxScore) * 100)}%</td>
                <td><span className="grade-badge">{exam.grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="performance-chart">
        <h3>📈 Performance Trend</h3>
        <div className="chart-placeholder">
          <p>Performance chart visualization would appear here</p>
          <div className="trend-bars">
            {examHistory.map((exam, idx) => (
              <div key={idx} className="trend-bar">
                <div 
                  className="bar-fill" 
                  style={{ height: `${(exam.score / exam.maxScore) * 100}%` }}
                />
                <div className="bar-label">{exam.subject.substring(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRecords;
