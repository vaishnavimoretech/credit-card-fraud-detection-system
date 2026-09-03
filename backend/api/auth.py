from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

from .database import get_db

router = APIRouter()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

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
    hashed_pw = pwd_context.hash(
        user.password
    )

    query = text("""
        INSERT INTO users
        (username, email, hashed_password)
        VALUES
        (:username, :email, :hashed_password)
        RETURNING id
    """)

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

    if not pwd_context.verify(
        user.password,
        result[3]
    ):
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