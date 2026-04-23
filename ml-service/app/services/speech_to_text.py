import os
from deepgram import DeepgramClient

# Get API key from environment
api_key = os.getenv("DEEPGRAM_API_KEY")

if not api_key:
    raise ValueError("Deepgram API key missing!")

# Correct initialization (NO direct parameter)
deepgram = DeepgramClient()

def transcribe_audio(file_path):

    with open(file_path, "rb") as audio:
        response = deepgram.listen.prerecorded.v("1").transcribe_file(
            {"buffer": audio.read()},
            {"punctuate": True}
        )

    return response["results"]["channels"][0]["alternatives"][0]["transcript"]