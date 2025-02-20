document.getElementById("setTimerButton").addEventListener("click", () => {
  const time = parseInt(document.getElementById("timerInput").value, 10);
  if (!isNaN(time) && time > 0) {
    chrome.runtime.sendMessage(
      { action: "updateTimer", time: time },
      (response) => {
        if (response && response.status === "Timer updated successfully") {
          alert(`Timer updated to ${time} minutes.`);
        }
      }
    );
  } else {
    alert("Please enter a valid number greater than 0.");
  }
});
