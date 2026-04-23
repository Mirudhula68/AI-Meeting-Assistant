from fastapi import APIRouter, UploadFile, File
import shutil

from app.services.speech_to_text import transcribe_audio
from app.services.summarizer import generate_meeting_summary

router = APIRouter()


@router.post("/process-audio")
def process_audio(file: UploadFile = File(...)):

    file_path = f"temp/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # STEP 1: Speech to text
    transcript = transcribe_audio(file_path)

    # STEP 2: AI meeting analysis
    summary = generate_meeting_summary(transcript)

    return {
    "transcript": transcript,
    "summary": summary if isinstance(summary, dict) else {"summary": summary}
}