import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TeacherNavbar.css";
import { toast } from "react-toastify";

function TeacherNavbar({
  activeTab,
  setActiveTab,
}) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    localStorage.removeItem("token");
    toast.success("Logout Successful");
    navigate("/");
  };

  return (
    <nav className="teacher-navbar">
      <div className="navbar-left">
        <h2>ATTENDIFY AI</h2>
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div
        className={`navbar-center ${
          menuOpen ? "show-menu" : ""
        }`}
      >
        <button
          className={
            activeTab === "attendance"
              ? "nav-btn active"
              : "nav-btn"
          }
          onClick={() => {
            setActiveTab("attendance");
            setMenuOpen(false);
          }}
        >
          Take Attendance
        </button>

        <button
          className={
            activeTab === "subjects"
              ? "nav-btn active"
              : "nav-btn"
          }
          onClick={() => {
            setActiveTab("subjects");
            setMenuOpen(false);
          }}
        >
          Manage Subjects
        </button>

        <button
          className={
            activeTab === "records"
              ? "nav-btn active"
              : "nav-btn"
          }
          onClick={() => {
            setActiveTab("records");
            setMenuOpen(false);
          }}
        >
          Attendance Records
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default TeacherNavbar;