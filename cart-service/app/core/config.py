from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    All configuration is sourced from environment variables (optionally via a
    local .env file that is NEVER committed - see .env.example). Nothing here
    is hardcoded.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    server_port: int = 8000

    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "cart_db"
    db_user: str
    db_password: str

    # Must be identical to the JWT_SECRET configured in auth-service.
    jwt_secret: str
    jwt_algorithm: str = "HS256"

    cors_allowed_origins: str = "http://localhost:3000"

    # Base URL of product-service, used to validate product data when adding to cart.
    product_service_url: str = "http://localhost:8082"

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",")]


settings = Settings()
