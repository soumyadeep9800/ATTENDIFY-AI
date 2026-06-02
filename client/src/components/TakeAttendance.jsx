import React, { useState } from "react";
import "../css/TakeAttendance.css";

function TakeAttendance() {
  const [subject, setSubject] = useState("");

  const subjects = [
    "Data Structures",
    "Database Management System",
    "Operating System",
    "Computer Networks",
  ];

  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div>
          <span className="page-badge">Smart Classroom</span>
          <h1>Take Attendance</h1>
          <p>
            AI-powered attendance system using face recognition and voice
            verification technology.
          </p>
        </div>

        <div className="header-action">
          <button className="primary-btn">Start Session</button>
        </div>
      </div>

      <section className="workflow-card">
        <div className="section-title-wrap">
          <h2>Attendance Workflow</h2>
          <span className="mini-tag">5 steps</span>
        </div>

        <div className="workflow-steps">
          <div className="step active">
            <span>1</span>
            <div>
              <strong>Select Subject</strong>
              <small>Choose class</small>
            </div>
          </div>

          <div className="step">
            <span>2</span>
            <div>
              <strong>Upload Photos</strong>
              <small>Add classroom images</small>
            </div>
          </div>

          <div className="step">
            <span>3</span>
            <div>
              <strong>Face Analysis</strong>
              <small>Detect students</small>
            </div>
          </div>

          <div className="step">
            <span>4</span>
            <div>
              <strong>Voice Check</strong>
              <small>Extra verification</small>
            </div>
          </div>

          <div className="step">
            <span>5</span>
            <div>
              <strong>Result</strong>
              <small>Confirm attendance</small>
            </div>
          </div>
        </div>
      </section>

      <section className="attendance-card subject-card">
        <div className="section-title-wrap">
          <h2>Select Subject</h2>
          <span className="mini-tag">Required</span>
        </div>

        <p>Choose the subject for which attendance will be recorded.</p>

        <div className="select-wrap">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Choose Subject</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="attendance-grid">
        <div className="attendance-card feature-card">
          <div className="card-top">
            <h2>Photo Attendance</h2>
            <span className="status-pill">Ready</span>
          </div>

          <p>
            Upload classroom images and let AI identify students through facial
            recognition.
          </p>

          <div className="info-box">
            <span>Uploaded Photos</span>
            <strong>0</strong>
          </div>

          <div className="btn-group">
            <button className="primary-btn">Add Photos</button>
            <button className="secondary-btn">Clear Photos</button>
          </div>

          <button className="analysis-btn">Run Face Analysis</button>
        </div>

        <div className="attendance-card feature-card">
          <div className="card-top">
            <h2>Voice Attendance</h2>
            <span className="status-pill alt">Optional</span>
          </div>

          <p>
            Verify students using registered voice samples for additional
            security.
          </p>

          <div className="info-box subtle">
            Recommended after face analysis for improved accuracy.
          </div>

          <button className="primary-btn full-btn">
            Start Voice Attendance
          </button>
        </div>
      </section>

      <section className="attendance-card">
        <div className="section-title-wrap">
          <h2>Recognition Tips</h2>
          <span className="mini-tag">Best practice</span>
        </div>

        <ul className="tips-list">
          <li>Ensure classroom photos are clear and properly illuminated.</li>
          <li>Avoid blurry images and extreme camera angles.</li>
          <li>Ensure all students are visible in the frame.</li>
          <li>Use voice verification when face confidence scores are low.</li>
          <li>Verify attendance results before submission.</li>
        </ul>
      </section>

      <section className="attendance-card">
        <div className="section-title-wrap">
          <h2>Session Information</h2>
          <span className="mini-tag">Live stats</span>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <p>Total Students</p>
            <span>--</span>
          </div>

          <div className="stat-box">
            <p>Detected Faces</p>
            <span>--</span>
          </div>

          <div className="stat-box">
            <p>Present Students</p>
            <span>--</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TakeAttendance;