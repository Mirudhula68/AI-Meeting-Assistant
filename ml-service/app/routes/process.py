from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services.speech_to_text import transcribe_audio
from app.services.summarizer import generate_meeting_summary

router = APIRouter()

# ensure temp folder exists
os.makedirs("temp", exist_ok=True)

@router.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):

    file_path = f"temp/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # STEP 1: Speech to text
    transcript = transcribe_audio(file_path)

    # STEP 2: AI summary
    summary = generate_meeting_summary(transcript)

    return {
        "transcript": transcript,
        "summary": summary if isinstance(summary, dict) else {
            "summary": summary,
            "key_points": [],
            "issues": [],
            "action_items": [],
            "decisions": []
        }
    }