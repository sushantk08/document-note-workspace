from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.schemas.note import NoteCreate

from app.config import settings
from app.database import close_mongo_connection, connect_to_mongo, get_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for managing polymorphic markdown notes and metadata.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
    }


@app.get("/api/health/db", tags=["Health"])
async def database_health_check(db: AsyncIOMotorDatabase = Depends(get_database)):
    await db.command("ping")
    return {
        "database_status": "connected",
        "database_name": settings.DATABASE_NAME,
    }

@app.post("/api/test-schema", tags=["Debug"])
async def test_schema_endpoint(note: NoteCreate):
    return {"message": "Schema valid", "received_type": note.note_type, "data": note}