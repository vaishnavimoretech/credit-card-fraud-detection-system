from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

from .database import get_db

router = APIRouter()

SECRET_KEY = "change-this-to-a-random-secret-key-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # bcrypt supports passwords up to 72 bytes
    password_bytes = user.password.encode("utf-8")

    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password must be 72 bytes or less"
        )

    hashed_pw = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    ).decode("utf-8")

    query = text("""
        INSERT INTO users
        (username, email, hashed_password)
        VALUES
        (:username, :email, :hashed_password)
        RETURNING id
    """)

    try:
        result = db.execute(
            query,
            {
                "username": user.username,
                "email": user.email,
                "hashed_password": hashed_pw
            }
        )

        db.commit()

        new_id = result.fetchone()[0]

        return {
            "id": new_id,
            "username": user.username
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT
            id,
            username,
            email,
            hashed_password
        FROM users
        WHERE email = :email
    """)

    result = db.execute(
        query,
        {
            "email": user.email
        }
    ).fetchone()

    if not result:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    password_bytes = user.password.encode("utf-8")

    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password must be 72 bytes or less"
        )

    try:
        valid_password = bcrypt.checkpw(
            password_bytes,
            result[3].encode("utf-8")
        )
    except Exception:
        valid_password = False

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token_data = {
        "sub": result[1],
        "exp": datetime.utcnow()
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    }

    token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "success": True,
        "message": "Login successful",
        "username": result[1],
        "access_token": token,
        "token_type": "bearer"
    }