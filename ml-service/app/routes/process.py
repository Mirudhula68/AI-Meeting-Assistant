from fastapi import APIRouter, UploadFile, File
import shutil
import os
import tempfile
import asyncio

from app.services.speech_to_text import transcribe_audio
from app.services.summarizer import generate_meeting_summary

router = APIRouter()

@router.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    # Use a secure temporary file
    # We use delete=False because on Windows, another process (ffmpeg/whisper) 
    # cannot open the file if it's still open in Python.
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}")
    file_path = tmp.name
    
    try:
        # Save uploaded file and close immediately to release the lock
        try:
            shutil.copyfileobj(file.file, tmp)
            tmp.flush()
        finally:
            tmp.close()
        
        # STEP 1: Speech to text (Threaded to avoid blocking event loop)
        transcript = await asyncio.to_thread(transcribe_audio, file_path)

        # STEP 2: AI summary (Threaded to avoid blocking event loop)
        summary = await asyncio.to_thread(generate_meeting_summary, transcript)

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
    except Exception as e:
        print(f"Error processing audio: {e}")
        return {"error": str(e)}
    finally:
        # Always cleanup the temp file
        if os.path.exists(file_path):
            os.remove(file_path)