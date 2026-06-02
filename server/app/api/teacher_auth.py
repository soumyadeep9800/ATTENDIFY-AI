from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_teacher
from app.database import get_db
from app.models.teacher import Teacher
from app.core.security import hash_password
from app.schemas.teacher import (
    TeacherRegister,
    TeacherLogin,
    LoginResponse
)
from app.core.security import (
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/teachers",
    tags=["Teachers"]
)

@router.post("/register")
def register_teacher(
    teacher: TeacherRegister,
    db: Session = Depends(get_db)
):

    existing = db.query(Teacher).filter(
        Teacher.username == teacher.username
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    new_teacher = Teacher(
        name=teacher.name,
        username=teacher.username,
        password=hash_password(
            teacher.password
        )
    )

    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return {
    "message": "Teacher registered",
    "teacher_id": new_teacher.teacher_id
    }


@router.post("/login",response_model=LoginResponse)
def login_teacher(
    teacher_data: TeacherLogin,
    db: Session = Depends(get_db)
):

    teacher = db.query(Teacher).filter(
        Teacher.username == teacher_data.username
    ).first()

    if not teacher:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        teacher_data.password,
        teacher.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "teacher_id": teacher.teacher_id,
            "username": teacher.username
        }
    )

    return {
    "access_token": token,
    "token_type": "bearer",
    "teacher_id": teacher.teacher_id,
    "name": teacher.name,
    "username": teacher.username
    }

@router.post("/logout")
def logout_teacher():
    return {
        "message": "Logged out successfully"
    }

@router.get("/dashboard")
def dashboard(
    teacher_id=Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    teacher = (
        db.query(Teacher)
        .filter(Teacher.teacher_id == teacher_id)
        .first()
    )

    if teacher is None:
        raise HTTPException(
            status_code=404,
            detail="Teacher not found"
        )

    return {
        "teacher_id": teacher.teacher_id,
        "name": teacher.name,
        "username": teacher.username
    }