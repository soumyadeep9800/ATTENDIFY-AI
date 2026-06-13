from sqlalchemy.orm import Session
from app.models.subject import Subject
from app.models.subject_student import SubjectStudent


def create_subject(db, teacher_id, subject_data):
    subject = Subject(
        subject_code=subject_data.subject_code,
        name=subject_data.name,
        section=subject_data.section,
        teacher_id=teacher_id
    )

    db.add(subject)
    db.commit()
    db.refresh(subject)

    return {
        "subject_id": subject.subject_id,
        "subject_code": subject.subject_code,
        "name": subject.name,
        "section": subject.section,
        "enrolled_students": 0
    }


def get_teacher_subjects(
    db: Session,
    teacher_id: int
):
    subjects = (
        db.query(Subject)
        .filter(
            Subject.teacher_id == teacher_id
        )
        .all()
    )
    result = []
    for subject in subjects:
        student_count = (
            db.query(SubjectStudent)
            .filter(
                SubjectStudent.subject_id ==
                subject.subject_id
            )
            .count()
        )
        result.append({
            "subject_id": subject.subject_id,
            "subject_code": subject.subject_code,
            "name": subject.name,
            "section": subject.section,
            "students": student_count
        })

    return result


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