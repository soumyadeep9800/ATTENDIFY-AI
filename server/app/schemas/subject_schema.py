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
    teacher_id: int

    class Config:
        from_attributes = True