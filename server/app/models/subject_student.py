from sqlalchemy import Column, BigInteger, ForeignKey
from app.database import Base

class SubjectStudent(Base):
    __tablename__ = "subject_students"

    subject_id = Column(
        BigInteger,
        ForeignKey("subjects.subject_id"),
        primary_key=True
    )

    student_id = Column(
        BigInteger,
        ForeignKey("students.student_id"),
        primary_key=True
    )