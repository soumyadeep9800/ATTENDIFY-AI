from sqlalchemy import Column, BigInteger, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Subject(Base):
    __tablename__ = "subjects"

    subject_id = Column(BigInteger, primary_key=True, index=True)
    subject_code = Column(Text, nullable=False)
    name = Column(Text, default="UNKNOWN")
    section = Column(Text, default="N/A")

    teacher_id = Column(
        BigInteger,
        ForeignKey("teachers.teacher_id")
    )

    teacher = relationship(
        "Teacher",
        back_populates="subjects"
    )

    students = relationship(
        "Student",
        secondary="subject_students",
        back_populates="subjects"
    )

    attendance_logs = relationship(
        "AttendanceLog",
        back_populates="subject"
    )