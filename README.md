# AI Meeting Assistant

This project consists of three main components that work together to transcribe meeting audio and generate insights.

## Prerequisites
- Python 3.9+
- Java 17+
- Maven (or use the provided `mvnw` wrapper)

---

## 1. ML Service (Python)
The ML service handles audio transcription via OpenAI Whisper and generates summaries.

```bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*The service will be available at `http://localhost:8000`.*

---

## 2. Backend Gateway (Java)
The Java backend acts as an API gateway, proxying requests from the frontend to the ML service.

```bash
cd backend-java
./mvnw.cmd spring-boot:run
```
*The gateway will be available at `http://localhost:8080`.*

---

## 3. Frontend
The frontend is a static web application.

- Simply open `frontend/index.html` in your preferred web browser.
- Select an audio file and click "Upload and Process".

---

## Architecture Flow
1. **Frontend** sends audio file to **Java Backend** (`:8080`).
2. **Java Backend** proxies the file to **ML Service** (`:8000`).
3. **ML Service** transcribes, summarizes, and returns JSON.
4. **Java Backend** forwards the JSON response to the **Frontend**.
