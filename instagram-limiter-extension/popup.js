document.getElementById("setTimer").addEventListener("click", () => {
  const time = parseInt(document.getElementById("timeInput").value, 10);
  if (!isNaN(time) && time > 0) {
    chrome.runtime.sendMessage(
      { action: "setTimer", time: time },
      (response) => {
        if (response.status === "Timer set successfully") {
          alert(`Timer set for ${time} minutes.`);
        }
      }
    );
  } else {
    alert("Please enter a valid number of minutes.");
  }
});
