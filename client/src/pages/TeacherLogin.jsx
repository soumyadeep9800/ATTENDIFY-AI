import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/TeacherLogin.css";

function TeacherLogin() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="teacher_auth_page">
      <div className="teacher_navbar">
        <div className="teacher_nav_logo">
          ATTENDIFY AI
        </div>
        <button className="teacher_nav_home_btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      <div className="teacher_auth_shell">

        {/* LEFT PANEL */}

        <div className="teacher_auth_panel teacher_auth_panel_info">

          <div className="teacher_auth_badge">
            {isRegister ? "Create Workspace" : "Teacher Access"}
          </div>

          <h1 className="teacher_auth_title">
            {isRegister
              ? "Create your AI attendance workspace"
              : "Manage attendance smarter with AI"}
          </h1>

          <p className="teacher_auth_text">
            {isRegister
              ? "Register your account to manage classrooms, automate attendance, and monitor students using face and voice recognition."
              : "Access your dashboard, manage attendance records, track classroom activity, and verify students in real time using AI."}
          </p>

          <div className="teacher_auth_highlights">

            <div className="teacher_highlight_card">
              <span className="teacher_highlight_icon">01</span>

              <div>
                <h3>
                  {isRegister
                    ? "Create subjects"
                    : "Real-time monitoring"}
                </h3>

                <p>
                  {isRegister
                    ? "Setup classroom subjects and organize attendance workflows."
                    : "Track attendance instantly using AI-powered recognition."}
                </p>
              </div>
            </div>

            <div className="teacher_highlight_card">
              <span className="teacher_highlight_icon">02</span>

              <div>
                <h3>
                  {isRegister
                    ? "Face & voice setup"
                    : "AI verification system"}
                </h3>

                <p>
                  {isRegister
                    ? "Enable smart student verification using face and voice recognition."
                    : "Reduce proxy attendance with dual-layer authentication."}
                </p>
              </div>
            </div>

            <div className="teacher_highlight_card">
              <span className="teacher_highlight_icon">03</span>

              <div>
                <h3>
                  {isRegister
                    ? "Start attendance"
                    : "Attendance analytics"}
                </h3>

                <p>
                  {isRegister
                    ? "Launch your attendance dashboard and begin monitoring classrooms."
                    : "Analyze records and attendance performance efficiently."}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="teacher_auth_panel teacher_auth_panel_form">

          <div className="teacher_form_heading">
            <h2>
              {isRegister ? "Register" : "Teacher Login"}
            </h2>

            <p className="teacher_form_subtitle">
              {isRegister
                ? "Create your account to continue"
                : "Sign in to continue to your dashboard"}
            </p>
          </div>

          <form className="teacher_form">

            {isRegister && (
              <div className="teacher_field_group">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="teacher_field_group">
              <label>Username</label>

              <input
                type="text"
                placeholder="Enter username"
              />
            </div>

            <div className="teacher_field_group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
              />
            </div>

            {isRegister && (
              <div className="teacher_field_group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  placeholder="Confirm password"
                />
              </div>
            )}

            <button
              type="submit"
              className="teacher_submit_btn"
            >
              {isRegister ? "Create Account" : "Login"}
            </button>

          </form>

          <div className="teacher_auth_bottom">

            <button
              className="teacher_switch_btn"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </button>

            <button
              className="teacher_home_btn"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;