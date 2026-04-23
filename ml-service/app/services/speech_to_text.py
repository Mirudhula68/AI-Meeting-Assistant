from deepgram import DeepgramClient, PrerecordedOptions

DEEPGRAM_API_KEY = "046d743f4fe4825bf73d25fc47514d320624ea41"

def transcribe_audio(file_path):
    dg_client = DeepgramClient(DEEPGRAM_API_KEY)

    with open(file_path, "rb") as audio:
        response = dg_client.listen.prerecorded.v("1").transcribe_file(
            {"buffer": audio.read()},
            PrerecordedOptions(punctuate=True)
        )

    return response["results"]["channels"][0]["alternatives"][0]["transcript"]