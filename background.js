// Background service worker for ToS Guardian
// Routes through secure Railway backend — API key never exposed in extension

const BACKEND_URL = "https://tos-guardian-backend-production.up.railway.app";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeTos") {
    analyzeTosWithGroq(request.text, request.url)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep message channel open for async response
  }
});

async function analyzeTosWithGroq(tosText, pageUrl) {
  // Allow up to 16000 chars
  const truncated = tosText.length > 16000
    ? tosText.substring(0, 16000) + "\n\n[...document truncated for analysis...]"
    : tosText;

  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: truncated,
      url: pageUrl
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || `Backend error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
