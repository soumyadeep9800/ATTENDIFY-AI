import { useNavigate } from "react-router-dom";

import "../css/Home.css";


function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <nav className="navbar">
        <h1 className="logo">ATTENDIFY AI</h1>

        <div className="nav-links">
          <button className="nav-btn-student" onClick={() => navigate("/student-login")}>
            Student Portal
          </button>

          <button className="nav-btn-teacher" onClick={() => navigate("/teacher-login")}>
            Teacher Portal
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-left">
          <p className="tagline">AI Powered Smart Attendance System</p>

          <h1>
            Smart Attendance <br />
            Using Face & Voice Recognition
          </h1>

          <p className="description">
            Attendify AI is an intelligent attendance management platform that
            uses facial recognition and voice authentication to identify and
            verify students in real time. Designed to reduce proxy attendance,
            improve accuracy, and automate classroom monitoring with AI.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Get Started</button>
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="glass-card">
            <h2>Real-Time Verification</h2>

            <div className="feature">
              <span>🎭</span>
              <p>Face Recognition Detection</p>
            </div>

            <div className="feature">
              <span>🎤</span>
              <p>Voice Authentication</p>
            </div>

            <div className="feature">
              <span>⚡</span>
              <p>Instant Attendance Processing</p>
            </div>

            <div className="feature">
              <span>🛡️</span>
              <p>Anti Proxy Attendance System</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;