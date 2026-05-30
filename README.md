# 🛡️ ToS Guardian — Chrome Extension

Instantly understand any Terms of Service. Red flags, trust scores, and plain-English summaries — powered by Claude AI.

---

## 🚀 Installation (Developer Mode)

Since this extension isn't published to the Chrome Web Store yet, install it in developer mode:

### Step 1 — Add your Anthropic API Key

Open `background.js` and find this line near the top of the `analyzeTosWithClaude` function:

The extension calls the Anthropic API directly. You need to set up your API key in Chrome's local storage, OR embed it temporarily for testing.

**For quick testing**, add this line at the top of `background.js`:
```js
const ANTHROPIC_API_KEY = "sk-ant-your-key-here";
```

Then update the fetch headers to:
```js
"x-api-key": ANTHROPIC_API_KEY,
"anthropic-version": "2023-06-01",
```

> **Note**: For production, use a backend proxy so your API key isn't exposed in the extension.

---

### Step 2 — Load the Extension

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `tos-guardian` folder
5. The extension should appear with the purple shield icon ✅

---

### Step 3 — Use It!

1. Navigate to any website's Terms of Service page
2. Click the 🛡️ ToS Guardian icon in your Chrome toolbar
3. Click **"Analyze Terms of Service"**
4. Wait ~10-15 seconds for Claude to analyze the document
5. Review your trust score, red flags, and summary!

---

## 📁 File Structure

```
tos-guardian/
├── manifest.json        # Extension config
├── background.js        # Claude AI API calls (service worker)
├── content.js           # Page text extraction
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── popup/
    ├── popup.html       # Extension UI
    └── popup.js         # UI logic & state management
```

---

## 🔧 Features

- **Trust Score (0–100)** — Overall safety rating with color-coded ring
- **Red Flag Detection** — Highlights sneaky clauses with severity levels (High / Medium / Low)
- **Plain-English Summary** — What the ToS actually means for you
- **Critical Alerts** — Urgent warnings for truly problematic terms
- **Category Ratings** — Data collection, third-party sharing, user rights, cancellation difficulty
- **User-Friendly Clauses** — Highlights the good stuff too
- **Results Caching** — Re-opening the popup shows cached results instantly

---

## 🛡️ Privacy

- ToS text is sent to Anthropic's API for analysis
- No data is stored on any server beyond the API call
- Results are cached locally in Chrome storage per URL

---

## 🔮 Roadmap Ideas

- [ ] Auto-detect ToS links and pre-analyze before you click
- [ ] Historical comparison ("this ToS changed!")  
- [ ] Community trust scores database
- [ ] Firefox support
- [ ] Side panel mode for reading ToS alongside the analysis
