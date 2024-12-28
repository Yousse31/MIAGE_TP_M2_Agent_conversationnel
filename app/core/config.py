from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    mongodb_uri: str
    database_name: str
    collection_name: str

    class Config:
        env_file = ".env"

settings = Settings()
