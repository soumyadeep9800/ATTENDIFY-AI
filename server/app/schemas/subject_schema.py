from pydantic import BaseModel


class SubjectCreate(BaseModel):
    subject_code: str
    name: str
    section: str

class SubjectResponse(BaseModel):
    subject_id: int
    subject_code: str
    name: str
    section: str
    students: int = 0

    class Config:
        from_attributes = True

class EnrollSubjectRequest(BaseModel):
    student_id: int
    subject_code: str


class StudentSubjectResponse(BaseModel):
    subject_id: int
    subject_name: str
    subject_code: str
    section: str
    total_students: int
    attendance_percentage: float