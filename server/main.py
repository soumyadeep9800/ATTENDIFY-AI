from fastapi import FastAPI
from app.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.models import (Teacher,Student,Subject,SubjectStudent,AttendanceLog)

from app.api.teacher_auth import router as teacher_router
from app.api.teacher_subject_router import router as teacher_subject_router
from app.api.student_auth import router as student_router
from app.api.student_subject import router as student_subject_router
from app.api.attendance_routes import router as attendance_router

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Attendify AI Backend",
    description="AI Powered Face & Voice Attendance System",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(teacher_router)
app.include_router(teacher_subject_router)
app.include_router(student_router)
app.include_router(student_subject_router)
app.include_router(attendance_router)

#.\venv\Scripts\Activate
#uvicorn main:app --reload
@app.get("/")
def home():
    return {"message": "Attendify AI Backend Running"}


#for login
# During registration,the system extracts a 128-dimensional facial embedding using Dlib's ResNet-based face recognition model and stores it in PSQL.
# During login, a new facial embedding is generated from the uploaded image and compared against all stored embeddings using Euclidean distance.
# The student with the minimum distance is selected, and authentication succeeds only if the distance is below a predefined threshold.

# The system uses Dlib's pretrained deep metric learning model. First, faces are detected using Dlib's frontal face detector.
# Facial landmarks are then extracted to align the face. The aligned face is passed through Dlib's ResNet-based face recognition network,
# which generates a 128-dimensional embedding vector. This embedding represents the facial features in a numerical feature space.
# During authentication or attendance, newly generated embeddings are compared against stored embeddings using Euclidean distance.
# If the distance falls below a predefined threshold, the identity is considered a match.