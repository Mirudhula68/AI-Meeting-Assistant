from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import process

app = FastAPI()

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Router prefix MUST match frontend
app.include_router(process.router, prefix="/api/audio")
