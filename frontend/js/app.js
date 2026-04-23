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

    const data = await response.json();

    document.getElementById("status").innerText = "Done ✔";

    // 📄 Transcript
    document.getElementById("transcript").innerText = data.transcript;

    // 🧠 Summary
    document.getElementById("summary").innerText = data.summary.summary;

    // 📌 Lists
    fillList("keyPoints", data.summary.key_points);
    fillList("issues", data.summary.issues);
    fillList("actions", data.summary.action_items);
    fillList("decisions", data.summary.decisions);

  } catch (error) {
    console.log(error);
    document.getElementById("status").innerText = "Error processing file";
  }
}


// 📌 Helper function for lists
function fillList(id, items) {
  const list = document.getElementById(id);
  list.innerHTML = "";

  if (!items) return;

  items.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    list.appendChild(li);
  });
}


// 📄 PDF DOWNLOAD FUNCTION
document.getElementById("downloadPdfBtn").addEventListener("click", () => {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const transcript = document.getElementById("transcript").innerText;
    const summary = document.getElementById("summary").innerText;
    const keyPoints = document.getElementById("keyPoints").innerText;
    const issues = document.getElementById("issues").innerText;
    const actions = document.getElementById("actions").innerText;
    const decisions = document.getElementById("decisions").innerText;

    let y = 15;
    const pageHeight = 280;

    function addText(title, content) {

        if (y > pageHeight) {
            doc.addPage();
            y = 15;
        }

        doc.setFontSize(14);
        doc.text(title, 10, y);
        y += 8;

        doc.setFontSize(10);

        const lines = doc.splitTextToSize(content, 180);

        lines.forEach(line => {

            if (y > pageHeight) {
                doc.addPage();
                y = 15;
            }

            doc.text(line, 10, y);
            y += 6;
        });

        y += 6;
    }

    doc.setFontSize(16);
    doc.text("AI Meeting Report", 10, y);
    y += 12;

    addText("SUMMARY", summary);
    addText("KEY POINTS", keyPoints);
    addText("ISSUES", issues);
    addText("ACTION ITEMS", actions);
    addText("DECISIONS", decisions);
    addText("TRANSCRIPT", transcript);

    doc.save("meeting-report.pdf");
});