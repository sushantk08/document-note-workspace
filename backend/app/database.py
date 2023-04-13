from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings


class DatabaseManager:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


db_manager = DatabaseManager()


async def connect_to_mongo():
    """Initializes the MongoDB client and verifies connection with a ping."""
    db_manager.client = AsyncIOMotorClient(settings.MONGO_URI)
    db_manager.db = db_manager.client[settings.DATABASE_NAME]
    # Ping the database to verify active credentials and connectivity
    await db_manager.client.admin.command("ping")
    print(f"Connected to MongoDB database: {settings.DATABASE_NAME}")


async def close_mongo_connection():
    """Closes the MongoDB connection pool."""
    if db_manager.client:
        db_manager.client.close()
        print("Closed MongoDB connection pool.")


def get_database() -> AsyncIOMotorDatabase:
    """Dependency provider returning the active database instance."""
    if db_manager.db is None:
        raise RuntimeError("Database is not initialized.")
    return db_manager.db