import React, { useState } from "react";
import "../css/ManageSubject.css";

function ManageSubjects() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [section, setSection] = useState("");

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Database Management System",
      code: "DBMS101",
      section: "A",
      students: 45,
    },
    {
      id: 2,
      name: "Operating System",
      code: "OS201",
      section: "B",
      students: 38,
    },
  ]);

  const handleCreateSubject = () => {
    if (!subjectName || !subjectCode || !section) {
      alert("Please fill all fields");
      return;
    }

    const newSubject = {
      id: Date.now(),
      name: subjectName,
      code: subjectCode,
      section,
      students: 0,
    };

    setSubjects([...subjects, newSubject]);

    setSubjectName("");
    setSubjectCode("");
    setSection("");
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) return;

    setSubjects(
      subjects.filter((subject) => subject.id !== id)
    );
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Subject code copied successfully");
  };

  const handleShowQR = (code) => {
    alert(
      `Future QR Code Feature\nEnrollment Code: ${code}`
    );
  };

  return (
    <div className="subjects-page">

      <div className="subjects-header">
        <h1>Manage Subjects</h1>

        <p>
          Create, manage and share subject enrollment
          details with students.
        </p>
      </div>

      {/* Create Subject */}

      <div className="subject-card">
        <h2>Create Subject</h2>

        <div className="form-grid">

          <div className="input-group">
            <label>Subject Name</label>

            <input
              type="text"
              placeholder="Database Management System"
              value={subjectName}
              onChange={(e) =>
                setSubjectName(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label>Subject Code</label>

            <input
              type="text"
              placeholder="DBMS101"
              value={subjectCode}
              onChange={(e) =>
                setSubjectCode(e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label>Section</label>

            <input
              type="text"
              placeholder="A"
              value={section}
              onChange={(e) =>
                setSection(e.target.value)
              }
            />
          </div>

        </div>

        <button
          className="create-btn"
          onClick={handleCreateSubject}
        >
          Create Subject
        </button>
      </div>

      {/* Subject List */}

      <div className="subject-card">
        <h2>Created Subjects</h2>

        <div className="subjects-list">

          {subjects.length === 0 ? (
            <p className="empty-text">
              No subjects created yet.
            </p>
          ) : (
            subjects.map((subject) => (
              <div
                key={subject.id}
                className="subject-item"
              >
                <div className="subject-info">
                  <h3>{subject.name}</h3>

                  <p>
                    Code:
                    <span> {subject.code}</span>
                  </p>

                  <p>
                    Section:
                    <span> {subject.section}</span>
                  </p>

                  <p>
                    Enrolled Students:
                    <span>
                      {" "}
                      {subject.students}
                    </span>
                  </p>
                </div>

                <div className="subject-actions">

                  <button
                    className="share-btn"
                    onClick={() =>
                      handleCopyCode(subject.code)
                    }
                  >
                    Share Code
                  </button>

                  <button
                    className="qr-btn"
                    onClick={() =>
                      handleShowQR(subject.code)
                    }
                  >
                    Show QR
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(subject.id)
                    }
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
}

export default ManageSubjects;