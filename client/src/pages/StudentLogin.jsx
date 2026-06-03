import "../css/StudentLogin.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function StudentLogin() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  // Login States
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Registration States
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const API_URL = "http://localhost:8000";

  // --- CAMERA LOGIC ---
  const openCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCapturedImage(null);
      setCameraOpen(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current.play();
            } catch (err) {
              console.error("Video play error:", err);
            }
          };
        }
      }, 100);
    } catch (error) {
      console.error(error);
      alert(`${error.name}: ${error.message}`);
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      alert("Camera not ready");
      return;
    }

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");
    setCapturedImage(image);
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    openCamera();
  };

  // --- LOGIN LOGIC ---
  const handleVerifyLogin = async () => {
    if (!capturedImage || !canvasRef.current) {
      alert("Please capture your photo first");
      return;
    }
    try {
      setIsVerifying(true);
      const blob = await new Promise((resolve) => {
        canvasRef.current.toBlob((fileBlob) => {
          resolve(fileBlob);
        }, "image/png");
      });
      if (!blob) {
        alert("Image conversion failed");
        return;
      }
      const file = new File([blob], "student-face.png", {
        type: "image/png",
      });
      const formData = new FormData();
      formData.append("photo", file);
      
      const response = await fetch(`${API_URL}/student/login/face`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Face verification failed"
        );
      }
      if (data.success) {
        localStorage.setItem("student", JSON.stringify(data.student));
        alert("Login successful");
        navigate("/student-dashboard");
      } else {
        alert(data.message || "Face not recognized");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Login failed");
    } finally {
      setIsVerifying(false);
    }
  };

  // --- VOICE RECORDING LOGIC ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setVoiceBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access denied or error:", error);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // --- REGISTRATION LOGIC ---
  const handleRegister = async () => {
    if (!studentName || !capturedImage || !voiceBlob) {
      alert("Name, face, and voice are required to register");
      return;
    }

    try {
      setIsVerifying(true); 
      const imageBlob = await new Promise((resolve) => {
        canvasRef.current.toBlob(
          (blob) => resolve(blob),
          "image/png"
        );
      });

      const formData = new FormData();
      formData.append("name", studentName);
      formData.append(
        "photo",
        new File([imageBlob], "student-face.png", { type: "image/png" })
      );
      formData.append(
        "voice",
        new File([voiceBlob], "student-voice.wav", { type: "audio/wav" })
      );

      const response = await axios.post(
        `${API_URL}/student/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message || "Registration successful");

      // Reset Form
      setStudentName("");
      setCapturedImage(null);
      setVoiceBlob(null);
      setIsRegisterMode(false);

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail ||
          error.message ||
          "Registration failed"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleAuthMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setCapturedImage(null);
    setStudentName("");
    setVoiceBlob(null);
    if (cameraOpen) stopCamera();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="student_auth_page">
      <div className="student_navbar">
        <div className="student_nav_logo">ATTENDIFY AI</div>
        <button
          className="student_nav_home_btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>

      <div className="student_auth_shell">
        {/* Left Information Panel */}
        <div className="student_auth_panel student_auth_panel_info">
          <div className="student_auth_badge">AI Powered Attendance</div>
          <h1 className="student_auth_title">
            {isRegisterMode ? "Register using AI Authentication" : "Login using Smart Face Verification"}
          </h1>
          <p className="student_auth_text">
            Securely manage attendance using AI face and voice recognition. Fast, modern,
            and fully automated classroom attendance with real-time identity verification.
          </p>

          <div className="student_auth_highlights">
            <div className="student_highlight_card">
              <span className="student_highlight_icon">01</span>
              <div>
                <h3>Face Recognition</h3>
                <p>AI detects and verifies your face instantly.</p>
              </div>
            </div>

            <div className="student_highlight_card">
              <span className="student_highlight_icon">02</span>
              <div>
                <h3>Voice Biometrics</h3>
                <p>Advanced voice printing adds a secondary layer of security.</p>
              </div>
            </div>

            <div className="student_highlight_card">
              <span className="student_highlight_icon">03</span>
              <div>
                <h3>Real-time Tracking</h3>
                <p>Attendance is processed instantly and synced.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="student_auth_panel student_auth_panel_form">
          <div className="student_form_heading">
            <h2>{isRegisterMode ? "Student Registration" : "Student Login"}</h2>
            <p className="student_form_subtitle">
              {isRegisterMode 
                ? "Setup your account by providing your name, face, and voice sample." 
                : "Open your camera and verify your identity."}
            </p>
          </div>

          <div className="student_camera_container">
            {/* Styled Registration Name Input */}
            {isRegisterMode && (
              <input
                type="text"
                placeholder="Enter Full Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="student_form_input"
              />
            )}

            {/* Camera View Controls */}
            {!cameraOpen && !capturedImage && (
              <button
                className="student_camera_btn"
                onClick={openCamera}
                type="button"
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
                  type="button"
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

                {/* Styled Registration Voice Recording UI */}
                {isRegisterMode && (
                  <div className="student_voice_section">
                    <p className="student_voice_text">
                      Voice Setup: Please clearly say <span>"Yes Sir"</span> or <span>"Yes Ma'am"</span>
                    </p>
                    
                    {!isRecording ? (
                      <button
                        className="student_voice_btn"
                        onClick={startRecording}
                        type="button"
                      >
                        {voiceBlob ? "Retake Voice" : "Start Recording Voice"}
                      </button>
                    ) : (
                      <button
                        className="student_voice_btn recording"
                        onClick={stopRecording}
                        type="button"
                      >
                        Stop Recording
                      </button>
                    )}
                    
                    {voiceBlob && <p className="student_voice_success">✓ Voice recorded successfully</p>}
                  </div>
                )}

                {/* Main Interactive Actions Form */}
                <div className="student_login_actions">
                  <button
                    className="student_retake_btn"
                    onClick={retakePhoto}
                    type="button"
                  >
                    Retake Photo
                  </button>

                  {!isRegisterMode ? (
                    <button
                      className="student_login_btn"
                      onClick={handleVerifyLogin}
                      disabled={isVerifying}
                      type="button"
                    >
                      {isVerifying ? "Verifying..." : "Verify & Login"}
                    </button>
                  ) : (
                    <button
                      className="student_login_btn"
                      onClick={handleRegister}
                      disabled={isVerifying || !voiceBlob || !studentName}
                      type="button"
                    >
                      {isVerifying ? "Registering..." : "Complete Registration"}
                    </button>
                  )}
                </div>
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          {/* Styled Auth Panel Bottom Toggle Link */}
          <div className="student_toggle_auth_container">
            <button
              onClick={toggleAuthMode}
              className="student_toggle_auth_btn"
              type="button"
            >
              {isRegisterMode ? (
                <>Already have an account? <span>Login here</span></>
              ) : (
                <>Don't have an account? <span>Register here</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;