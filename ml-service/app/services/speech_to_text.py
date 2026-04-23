import whisper

model = whisper.load_model("tiny")  # small model (fast)

def transcribe_audio(file_path):
    model = whisper.load_model("tiny")  # ✅ load inside function
    result = model.transcribe(file_path)
    return result["text"]