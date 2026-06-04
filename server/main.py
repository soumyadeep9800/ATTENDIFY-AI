from fastapi import FastAPI
from app.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.models import (Teacher,Student,Subject,SubjectStudent,AttendanceLog)

from app.api.teacher_auth import router as teacher_router
from app.api.teacher_subject_router import router as teacher_subject_router
from app.api.student_auth import router as student_router
from app.api.student_subject import router as student_subject_router

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

#.\venv\Scripts\Activate
#uvicorn main:app --reload
@app.get("/")
def home():
    return {"message": "Attendify AI Backend Running"}