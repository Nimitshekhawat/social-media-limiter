// Default timer duration (in minutes) - Change this value as needed
const DEFAULT_TIMER = 10; // Example: 1 minute for testing

// ✅ Automatically start the timer when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log(
    `Extension installed. Default timer set to ${DEFAULT_TIMER} minutes.`
  );
});

// ✅ Function to start the timer
function startTimer() {
  chrome.alarms.clearAll(() => {
    chrome.alarms.create("clearSocialMediaCache", {
      delayInMinutes: DEFAULT_TIMER,
    });
    console.log(`Timer started for ${DEFAULT_TIMER} minutes.`);
  });
}

// ✅ Detect login or already logged-in users and start timer
chrome.webNavigation.onCompleted.addListener((details) => {
  if (
    details.url.includes("https://www.instagram.com/accounts/login/") || // Instagram login
    details.url.includes("https://www.instagram.com/") || // Already logged in
    details.url.includes("https://www.snapchat.com/login/") || // Snapchat login
    details.url.includes("https://www.snapchat.com/") // Already logged in
  ) {
    console.log(`Detected visit: ${details.url}`);
    startTimer();
  }
});

// ✅ Clear cookies and cache when timer ends
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "clearSocialMediaCache") {
    console.log(`Alarm triggered: ${alarm.name}`);
    chrome.browsingData.removeCookies(
      {
        origins: ["https://www.instagram.com", "https://www.snapchat.com"],
      },
      () => {
        console.log("Cookies removed - User logged out");
      }
    );

    chrome.browsingData.removeCache({}, () => {
      console.log("Cache removed");
    });
  }
});
