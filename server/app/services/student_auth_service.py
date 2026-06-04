from fastapi import (
    UploadFile,
    HTTPException
)
from sqlalchemy.orm import Session
from app.models.student import Student
import numpy as np
from app.ml.face_service import (get_face_embeddings)
from app.ml.voice_service import (get_voice_embedding)
import cv2

def bytes_to_image(image_bytes):
    image_array = np.frombuffer(
        image_bytes,
        np.uint8
    )
    image_np = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )
    if image_np is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid image file"
        )
    return image_np

# --------------------------------------------------
# Register Student
# --------------------------------------------------
async def register_student(
    db: Session,
    name: str,
    photo: UploadFile,
    voice: UploadFile
):
    if len(name.strip()) == 0:
        raise HTTPException(status_code=400,detail="Name is required")
    
    photo_bytes = await photo.read()
    #print("Photo Bytes:", len(photo_bytes))
    voice_bytes = await voice.read()
    #print("Voice Bytes:", len(voice_bytes))
    image_np = bytes_to_image(photo_bytes)
    #print("Image Shape:", image_np.shape)
    current_embeddings = get_face_embeddings(image_np)
    #cv2.imwrite("debug_face.png", image_np)
    # print("Photo Bytes:", len(photo_bytes))
    # print("Voice Bytes:", len(voice_bytes))
    # print("Photo Filename:", photo.filename)
    # print("Photo Content Type:", photo.content_type)
    # print("Voice Filename:", voice.filename)
    # print("Voice Content Type:", voice.content_type)
    if (
        current_embeddings is None or
        len(current_embeddings) == 0
    ):
        raise HTTPException(
            status_code=400,
            detail="Face not detected"
        )

    if len(current_embeddings) != 1:
        raise HTTPException(
            status_code=400,
            detail="Exactly one face must be present"
        )
    face_embedding = current_embeddings[0]

    voice_embedding = get_voice_embedding(
        voice_bytes,
        filename=voice.filename
    )
    if voice_embedding is None:
        raise HTTPException(
            status_code=400,
            detail="Voice not detected"
        )
    # Prevent Duplicate Registration

    students = db.query(Student).all()
    for existing_student in students:
        embedding_data = (
            existing_student.face_embedding
        )
        if embedding_data is None:
            continue

        stored_embedding = np.array(
            embedding_data,
            dtype=np.float64
        )
        if stored_embedding.shape != (128,):
            continue
        distance = np.linalg.norm(
            face_embedding -
            stored_embedding
        )
        if distance < 0.55:
            raise HTTPException(
                status_code=400,
                detail="Student already registered"
            )
    # Save Student
    student = Student(
    name=name,
    face_embedding=np.asarray(face_embedding, dtype=np.float64).tolist(),
    voice_embedding=np.asarray(voice_embedding, dtype=np.float64).tolist()
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return {
        "success": True,
        "student_id": student.student_id,
        "message": "Student registered successfully"
    }


# Face Login
async def login_by_face(
    db: Session,
    photo: UploadFile
):
    photo_bytes = await photo.read()
    image_np = bytes_to_image(photo_bytes)
    current_embeddings = get_face_embeddings(image_np)

    if (
        current_embeddings is None or
        len(current_embeddings) == 0
    ):
        raise HTTPException(
            status_code=400,
            detail="No face detected"
        )
    if len(current_embeddings) != 1:
        raise HTTPException(
            status_code=400,
            detail="Exactly one face must be present"
        )
    current_embedding = current_embeddings[0]
    students = db.query(
        Student
    ).all()

    best_student = None
    best_distance = float("inf")
    for student in students:
        if student.face_embedding is None:
            continue
        stored_embedding = np.array(
            student.face_embedding,
            dtype=np.float64
        )
        if stored_embedding.shape != (128,):
            continue
        distance = np.linalg.norm(
            current_embedding -
            stored_embedding
        )
        if distance < best_distance:
            best_distance = distance
            best_student = student

    FACE_THRESHOLD = 0.55

    if (
        best_student is not None and
        best_distance < FACE_THRESHOLD
    ):
        return {
            "success": True,
            "student": {
                "student_id": best_student.student_id,
                "name": best_student.name
            }
        }
    return {
        "success": False,
        "message": "Face not recognized"
    }