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
    const response = await fetch("http://localhost:8080/api/audio/upload", {
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

// --- HELPER FUNCTIONS ---

function fillList(elementId, items) {
  const ul = document.getElementById(elementId);
  if (!ul) return;
  ul.innerHTML = "";
  
  if (!items || items.length === 0) {
    ul.innerHTML = "<li>None</li>";
    return;
  }
  
  items.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    ul.appendChild(li);
  });
}

// --- PDF EXPORT ---
document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  if (!window.jspdf) {
    alert("PDF library not loaded yet.");
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 10;
  const pageWidth = 190;

  // Helper for text wrapping & position tracking
  const addText = (text, fontSize, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    
    // Split text to fit width
    const splitText = doc.splitTextToSize(text, pageWidth - margin);
    
    // Check for page break
    if (yPos + (splitText.length * (fontSize * 0.5)) > 280) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(splitText, margin, yPos);
    yPos += (splitText.length * (fontSize * 0.4)) + 5;
  };

  // 1. Title
  addText("AI Meeting Report", 22, true);
  yPos += 5;

  // 2. Summary
  addText("SUMMARY", 14, true);
  const summaryText = document.getElementById("summary").innerText || "No summary available.";
  addText(summaryText, 11);
  yPos += 5;

  // 3. Sections Helper
  const addListSection = (title, elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    addText(title, 14, true);
    const items = Array.from(el.querySelectorAll("li")).map(li => li.innerText);
    
    if (items.length === 0 || (items.length === 1 && items[0] === "None")) {
      addText("None", 11);
    } else {
      items.forEach(item => {
        addText(item, 11);
      });
    }
    yPos += 5;
  };

  addListSection("KEY POINTS", "keyPoints");
  addListSection("ISSUES", "issues");
  addListSection("ACTION ITEMS", "actions");
  addListSection("DECISIONS", "decisions");

  // 4. Transcript (at the end)
  addText("TRANSCRIPT", 14, true);
  const transcriptText = document.getElementById("transcript").innerText || "No transcript available.";
  addText(transcriptText, 10);

  doc.save("AI_Meeting_Report.pdf");
});