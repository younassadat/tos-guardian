// Content script: detects ToS pages and extracts text

(function () {
  const TOS_KEYWORDS = [
    "terms of service", "terms of use", "terms and conditions",
    "user agreement", "privacy policy", "end user license",
    "legal agreement", "conditions of use", "acceptable use policy"
  ];

  function isTosPage() {
    const title = document.title.toLowerCase();
    const url = window.location.href.toLowerCase();
    const h1s = Array.from(document.querySelectorAll("h1, h2")).map(el => el.textContent.toLowerCase());

    return TOS_KEYWORDS.some(kw =>
      title.includes(kw) || url.includes(kw.replace(/ /g, '-')) || url.includes(kw.replace(/ /g, '_')) ||
      h1s.some(h => h.includes(kw))
    );
  }

  function extractTosText() {
    // Try to find the main content area
    const selectors = [
      'main', 'article', '.terms', '.tos', '.legal', '#terms',
      '#tos', '[class*="terms"]', '[class*="legal"]', '[id*="terms"]',
      '.content', '#content', '.container', '#main'
    ];

    let bestEl = null;
    let bestLen = 0;

    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        const len = el.innerText?.length || 0;
        if (len > bestLen) {
          bestLen = len;
          bestEl = el;
        }
      }
    }

    // Fallback to body
    const source = bestEl || document.body;
    return source.innerText
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkPage") {
      const detected = isTosPage();
      const text = detected ? extractTosText() : extractTosText(); // Always extract, let user decide
      sendResponse({
        isTosPage: detected,
        text: text.substring(0, 12000),
        url: window.location.href,
        title: document.title
      });
    }
    return true;
  });

  // Auto-detect and badge the extension icon
  if (isTosPage()) {
    chrome.runtime.sendMessage({ action: "tosDetected", url: window.location.href });
  }
})();
