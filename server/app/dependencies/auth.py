from typing import cast
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)
from dotenv import load_dotenv
import os
load_dotenv()

SECRET_KEY = cast(str, os.getenv("SECRET_KEY"))
ALGORITHM = "HS256"

security = HTTPBearer()

def get_current_teacher(
    token: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        payload = jwt.decode(
            token.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        teacher_id = payload.get("teacher_id")

        if teacher_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return teacher_id

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )