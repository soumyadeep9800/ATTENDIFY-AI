from fastapi import (APIRouter,Depends,HTTPException)
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.subject_schema import (SubjectCreate,SubjectResponse)
from app.services.subject_service import (create_subject,get_teacher_subjects,delete_subject)

router = APIRouter(
    prefix="/subjects",
    tags=["Subjects"]
)

@router.post("/teacher/{teacher_id}",response_model=SubjectResponse)
def create_new_subject(
    teacher_id: int,
    subject: SubjectCreate,
    db: Session = Depends(get_db)
):
    return create_subject(
        db,
        teacher_id,
        subject
    )

@router.get("/teacher/{teacher_id}",response_model=list[SubjectResponse])
def get_subjects(
    teacher_id: int,
    db: Session = Depends(get_db)
):
    return get_teacher_subjects(
        db,
        teacher_id
    )


@router.delete("/teacher/{subject_id}")
def remove_subject(
    subject_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_subject(
        db,
        subject_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )

    return {
        "message":
        "Subject deleted successfully"
    }