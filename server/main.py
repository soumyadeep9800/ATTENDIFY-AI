from fastapi import FastAPI
from app.database import engine, Base
from app.models import (
    Teacher,
    Student,
    Subject,
    SubjectStudent,
    AttendanceLog
)
Base.metadata.create_all(bind=engine)
# import dlib
# # print(dir(dlib))
# print(type(embedding))


app = FastAPI()
#.\venv\Scripts\Activate
#uvicorn main:app --reload
@app.get("/")
def home():
    return {"message": "Attendify AI Backend Running"}