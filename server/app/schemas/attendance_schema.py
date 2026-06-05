from pydantic import BaseModel
from typing import List

class AttendanceStudent(BaseModel):
    student_id: int
    subject_id: int
    is_present: bool

class AttendanceSubmitRequest(BaseModel):
    students: List[AttendanceStudent]