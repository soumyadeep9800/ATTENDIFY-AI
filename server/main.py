from fastapi import FastAPI
from app.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from app.models import (
    Teacher,
    Student,
    Subject,
    SubjectStudent,
    AttendanceLog
)
from app.api.teacher_auth import router as teacher_router

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

#.\venv\Scripts\Activate
#uvicorn main:app --reload
@app.get("/")
def home():
    return {"message": "Attendify AI Backend Running"}