async function uploadAudio() {

  const fileInput = document.getElementById("audioFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an audio file");
    return;
  }

  document.getElementById("status").innerText = "Processing...";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/process-audio", {
      method: "POST",
      body: formData
    });

    // 🔥 IMPORTANT: handle backend errors properly
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const data = await response.json();

    document.getElementById("status").innerText = "Done ✔";

    // transcript
    document.getElementById("transcript").innerText = data.transcript || "";

    // summary (safe access)
    const summary = data.summary || {};

    document.getElementById("summary").innerText =
      summary.summary || "";

    fillList("keyPoints", summary.key_points || []);
    fillList("issues", summary.issues || []);
    fillList("actions", summary.action_items || []);
    fillList("decisions", summary.decisions || []);

  } catch (error) {
    console.error("FULL ERROR:", error);
    document.getElementById("status").innerText = error.message;
  }
}