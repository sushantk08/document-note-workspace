from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config import settings
from app.database import close_mongo_connection, connect_to_mongo, get_database
from app.routers import notes


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
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

# Register routers
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])


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