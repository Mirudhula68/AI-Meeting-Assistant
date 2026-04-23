from deepgram import Deepgram
import asyncio

DEEPGRAM_API_KEY = "046d743f4fe4825bf73d25fc47514d320624ea41"

async def transcribe_audio(file_path):
    dg_client = Deepgram(DEEPGRAM_API_KEY)

    with open(file_path, "rb") as audio:
        source = {"buffer": audio, "mimetype": "audio/wav"}

        response = await dg_client.transcription.prerecorded(
            source,
            {"punctuate": True}
        )

    return response["results"]["channels"][0]["alternatives"][0]["transcript"]