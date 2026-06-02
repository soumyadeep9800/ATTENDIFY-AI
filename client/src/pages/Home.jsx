import { useNavigate } from "react-router-dom";
import aiImage from "../images/ai.png";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-home">
      <div className="bg-orb-home orb-1-home"></div>
      <div className="bg-orb-home orb-2-home"></div>
      <div className="grid-overlay-home"></div>

      <nav className="navbar-home">
        <div className="logo-wrap-home">
          <div className="logo-dot-home"></div>
          <h1 className="logo-home">ATTENDIFY AI</h1>
        </div>

        <div className="nav-links-home">
          <button
            className="nav-btn-home nav-btn-secondary-home"
            onClick={() => navigate("/student-login")}
          >
            Student Portal
          </button>

          <button
            className="nav-btn-home nav-btn-primary-home"
            onClick={() => navigate("/teacher-login")}
          >
            Teacher Portal
          </button>
        </div>
      </nav>

      <main>
        <section className="hero-section-home">
          <div className="hero-left-home">
            <div className="badge-home">AI Powered Smart Attendance</div>

            <h1 className="hero-title-home">
              Smart Attendance with <span>Face</span> and <span>Voice</span>
              Verification
            </h1>

            <p className="description-home">
              Automate classroom attendance with real-time biometric
              verification, anti-proxy protection, and instant processing for
              teachers and institutions.
            </p>

            <div className="hero-stats-home">
              <div className="stat-pill-home">
                <h3>99.8%</h3>
                <p>Recognition Accuracy</p>
              </div>
              <div className="stat-pill-home">
                <h3>&lt; 2 Sec</h3>
                <p>Verification Time</p>
              </div>
              <div className="stat-pill-home">
                <h3>Anti-Proxy</h3>
                <p>Multi-layer Security</p>
              </div>
            </div>
          </div>

          <div className="hero-right-home">
            <div className="hero-image-card-home">
              <img
                src={aiImage}
                alt="AI recognition system"
                className="hero-image-home"
              />
            </div>
          </div>
        </section>

        <section className="workflow-section-home">
          <div className="section-header-home">
            <h2>How Attendify AI Works</h2>
          </div>

          <div className="workflow-container-home">
            {[
              ["01", "Select Subject", "Choose classroom session"],
              ["02", "Upload Photos", "Add classroom images"],
              ["03", "Face Analysis", "Detect registered students"],
              ["04", "Voice Check", "Run secondary authentication"],
              ["05", "Final Result", "Generate verified attendance"],
            ].map(([no, title, desc]) => (
              <div className="workflow-step-home" key={no}>
                <span>{no}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="features-section-home">
          <div className="section-header-home">
            <h2>Biometric Verification Engine</h2>
          </div>

          <div className="features-grid-home">
            <div className="feature-card-home feature-card-lg-home">
              <h3>Face Recognition</h3>
              <p>
                AI-powered detection identifies registered students from
                classroom images with high confidence.
              </p>
            </div>

            <div className="feature-card-home">
              <h3>Voice Authentication</h3>
              <p>
                Adds a second verification layer when facial confidence is low.
              </p>
            </div>

            <div className="feature-card-home">
              <h3>Real-Time Processing</h3>
              <p>
                Attendance is generated in seconds with optimized AI workflows.
              </p>
            </div>

            <div className="feature-card-home">
              <h3>Fraud Prevention</h3>
              <p>
                Reduces proxy attendance using multi-factor biometric checks.
              </p>
            </div>
          </div>
        </section>

        <section className="recognition-section-home">
          <div className="recognition-card-home">
            <div>
              <p className="mini-label-home">RECOGNITION TIPS</p>
              <h2>Best Practices for Better Accuracy</h2>
            </div>

            <ul className="tips-list-home">
              <li>Use clear, well-lit classroom photos.</li>
              <li>Avoid blurry images and extreme camera angles.</li>
              <li>Keep all students visible in the frame.</li>
              <li>Use voice verification for low-confidence matches.</li>
              <li>Review attendance before final submission.</li>
            </ul>
          </div>
        </section>

        <section className="cta-section-home">
          <div className="cta-card-home">
            <h2>Ready to modernize classroom attendance?</h2>
            <p>Fast, secure, and AI-powered verification for institutions.</p>
            <button
              className="primary-btn-home"
              onClick={() => navigate("/teacher-login")}
            >
              Get Started
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;