from sqlalchemy import (
    Column,
    BigInteger,
    Boolean,
    ForeignKey,
    DateTime
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(BigInteger, primary_key=True, index=True)

    timestamp = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    subject_id = Column(
        BigInteger,
        ForeignKey("subjects.subject_id")
    )

    student_id = Column(
        BigInteger,
        ForeignKey("students.student_id")
    )

    is_present = Column(
        Boolean,
        default=True
    )

    student = relationship(
        "Student",
        back_populates="attendance_logs"
    )

    subject = relationship(
        "Subject",
        back_populates="attendance_logs"
    )