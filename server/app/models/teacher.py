from sqlalchemy import Column, BigInteger, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Teacher(Base):
    __tablename__ = "teachers"

    teacher_id = Column(BigInteger, primary_key=True, index=True)
    username = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    name = Column(Text)

    subjects = relationship("Subject", back_populates="teacher")