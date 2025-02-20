// Default timer duration (in minutes)
const DEFAULT_TIMER = 15;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ timer: DEFAULT_TIMER });
  console.log(`Default timer set to ${DEFAULT_TIMER} minutes.`);
});

// Function to start the timer
function startTimer() {
  chrome.storage.sync.get("timer", (data) => {
    chrome.alarms.clearAll(() => {
      chrome.alarms.create("clearSocialMediaCache", {
        delayInMinutes: data.timer || DEFAULT_TIMER,
      });
      console.log(`Timer started for ${data.timer || DEFAULT_TIMER} minutes.`);
    });
  });
}

// Automatically start timer on login (by detecting login URLs)
chrome.webRequest.onCompleted.addListener(
  () => {
    startTimer();
  },
  {
    urls: [
      "*://www.instagram.com/accounts/login/*",
      "*://www.snapchat.com/login/*",
    ],
  }
);

// Clear cache when alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "clearSocialMediaCache") {
    chrome.browsingData.remove(
      {
        origins: ["https://www.instagram.com", "https://www.snapchat.com"],
      },
      {
        cache: true,
        cookies: true,
      },
      () => {
        console.log("Instagram and Snapchat cache cleared!");
      }
    );
  }
});

// Listen for timer update from settings
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateTimer") {
    chrome.storage.sync.set({ timer: request.time }, () => {
      console.log(`Timer updated to ${request.time} minutes.`);
      sendResponse({ status: "Timer updated successfully" });
    });
  }
  return true;
});
