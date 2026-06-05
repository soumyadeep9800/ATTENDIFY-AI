from datetime import datetime
import cv2
import numpy as np
from zoneinfo import ZoneInfo
from app.models.student import Student
from app.models.subject import Subject
from app.models.subject_student import SubjectStudent
from app.models.attendance_log import AttendanceLog

from app.ml.face_service import get_face_embeddings
from app.ml.voice_service import get_voice_embedding
from app.schemas.attendance_schema import (
    AttendanceSubmitRequest
)

async def process_face_attendance(
    subject_id,
    photos,
    db
):
    recognized_students = []

    enrolled_students = (
        db.query(Student)
        .join(
            SubjectStudent,
            Student.student_id ==
            SubjectStudent.student_id
        )
        .filter(
            SubjectStudent.subject_id ==
            subject_id
        )
        .all()
    )

    print(
        f"Subject {subject_id} has "
        f"{len(enrolled_students)} enrolled students"
    )

    for photo in photos:

        print(
            f"Processing photo: "
            f"{photo.filename}"
        )

        image_bytes = await photo.read()

        image_array = np.frombuffer(
            image_bytes,
            np.uint8
        )

        image_np = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

        if image_np is None:
            print(
                f"Could not decode "
                f"{photo.filename}"
            )
            continue

        print(
            "Image Shape:",
            image_np.shape
        )

        try:
            detected_faces = (
                get_face_embeddings(
                    image_np
                )
            )

            print(
                "Faces Detected:",
                len(detected_faces)
            )

        except Exception as e:
            print(
                "Face Extraction Error:",
                str(e)
            )
            continue

        for detected_embedding in detected_faces:

            best_student = None
            best_distance = float("inf")

            for student in enrolled_students:

                if student.face_embedding is None:
                    continue

                stored_embedding = np.asarray(
                    student.face_embedding,
                    dtype=np.float64
                )

                if (
                    stored_embedding.shape
                    != (128,)
                ):
                    print(
                        f"Invalid embedding "
                        f"for student "
                        f"{student.student_id}"
                    )
                    continue

                distance = np.linalg.norm(
                    detected_embedding -
                    stored_embedding
                )

                if distance < best_distance:
                    best_distance = distance
                    best_student = student

            print(
                "Best Distance:",
                best_distance
            )

            if (
                best_student is not None
                and best_distance < 0.6
            ):
                recognized_students.append(
                    best_student
                )

    unique_students = {
        s.student_id: s
        for s in recognized_students
    }.values()

    return {
        "recognized_students": [
            {
                "student_id": student.student_id,
                "name": student.name,
                "subject_id": subject_id,
                "is_present": True
            }
            for student in unique_students
        ]
    }


async def process_voice_attendance(
    subject_id,
    audio,
    db
):
    audio_bytes = await audio.read()

    detected_embedding = (
        get_voice_embedding(
            audio_bytes
        )
    )

    enrolled_students = (
        db.query(Student)
        .join(
            SubjectStudent,
            Student.student_id ==
            SubjectStudent.student_id
        )
        .filter(
            SubjectStudent.subject_id ==
            subject_id
        )
        .all()
    )

    recognized_students = []

    for student in enrolled_students:

        if student.voice_embedding is None:
            continue

        stored_embedding = np.asarray(
            student.voice_embedding,
            dtype=np.float64
        )
        if detected_embedding is None:
            return False
        distance = np.linalg.norm(detected_embedding - stored_embedding)

        if distance < 0.75:

            recognized_students.append(
                student
            )

    return {
        "recognized_students": [
            {
                "student_id": student.student_id,
                "name": student.name,
                "subject_id": subject_id,
                "is_present": True
            }
            for student in recognized_students
        ]
    }


async def submit_attendance_logs(
    request: AttendanceSubmitRequest,
    db
):
    saved_count = 0
    for student in request.students:
        existing = (
            db.query(AttendanceLog)
            .filter(
                AttendanceLog.subject_id == student.subject_id,
                AttendanceLog.student_id == student.student_id,
                AttendanceLog.timestamp >= datetime.utcnow().date()
            ).first()
        )

        # Update existing attendance
        if existing:
            existing.timestamp = datetime.utcnow()
            existing.is_present = student.is_present

            saved_count += 1
            continue
        # Create new attendance
        attendance = AttendanceLog(
            timestamp=datetime.utcnow(),
            subject_id=student.subject_id,
            student_id=student.student_id,
            is_present=student.is_present
        )
        db.add(attendance)
        saved_count += 1
    db.commit()
    return {
        "message": "Attendance Saved",
        "saved_count": saved_count
    }



async def get_attendance_records(
    teacher_id: int,
    db
):
    records = (
        db.query(
            AttendanceLog,
            Student.name.label(
                "student_name"
            ),
            Subject.name.label(
                "subject_name"
            )
        )
        .join(
            Student,
            AttendanceLog.student_id
            == Student.student_id
        )
        .join(
            Subject,
            AttendanceLog.subject_id
            == Subject.subject_id
        )
        .filter(
            Subject.teacher_id
            == teacher_id
        )
        .order_by(
            AttendanceLog.timestamp.desc()
        )
        .all()
    )

    result = []

    for (
        attendance,
        student_name,
        subject_name
    ) in records:

        ist_time = (
            attendance.timestamp
            .astimezone(
                ZoneInfo(
                    "Asia/Kolkata"
                )
            )
        )

        result.append({
            "student_id":
                attendance.student_id,

            "student_name":
                student_name,

            "subject_name":
                subject_name,

            "date":
                ist_time.strftime(
                    "%Y-%m-%d"
                ),

            "time":
                ist_time.strftime(
                    "%I:%M %p"
                ),

            "status":
                "Present"
                if attendance.is_present
                else "Absent"
        })

    return result