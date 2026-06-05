from fastapi import (APIRouter,UploadFile,File,Form)
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from fastapi import Depends

from app.services.attendance_service import (
    process_face_attendance,
    process_voice_attendance
)
from app.schemas.attendance_schema import (
    AttendanceSubmitRequest
)
from app.services.attendance_service import (
    submit_attendance_logs
)



router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.post("/face")
async def face_attendance(
    subject_id: int = Form(...),
    photos: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    return await process_face_attendance(
        subject_id,
        photos,
        db
    )


@router.post("/voice")
async def voice_attendance(
    subject_id: int = Form(...),
    audio: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return await process_voice_attendance(
        subject_id,
        audio,
        db
    )

@router.post("/submit")
async def submit_attendance(
    request: AttendanceSubmitRequest,
    db: Session = Depends(get_db)
):
    return await submit_attendance_logs(
        request,
        db
    )