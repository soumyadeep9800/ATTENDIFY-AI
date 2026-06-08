# Face Recognition Service
import dlib
import numpy as np
import face_recognition_models

from sklearn.svm import SVC
from sqlalchemy.orm import Session

from app.models.student import Student


# --------------------------------------------------
# Load Dlib Models Once
# --------------------------------------------------

detector = dlib.get_frontal_face_detector() # pyright: ignore[reportAttributeAccessIssue]

shape_predictor = dlib.shape_predictor(   # pyright: ignore[reportAttributeAccessIssue]
    face_recognition_models.pose_predictor_model_location()
)

face_rec_model = dlib.face_recognition_model_v1(   # pyright: ignore[reportAttributeAccessIssue]
    face_recognition_models.face_recognition_model_location()
)


# --------------------------------------------------
# Generate Face Embeddings
# --------------------------------------------------

def get_face_embeddings(image_np):
    faces = detector(image_np, 1)
    encodings = []
    for face in faces:
        shape = shape_predictor(image_np, face)
        embedding = face_rec_model.compute_face_descriptor(
            image_np,
            shape,
            1
        )
        encodings.append(
            np.array(embedding, dtype=np.float64)
        )
    return encodings


# --------------------------------------------------
# Train SVM Classifier
# --------------------------------------------------

# def train_classifier(db: Session):
#     X = []
#     y = []
#     students = db.query(Student).all()

#     for student in students:
#         if student.face_embedding is None:
#             continue
#         embedding = np.asarray(
#             student.face_embedding,
#             dtype=np.float64
#         )
#         # FaceNet / Dlib embedding must be 128 dimensions
#         if embedding.shape != (128,):
#             continue
#         X.append(embedding)
#         y.append(
#             student.student_id
#         )

#     if len(X) == 0:
#         return None

#     X_train = np.array(X)
#     y_train = np.array(y)

#     unique_students = set(y)

#     # Only one registered student
#     if len(unique_students) < 2:

#         return {
#             "clf": None,
#             "X": X_train,
#             "y": list(y_train)
#         }

#     clf = SVC(
#         kernel="linear",
#         probability=True,
#         class_weight="balanced"
#     )

#     clf.fit(X_train, y_train)

#     return {
#         "clf": clf,
#         "X": X_train,
#         "y": list(y_train)
#     }


# # --------------------------------------------------
# # Predict Attendance
# # --------------------------------------------------

# def predict_attendance(
#     image_np,
#     db: Session
# ):
#     detected_students = {}

#     encodings = get_face_embeddings(image_np)

#     model_data = train_classifier(db)

#     if model_data is None:
#         return detected_students

#     clf = model_data["clf"]
#     X_train = model_data["X"]
#     y_train = model_data["y"]

#     all_students = sorted(
#         list(set(y_train))
#     )

#     if len(all_students) == 0:
#         return detected_students

#     for encoding in encodings:

#         # --------------------------
#         # Predict Student
#         # --------------------------

#         if clf is not None:

#             predicted_id = int(
#                 clf.predict(
#                     encoding.reshape(1, -1)
#                 )[0]
#             )

#         else:

#             predicted_id = int(
#                 all_students[0]
#             )

#         # --------------------------
#         # Distance Verification
#         # --------------------------

#         if predicted_id not in y_train:
#             continue
#         idx = y_train.index(predicted_id)

#         stored_embedding = X_train[idx]

#         distance = np.linalg.norm(
#             stored_embedding - encoding
#         )

#         threshold = 0.6

#         if distance <= threshold:

#             detected_students[
#                 predicted_id
#             ] = True

#     return detected_students