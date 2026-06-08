from fastapi import (APIRouter,Depends)
from app.database import get_db
from app.schemas.subject_schema import EnrollSubjectRequest
from sqlalchemy.orm import Session
from app.services.student_subject_service import enroll_subject, get_student_subjects, get_subject_students, unenroll_subject

router = APIRouter(
    prefix="/subjects",
    tags=["Subjects"]
)

@router.post("/enroll-subject")
def enroll_subject_route(
    data: EnrollSubjectRequest,
    db: Session = Depends(get_db)
):
    return enroll_subject(data, db)


@router.delete("/unenroll-subject")
def unenroll_subject_route(
    data: EnrollSubjectRequest,
    db: Session = Depends(get_db)
):
    return unenroll_subject(data, db)


@router.get("/student/{student_id}")
def get_student_subjects_route(
    student_id: int,
    db: Session = Depends(get_db)
):
    return get_student_subjects(
        student_id,
        db
    )

@router.get("/{subject_id}/students")
def get_subject_students_route(
    subject_id: int,
    db: Session = Depends(get_db)
):
    return get_subject_students(
        subject_id,
        db
    )