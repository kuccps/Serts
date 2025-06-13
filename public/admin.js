async function loadResults() {
  const tableBody = document.querySelector("#results-table tbody");
  tableBody.innerHTML = "";
  try {
    const res = await fetch("/results");
    const data = await res.json();
    data.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${item.name}</td><td>${item.total}</td><td>${item.rank}</td>`;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading results", err);
  }
}

document.getElementById("download-btn").addEventListener("click", async () => {
  const password = prompt("Enter password to download:");
  if (password !== "361087") {
    alert("❌ Wrong password");
    const audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
    audio.play();
    return;
  }

  const res = await fetch("/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  if (res.ok) {
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Igumori_Results.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    alert("Failed to download file.");
  }
});

window.onload = loadResults;
