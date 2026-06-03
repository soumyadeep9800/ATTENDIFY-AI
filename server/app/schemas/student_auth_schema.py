from pydantic import BaseModel

# Student Info
class StudentResponse(BaseModel):
    student_id: int
    name: str
    class Config:
        from_attributes = True

# Register Response
class RegisterStudentResponse(BaseModel):
    success: bool
    student_id: int
    message: str

# Face Login Success Response
class FaceLoginSuccessResponse(BaseModel):
    success: bool
    student: StudentResponse

# Face Login Failed Response
class FaceLoginFailedResponse(BaseModel):
    success: bool
    message: str
