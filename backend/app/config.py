from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    DATABASE_URL: str = "sqlite:///./resolveai.db"
    AI_PROVIDER: str = "mock"  # "mock" or "llm"
    AI_API_KEY: str = ""
    AI_MODEL: str = "gpt-4o-mini"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

settings = Settings()
