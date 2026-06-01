from sqlalchemy import Column, BigInteger, Text, ARRAY, Float
from sqlalchemy.orm import relationship
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    student_id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False)

    face_embedding = Column(ARRAY(Float))
    voice_embedding = Column(ARRAY(Float))

    attendance_logs = relationship(
        "AttendanceLog",
        back_populates="student"
    )

    subjects = relationship(
        "Subject",
        secondary="subject_students",
        back_populates="students"
    )