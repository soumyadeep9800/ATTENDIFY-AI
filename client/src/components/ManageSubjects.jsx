import React, { useState, useEffect } from "react";
import "../css/ManageSubject.css";
import { toast } from "react-toastify";

function ManageSubjects() {
  const API_URL = "http://localhost:8000";
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [section, setSection] = useState("");
  const [subjects, setSubjects] = useState([]);
  
  const teacher = JSON.parse(
  localStorage.getItem("teacher")
  );
  const teacherId = teacher?.teacher_id;

  useEffect(() => {
    if (teacherId) {
      fetchSubjects();
    }
  }, [teacherId]);
  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        `${API_URL}/subjects/teacher/${teacherId}`
      );
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subjects");
    }
  };

  const handleCreateSubject = async () => {
    if (
      !subjectName ||
      !subjectCode ||
      !section
    ) {
      toast.info("Please fill all fields");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/subjects/teacher/${teacherId}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            subject_code: subjectCode,
            name: subjectName,
            section: section,
          }),
        }
      );
      if (!response.ok) {
        throw new Error();
      }
      const newSubject = await response.json();
      setSubjects((prev) => [
        ...prev,
        newSubject,
      ]);
      setSubjectName("");
      setSubjectCode("");
      setSection("");
      toast.success("Subject created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create subject");
    }
  };

  const handleDelete = async (subjectId) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this subject?"
      );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `${API_URL}/subjects/teacher/${subjectId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setSubjects((prev) =>
        prev.filter(
          (subject) =>
            subject.subject_id !== subjectId
        )
      );

      toast.success("Subject deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subject");
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Subject code copied successfully");
  };

  const handleShowQR = (code) => {
    toast.info(
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
                key={subject.subject_id}
                className="subject-item"
              >
                <div className="subject-info">
                  <h3>{subject.name}</h3>

                  <p>
                    Code:
                    <span> {subject.subject_code}</span>
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
                      handleCopyCode(subject.subject_code)
                    }
                  >
                    Share Code
                  </button>

                  <button
                    className="qr-btn"
                    onClick={() =>
                      handleShowQR(subject.subject_code)
                    }
                  >
                    Show QR
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(subject.subject_id)
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