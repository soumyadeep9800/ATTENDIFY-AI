import React, { useState } from "react";
import "../css/StudentDashboard.css";

function StudentDashboard() {
  const [subjectCode, setSubjectCode] = useState("");

  const subjects = [
    {
      subject_name: "AI & ML",
      subject_code: "AIML101",
      section: "A",
      total_students: 42,
      attendance: 89,
    },
    {
      subject_name: "DBMS",
      subject_code: "DBMS201",
      section: "B",
      total_students: 55,
      attendance: 95,
    },
    {
      subject_name: "DBMS",
      subject_code: "DBMS201",
      section: "B",
      total_students: 55,
      attendance: 95,
    },
  ];

  const handleEnroll = () => {
    // Call API here
  };

  const handleUnenroll = (subjectCode) => {
    console.log(
      "Unenroll from:",
      subjectCode
    );

    // Call API here
    // DELETE /student/unenroll-subject
  };

  return (
    <div className="student-dashboard">

       <nav className="student-navbar">
        <div className="navbar-logo">
          ATTENDIFY AI
        </div>

        <button className="logout-btn">
          Logout
        </button>
      </nav>

    <div className="dashboard-content-sd">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
      </header>

      <div className="enroll-section">
        <h2>Enroll Subject</h2>

        <div className="enroll-form">
          <input
            type="text"
            placeholder="Enter Subject Code"
            value={subjectCode}
            onChange={(e) =>
              setSubjectCode(e.target.value)
            }
          />

          <button onClick={handleEnroll}>
            Enroll
          </button>
        </div>
      </div>

      <div className="subjects-grid-sd">
        <h2>My Subjects</h2>
        {subjects.map((subject, index) => (
          <div
            className="subject-card-sd"
            key={index}
          >
            <h3>{subject.subject_name}</h3>

            <p>
              <strong>Code:</strong>{" "}
              {subject.subject_code}
            </p>

            <p>
              <strong>Section:</strong>{" "}
              {subject.section}
            </p>

            <p>
              <strong>Total Students:</strong>{" "}
              {subject.total_students}
            </p>

            <p>
              <strong>Your Attendance:</strong>{" "}
              {subject.attendance}%
            </p>

            <button
              className="unenroll-btn"
              onClick={() =>
                handleUnenroll(subject.subject_code)
              }
            >
              Unenroll
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default StudentDashboard;