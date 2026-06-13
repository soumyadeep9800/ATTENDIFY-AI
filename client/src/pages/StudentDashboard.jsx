import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/StudentDashboard.css";
import { toast } from "react-toastify";
import QRScanner from "../components/QRScanner";

function StudentDashboard() {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] =  useState(false);
  const [scanning, setScanning] = useState(false);

  const navigate = useNavigate();
  const student = JSON.parse(
    localStorage.getItem("student")
  );

  useEffect(() => {
    const studentData =
      localStorage.getItem("student");

    if (!studentData) {
      navigate("/student-login");
      return;
    }

    try {
      const parsedStudent =
        JSON.parse(studentData);

      if (!parsedStudent.student_id) {
        localStorage.removeItem(
          "student"
        );
        navigate("/student-login");
        return;
      }

      setLoading(false);
    } catch (error) {
      localStorage.removeItem(
        "student"
      );
      navigate("/student-login");
    }
  }, [navigate]);

  const handleEnroll = async () => {
    try {
      await axios.post(
        "http://localhost:8000/subjects/enroll-subject",
        {
          student_id: student.student_id,
          subject_code: subjectCode,
        }
      );
      toast.success("Successfully enrolled");
      setSubjectCode("");
      fetchSubjects();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Enrollment failed"
      );
    }
};

  const handleUnenroll = async (
    subjectCode
  ) => {
    try {
      await axios.delete(
        "http://localhost:8000/subjects/unenroll-subject",
        {
          data: {
            student_id:
              student.student_id,
            subject_code: subjectCode,
          },
        }
      );

      toast.success("Successfully unenrolled");

      fetchSubjects();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Unenrollment failed"
      );
    }
  };

  const fetchSubjects = async () => {
    try {
      const response =
        await axios.get(
          `http://localhost:8000/subjects/student/${student.student_id}`
        );

      setSubjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (student?.student_id) {
      fetchSubjects();
    }
  }, []);

  const handleQREnroll = async (
    decodedText
  ) => {
    try {
      const qrData =
        JSON.parse(decodedText);

      await axios.post(
        "http://localhost:8000/subjects/enroll-subject",
        {
          student_id:
            student.student_id,
          subject_code:
            qrData.subject_code,
        }
      );

      toast.success(
        "Successfully enrolled"
      );

      fetchSubjects();

      setShowScanner(false);
    } catch (error) {
      console.error(error);

      toast.error(
        "Invalid QR Code"
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-dashboard">

    <nav className="student-navbar">
      <div className="navbar-logo">
        ATTENDIFY AI
      </div>

      <button className="logout-btn2"
        onClick={() => {
          localStorage.removeItem("student");
          window.location.href = "/";
        }}>Logout
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

          <button onClick={handleEnroll}> Enroll </button>

          <button
            className="scan-btn"
            onClick={() =>
              setShowScanner(true)
            }
          >
            Scan QR
          </button>
        </div>
      </div>

      <div className="subjects-grid-sd">
        {subjects.length > 0 ? (
          <>
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
                  {subject.attendance_percentage}%
                </p>

                <button
                  className="unenroll-btn"
                  onClick={() =>
                    handleUnenroll(
                      subject.subject_code
                    )
                  }
                >
                  Unenroll
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="no-subjects">
            <h3>No Subjects Enrolled</h3>
            <p>
              Enter a subject code above to
              enroll in your first subject.
            </p>
          </div>
        )}
      </div>
    </div>

    {
      showScanner && (
        <div className="modal-overlay">
          <div className="scanner-modal">

            <h2>
              Scan Subject QR
            </h2>

            <QRScanner
              onScan={
                handleQREnroll
              }
            />

            <button
              onClick={() =>
                setShowScanner(false)
              }
            >
              Close
            </button>

          </div>
        </div>
      )
    }
    </div>
  );
}

export default StudentDashboard;