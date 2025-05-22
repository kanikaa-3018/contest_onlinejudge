document.getElementById("saveBtn").addEventListener("click", () => {
  const statusElem = document.getElementById("status");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      statusElem.textContent = "⚠️ No active tab found.";
      return;
    }

    const tabId = tabs[0].id;

    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => document.documentElement.outerHTML
      },
      async (results) => {
        if (!results || !results[0] || !results[0].result) {
          statusElem.textContent = "⚠️ Could not extract HTML.";
          return;
        }

        const html = results[0].result;

        try {
          const response = await fetch("http://localhost:8080/api/internships/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html })
          });

          if (response.ok) {
            const result = await response.json();
            statusElem.textContent = "✅ Internship saved successfully!";
            console.log("Backend response:", result);
          } else {
            const error = await response.json();
            statusElem.textContent = `❌ Failed: ${error.message}`;
            console.error("Backend error:", error);
          }
        } catch (err) {
          console.error("Fetch error:", err);
          statusElem.textContent = "⚠️ Could not connect to backend.";
        }
      }
    );
  });
});
