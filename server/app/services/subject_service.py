from sqlalchemy.orm import Session
from app.models.subject import Subject


def create_subject(
    db: Session,
    teacher_id: int,
    subject_data
):
    subject = Subject(
        subject_code=subject_data.subject_code,
        name=subject_data.name,
        section=subject_data.section,
        teacher_id=teacher_id
    )

    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


def get_teacher_subjects(
    db: Session,
    teacher_id: int
):
    return (
        db.query(Subject)
        .filter(
            Subject.teacher_id == teacher_id
        )
        .all()
    )


def delete_subject(
    db: Session,
    subject_id: int
):
    subject = (
        db.query(Subject)
        .filter(
            Subject.subject_id == subject_id
        )
        .first()
    )

    if not subject:
        return False

    db.delete(subject)
    db.commit()

    return True