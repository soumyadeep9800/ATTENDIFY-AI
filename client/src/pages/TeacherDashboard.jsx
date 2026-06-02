import React, { useState } from "react";

import TeacherNavbar from "../components/TeacherNavbar";
import TakeAttendance from "../components/TakeAttendance";
import ManageSubjects from "../components/ManageSubjects";
import AttendanceRecords from "../components/AttendanceRecords";

import "../css/TeacherDashboard.css";

function TeacherDashboard() {
  const teacher = JSON.parse(
    localStorage.getItem("teacher")
  );

  const [activeTab, setActiveTab] =
    useState("attendance");

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
        teacher={teacher}
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