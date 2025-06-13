document.getElementById("results-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("learner-name").value.trim();
  const subject = document.getElementById("subject").value;
  const marks = parseInt(document.getElementById("marks").value);

  if (!name || !subject || isNaN(marks)) {
    showMessage("Please fill all fields correctly.", "error");
    return;
  }

  try {
    const response = await fetch('/marks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subject, marks }),
    });

    const data = await response.json();
    if (response.ok) {
      showMessage(data.message, "success");
      document.getElementById("results-form").reset();
    } else {
      showMessage(data.error || "Error saving marks.", "error");
    }
  } catch (error) {
    showMessage("Server error occurred.", "error");
    console.error(error);
  }
});

function showMessage(message, type) {
  const msgDiv = document.getElementById("message");
  msgDiv.textContent = message;
  msgDiv.style.color = type === "success" ? "green" : "red";
}
