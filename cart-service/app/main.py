from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.models import cart  # noqa: F401 - ensures models are registered before create_all
from app.routers.cart import router as cart_router

app = FastAPI(
    title="Cart Service",
    description="Shopping cart microservice for the e-commerce platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Creates tables if they do not already exist. For production use proper
    # migrations (e.g. Alembic) instead of create_all.
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "UP", "service": "cart-service"}


app.include_router(cart_router)
