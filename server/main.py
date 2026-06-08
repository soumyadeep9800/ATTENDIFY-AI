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


#For attend whenteacher upload image
# The system uses Dlib to generate 128-dimensional face embeddings. For authentication, nearest-neighbor matching with Euclidean distance is used.
# For classroom attendance, an SVM classifier is trained on registered student embeddings to identify multiple students efficiently,
# followed by distance-based verification to reduce false positives.