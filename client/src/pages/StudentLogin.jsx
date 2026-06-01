import "../css/StudentLogin.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/StudentLogin.css";
#react-webcam
function StudentLogin() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // OPEN CAMERA

  const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user"
      }
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
      };
    }

    setCameraOpen(true);
  } catch (error) {
    console.error(error);
    alert(`${error.name}: ${error.message}`);
  }
};

  // TAKE PHOTO

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    const image = canvas.toDataURL("image/png");
    setCapturedImage(image);
    // stop camera after capture
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    setCameraOpen(false);
  };

  return (
    <div className="student_auth_page">

      {/* NAVBAR */}
      <div className="student_navbar">
        <div className="student_nav_logo">
          ATTENDIFY AI
        </div>
        <button
          className="student_nav_home_btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      {/* MAIN */}

      <div className="student_auth_shell">
        {/* LEFT PANEL */}
        <div className="student_auth_panel student_auth_panel_info">
          <div className="student_auth_badge">
            AI Powered Attendance
          </div>
          <h1 className="student_auth_title">
            Login using Smart Face Verification
          </h1>
          <p className="student_auth_text">
            Securely mark attendance using AI face recognition.
            Fast, modern, and fully automated classroom attendance
            with real-time identity verification.
          </p>

          <div className="student_auth_highlights">
            <div className="student_highlight_card">
              <span className="student_highlight_icon">
                01
              </span>
              <div>
                <h3>Face Recognition</h3>
                <p>
                  AI detects and verifies your face instantly
                  for attendance authentication.
                </p>
              </div>
            </div>

            <div className="student_highlight_card">
              <span className="student_highlight_icon">
                02
              </span>
              <div>
                <h3>Secure Verification</h3>
                <p>
                  Prevent proxy attendance using intelligent
                  facial analysis and verification.
                </p>
              </div>
            </div>

            <div className="student_highlight_card">
              <span className="student_highlight_icon">
                03
              </span>
              <div>
                <h3>Real-time Attendance</h3>
                <p>
                  Attendance is processed instantly and synced
                  directly with your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="student_auth_panel student_auth_panel_form">

          <div className="student_form_heading">
            <h2>Student Login</h2>
            <p className="student_form_subtitle">
              Open your camera and verify your identity
              using AI face recognition.
            </p>
          </div>

          {/* CAMERA SECTION */}

          <div className="student_camera_container">
            {!cameraOpen && !capturedImage && (
              <button
                className="student_camera_btn"
                onClick={openCamera}
              >
                Open Camera
              </button>
            )}

            {cameraOpen && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="student_camera_preview"
                />
                <button
                  className="student_capture_btn"
                  onClick={capturePhoto}
                >
                  Take Photo
                </button>
              </>
            )}

            {capturedImage && (
              <div className="student_captured_section">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="student_captured_image"
                />
                <button
                  className="student_login_btn"
                >
                  Verify & Login
                </button>
              </div>
            )}
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;