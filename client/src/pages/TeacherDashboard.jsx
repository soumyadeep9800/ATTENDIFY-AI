import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TeacherNavbar from "../components/TeacherNavbar";
import TakeAttendance from "../components/TakeAttendance";
import ManageSubjects from "../components/ManageSubjects";
import AttendanceRecords from "../components/AttendanceRecords";
import "../css/TeacherDashboard.css";

function TeacherDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("attendance");

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/teacher-login");
        return;
      }
      try {
        const res = await axios.get(
          "http://localhost:8000/teachers/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        localStorage.setItem(
          "teacher",
          JSON.stringify(res.data)
        );

        setLoading(false);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        navigate("/teacher-login");
      }
    };
    verifyToken();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "attendance":
        return <TakeAttendance />;

      case "subjects":
        return <ManageSubjects />;

      case "records":
        return <AttendanceRecords />;

      default:
        return <TakeAttendance />;
    }
  };

  return (
    <div className="dashboard-container">
      <TeacherNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default TeacherDashboard;