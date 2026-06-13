import React, { useState, useEffect } from "react";
import "../css/ManageSubject.css";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

function ManageSubjects() {
  const API_URL = "http://localhost:8000";
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [section, setSection] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

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

  const handleShowQR = (subject) => {
    setSelectedSubject(subject);
    setShowQRModal(true);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("subject-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
      ctx.drawImage(
        img,
        0,
        0,
        300,
        300
      );

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${selectedSubject.subject_code}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShareQR = async () => {
    try {
      const svg = document.getElementById("subject-qr");
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas =  document.createElement("canvas");
      const ctx =  canvas.getContext("2d");
      const img = new Image();
      canvas.width = 300;
      canvas.height = 300;

      img.onload = async () => {
        ctx.fillStyle = "#fff";
        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        ctx.drawImage(
          img,
          0,
          0,
          300,
          300
        );

        canvas.toBlob(
          async (blob) => {
            const file = new File(
              [blob],
              `${selectedSubject.subject_code}.png`,
              {
                type: "image/png",
              }
            );

            if (
              navigator.canShare &&
              navigator.canShare({
                files: [file],
              })
            ) {
              await navigator.share({
                title:
                  selectedSubject.name,
                text:
                  "Scan this QR to join the subject",
                files: [file],
              });
            } else {
              toast.info(
                "Sharing not supported on this device"
              );
            }
          },
          "image/png"
        );
      };

      img.src =  "data:image/svg+xml;base64," +  btoa(svgData);
    } catch (err) {
      console.error(err);
      toast.error(
        "Unable to share QR"
      );
    }
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
                      handleShowQR(subject)
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


      {
        showQRModal &&
        selectedSubject && (
          <div className="modal-overlay">
            <div className="qr-modal">

              <h2>
                {selectedSubject.name}
              </h2>

              <QRCode
                id="subject-qr"
                value={JSON.stringify({
                  subject_id: selectedSubject.subject_id,
                  subject_code: selectedSubject.subject_code,
                })}
                size={250}
              />

              <p>
                Scan this QR to join the
                subject
              </p>

              <div className="qr-buttons">

              <button
                className="download-btn"
                onClick={handleDownloadQR}
              >
                Download QR
              </button>

              <button
                className="share-qr-btn"
                onClick={handleShareQR}
              >
                Share QR
              </button>

              <button
                className="close-btn"
                onClick={() =>
                  setShowQRModal(false)
                }
              >
                Close
              </button>

            </div>

            </div>
          </div>
        )
      }
    </div>
  );
}

export default ManageSubjects;