# 🛡️ TOS Guardian

> Instantly understand any Terms of Service. Trust scores, red flag detection, and plain-English summaries — powered by Groq + Llama AI.

![Version](https://img.shields.io/badge/version-1.0.0-6929C4?style=flat-square)
![Manifest](https://img.shields.io/badge/manifest-v3-3776AB?style=flat-square)
![Status](https://img.shields.io/badge/status-active-1D9E75?style=flat-square)

---

## What It Does

Most people never read Terms of Service — they're long, written in legal jargon, and designed to be ignored. TOS Guardian fixes that. Click the extension on any ToS page and get a clear breakdown in seconds.

- **Trust Score (0–100)** — color-coded safety rating at a glance
- **Red Flag Detection** — sneaky clauses flagged by severity (High / Medium / Low)
- **Plain-English Summary** — what the ToS actually means for you
- **Critical Alerts** — urgent warnings for truly problematic terms
- **Category Ratings** — data collection, third-party sharing, user rights, cancellation difficulty
- **User-Friendly Clauses** — highlights the good parts too
- **Results Caching** — re-opening shows cached results instantly, no re-analysis needed

---

## How It Works

```
Browser Page
     │
     ▼
content.js          — detects ToS pages, extracts text (up to 12,000 chars)
     │
     ▼
background.js       — sends text to backend via secure proxy
     │
     ▼
Railway Backend     — calls Groq API (Llama) for analysis
     │
     ▼
popup/popup.js      — renders trust score, flags, and summary in the UI
```

The API key lives on the backend — never exposed in the extension itself.

---

## Installation (Developer Mode)

Since this isn't on the Chrome Web Store yet, install manually:

1. Clone or download this repo
2. Open Chrome → `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** → select the `tos-guardian` folder
5. The purple shield icon appears in your toolbar ✅

### Backend Setup

The extension calls a backend proxy rather than the Groq API directly. Deploy the backend to Railway (or any Node/Python host) and update `BACKEND_URL` in `background.js`:

```js
const BACKEND_URL = "https://your-app.up.railway.app";
```

---

## File Structure

```
tos-guardian/
├── manifest.json          # Extension config (Manifest V3)
├── background.js          # Service worker — backend API calls
├── content.js             # Page text extraction & ToS detection
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── popup/
    ├── popup.html         # Extension UI
    └── popup.js           # UI logic & state management
```

---

## Privacy

- ToS text is sent to the backend for analysis only
- No data is stored on any server beyond the API call
- Results are cached locally in Chrome storage per URL

---

## Roadmap

- [ ] Auto-detect ToS links and pre-analyze before you click
- [ ] Historical comparison ("this ToS changed!")
- [ ] Community trust scores database
- [ ] Firefox support
- [ ] Side panel mode for reading ToS alongside the analysis
- [ ] Chrome Web Store publish

---

## Tech Stack

- **Chrome Extension** — Manifest V3, content scripts, service worker
- **AI** — Groq API (Llama) via secure backend proxy
- **Backend** — Railway deployment
- **Storage** — Chrome local storage for caching

---

*Built by [Younas Sadat](https://github.com/younassadat) · Islamabad, Pakistan*
