from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Document & Note Management Workspace"
    MONGO_URI: str = (
        "mongodb://devuser:devpassword@localhost:27017/note_workspace_db?authSource=admin"
    )
    DATABASE_NAME: str = "note_workspace_db"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()