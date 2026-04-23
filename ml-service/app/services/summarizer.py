from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_NAME = "sshleifer/distilbart-cnn-12-6"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)


def generate_meeting_summary(transcript: str):

    # STEP 1: AI summary
    input_text = "summarize: " + transcript

    inputs = tokenizer(
        input_text,
        return_tensors="pt",
        truncation=True,
        max_length=1024
    )

    outputs = model.generate(
        inputs["input_ids"],
        max_length=150,
        min_length=50
    )

    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # STEP 2: STRUCTURE IT (IMPORTANT PART)
    return {
        "summary": summary,
        "key_points": extract_points(transcript),
        "issues": extract_issues(transcript),
        "action_items": extract_actions(transcript),
        "decisions": extract_decisions(transcript)
    }


# -------------------------
# SIMPLE NLP HELPERS
# -------------------------

def clean_sentences(text):
    return [s.strip() for s in text.split(".") if len(s.strip()) > 40]


def extract_points(text):
    sentences = clean_sentences(text)

    # remove greetings / filler
    skip_words = ["all right", "let's", "good work", "thanks", "excellent"]

    return [
        s for s in sentences
        if not any(w in s.lower() for w in skip_words)
    ][:5]


def extract_issues(text):
    sentences = clean_sentences(text)

    keywords = ["issue", "problem", "bug", "error", "fail", "trouble"]

    return [
        s for s in sentences
        if any(k in s.lower() for k in keywords)
    ]


def extract_actions(text):
    sentences = clean_sentences(text)

    keywords = ["need to", "will", "assign", "fix", "implement", "ensure"]

    return [
        s for s in sentences
        if any(k in s.lower() for k in keywords)
    ]


def extract_decisions(text):
    sentences = clean_sentences(text)

    keywords = ["decided", "agree", "finalize", "plan", "we will"]

    return [
        s for s in sentences
        if any(k in s.lower() for k in keywords)
    ]