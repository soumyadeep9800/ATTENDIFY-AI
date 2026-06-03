import React, { useState, useEffect, useRef } from "react";
import "../css/TakeAttendance.css";

function TakeAttendance() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const attendanceGridRef = useRef(null);
  const API_URL = "http://localhost:8000";

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [cameraStream, setCameraStream] = useState(null);

  const teacher = JSON.parse(localStorage.getItem("teacher"));
  const teacherId = teacher?.teacher_id;

  useEffect(() => {
    if (teacherId) {
      fetchSubjects();
    }
  }, [teacherId]);

  useEffect(() => {
    if (showPhotoModal) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [showPhotoModal]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_URL}/subjects/teacher/${teacherId}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load subjects");
    }
  };

  const handleStartSession = () => {
    if (!selectedSubjectId) {
      alert("Please select a subject");
      return;
    }

    attendanceGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files);
    setPhotos((prev) => [...prev, ...files]);
  };

  const startCamera = async () => {
    try {
      if (cameraStream) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraStream(stream);
    } catch (err) {
      console.error(err);
      alert("Unable to access camera");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      setPhotos((prev) => [...prev, file]);
    }, "image/jpeg");
  };

  const handleDone = () => {
    stopCamera();
    setShowPhotoModal(false);
  };

  const handleCloseModal = () => {
    stopCamera();
    setShowPhotoModal(false);
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  const runFaceAnalysis = async () => {
    if (photos.length === 0) {
      alert("Please add photos first");
      return;
    }

    const formData = new FormData();
    formData.append("subject_id", selectedSubjectId);

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const response = await fetch(`${API_URL}/attendance/face`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      alert("Face analysis completed");
    } catch (error) {
      console.error(error);
      alert("Analysis failed");
    }
  };

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
          <button className="primary-btn" onClick={handleStartSession}>
            Start Session
          </button>
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
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            <option value="">Choose Subject</option>
            {subjects.map((sub) => (
              <option key={sub.subject_id} value={sub.subject_id}>
                {sub.name} ({sub.subject_code})
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="attendance-grid" ref={attendanceGridRef}>
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
            <strong>{photos.length}</strong>
          </div>

          <div className="btn-group">
            <button
              className="primary-btn"
              onClick={() => setShowPhotoModal(true)}
            >
              Add Photos
            </button>

            <button className="secondary-btn" onClick={clearPhotos}>
              Clear Photos
            </button>
          </div>

          <button className="analysis-btn" onClick={runFaceAnalysis}>
            Run Face Analysis
          </button>
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

      {showPhotoModal && (
        <div className="photo-modal" onClick={handleCloseModal}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close photo modal"
              type="button"
            >
              ×
            </button>

            <h2 id="photo-modal-title">Upload Attendance Photos</h2>

            <div className="modal-actions">
              <button type="button" className="camera-btn-open" onClick={startCamera}>
                Open Camera
              </button>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="gallery-input"
              />
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width="400"
            />

            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />

            <button type="button" className="capture-btn" onClick={capturePhoto}>
              Capture Photo
            </button>

            <p>Photos Selected: {photos.length}</p>

            <button
              className="primary-btn"
              type="button"
              onClick={handleDone}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TakeAttendance;