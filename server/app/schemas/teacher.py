from pydantic import BaseModel


class TeacherRegister(BaseModel):
    name: str
    username: str
    password: str


class TeacherLogin(BaseModel):
    username: str
    password: str


class TeacherResponse(BaseModel):
    teacher_id: int
    name: str
    username: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class LoginResponse(TokenResponse):
    teacher_id: int
    name: str
    username: str