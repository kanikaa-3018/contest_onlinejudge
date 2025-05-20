let cachedHTML = "";
console.log("📩 Message received in background:", message.type);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEND_HTML") {
    cachedHTML = message.html;
    console.log("✅ HTML cached in background");
  } else if (message.type === "GET_HTML") {
    sendResponse({ html: cachedHTML });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("📦 Internship Tracker extension installed");
});
