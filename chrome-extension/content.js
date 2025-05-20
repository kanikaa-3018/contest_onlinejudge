const html = document.documentElement.outerHTML;
console.log("🔍 Sending HTML to background...");
chrome.runtime.sendMessage({ type: "SEND_HTML", html }, (response) => {
  if (chrome.runtime.lastError) {
    console.error("Content script error:", chrome.runtime.lastError.message);
  } else {
    console.log("✅ HTML sent to background.");
  }
});
