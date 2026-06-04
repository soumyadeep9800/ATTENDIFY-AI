from fastapi import HTTPException
from app.models.subject import Subject
from app.models.student import Student
from app.models.subject_student import SubjectStudent
from app.models.attendance_log import AttendanceLog


def enroll_subject(data, db):
    student = (
        db.query(Student)
        .filter(
            Student.student_id == data.student_id
        )
        .first()
    )
    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )
    subject = (
        db.query(Subject)
        .filter(
            Subject.subject_code == data.subject_code
        )
        .first()
    )
    if not subject:
        raise HTTPException(
            status_code=404,
            detail="Subject not found"
        )
    existing = (
        db.query(SubjectStudent)
        .filter(
            SubjectStudent.subject_id == subject.subject_id,
            SubjectStudent.student_id == student.student_id
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already enrolled"
        )
    enrollment = SubjectStudent(
        subject_id=subject.subject_id,
        student_id=student.student_id
    )
    db.add(enrollment)
    db.commit()
    return {
        "message": "Successfully enrolled"
    }


def unenroll_subject(data, db):
    enrollment = (
        db.query(SubjectStudent)
        .join(Subject)
        .filter(
            Subject.subject_code == data.subject_code,
            SubjectStudent.student_id == data.student_id
        )
        .first()
    )
    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found"
        )

    db.delete(enrollment)
    db.commit()
    return {
        "message": "Successfully unenrolled"
    }

def get_student_subjects(
    student_id: int,
    db
):
    enrollments = (
        db.query(
            Subject.subject_id,
            Subject.name,
            Subject.subject_code,
            Subject.section
        )
        .join(
            SubjectStudent,
            Subject.subject_id ==
            SubjectStudent.subject_id
        )
        .filter(
            SubjectStudent.student_id ==
            student_id
        )
        .all()
    )

    result = []

    for subject in enrollments:

        total_students = (
            db.query(SubjectStudent)
            .filter(
                SubjectStudent.subject_id ==
                subject.subject_id
            )
            .count()
        )

        total_classes = (
            db.query(AttendanceLog)
            .filter(
                AttendanceLog.subject_id ==
                subject.subject_id
            )
            .count()
        )

        present_classes = (
            db.query(AttendanceLog)
            .filter(
                AttendanceLog.subject_id ==
                subject.subject_id,
                AttendanceLog.student_id ==
                student_id,
                AttendanceLog.is_present == True
            )
            .count()
        )

        attendance_percentage = 0

        if total_classes > 0:
            attendance_percentage = round(
                (present_classes / total_classes)
                * 100,
                2
            )

        result.append({
            "subject_id":
                subject.subject_id,

            "subject_name":
                subject.name,

            "subject_code":
                subject.subject_code,

            "section":
                subject.section,

            "total_students":
                total_students,

            "attendance_percentage":
                attendance_percentage
        })

    return result