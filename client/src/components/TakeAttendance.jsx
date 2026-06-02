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
      <div className="attendance-bg-orb attendance-bg-orb-1"></div>
      <div className="attendance-bg-orb attendance-bg-orb-2"></div>

      <div className="attendance-header">
        <div className="attendance-header-content">
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

      <section className="attendance-card subject-card">
        <div className="section-title-wrap">
          <div>
            <span className="section-kicker">Session Setup</span>
            <h2>Select Subject</h2>
          </div>
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
            <div>
              <span className="section-kicker">AI Module</span>
              <h2>Photo Attendance</h2>
            </div>
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
            <div>
              <span className="section-kicker">Verification</span>
              <h2>Voice Attendance</h2>
            </div>
            <span className="status-pill alt">Optional</span>
          </div>

          <p>
            Verify students using registered voice samples for additional
            security and better attendance confidence.
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
          <div>
            <span className="section-kicker">Realtime Overview</span>
            <h2>Session Information</h2>
          </div>
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