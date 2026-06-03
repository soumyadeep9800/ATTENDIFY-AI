from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends
)
from typing import Union
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.student_auth_service import (register_student,login_by_face)
from app.schemas.student_auth_schema import (FaceLoginFailedResponse, RegisterStudentResponse,FaceLoginSuccessResponse)


router = APIRouter(
    prefix="/student",
    tags=["Student Authentication"]
)

@router.post(
    "/register",
    response_model=RegisterStudentResponse
)
async def register(
    name: str = Form(...),
    photo: UploadFile = File(...),
    voice: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return await register_student(
        db=db,
        name=name,
        photo=photo,
        voice=voice
    )


@router.post(
    "/login/face",
    response_model=Union[
        FaceLoginSuccessResponse,
        FaceLoginFailedResponse
    ]
)
async def face_login(
    photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return await login_by_face(
        db=db,
        photo=photo
    )