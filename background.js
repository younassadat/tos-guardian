// Background service worker for ToS Guardian
// Powered by Groq API — Kimi K2 model

// ⚠️ Replace with your Groq API key from console.groq.com/keys
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeTos") {
    analyzeTosWithGroq(request.text, request.url)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep message channel open for async response
  }
});

async function analyzeTosWithGroq(tosText, pageUrl) {
  // Kimi K2 supports very long context — allow up to 16000 chars
  const truncated = tosText.length > 16000
    ? tosText.substring(0, 16000) + "\n\n[...document truncated for analysis...]"
    : tosText;

  const systemPrompt = `You are a legal expert and consumer advocate specializing in Terms of Service analysis. 
You identify sneaky clauses, data privacy risks, and user-hostile terms. 
Always respond with ONLY valid JSON — no markdown fences, no explanation, no preamble. Raw JSON only.`;

  const userPrompt = `Analyze the following Terms of Service and return this exact JSON structure:
{
  "trustScore": <number 0-100>,
  "trustLabel": "<Excellent|Good|Fair|Poor|Dangerous>",
  "summary": "<2-3 sentence plain-English summary of what this ToS means for users>",
  "redFlags": [
    {
      "severity": "<high|medium|low>",
      "title": "<short title>",
      "description": "<1-2 sentence explanation of why this is concerning>",
      "quote": "<exact short quote from the ToS, max 100 chars>"
    }
  ],
  "alerts": [
    "<string: one critical alert for truly dangerous clauses — omit if none>"
  ],
  "positives": [
    "<string: user-friendly clauses worth highlighting>"
  ],
  "categories": {
    "dataCollection": "<low|medium|high>",
    "thirdPartySharing": "<low|medium|high>",
    "userRights": "<weak|moderate|strong>",
    "cancellation": "<easy|moderate|difficult>"
  }
}

Trust score guide: 90-100 = Excellent, 70-89 = Good, 50-69 = Fair, 30-49 = Poor, 0-29 = Dangerous (predatory).
Find at least 2-4 red flags if present. Be specific and quote the actual text.

Page URL: ${pageUrl}

Terms of Service:
${truncated}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "moonshotai/kimi-k2-instruct",
      max_tokens: 1500,
      temperature: 0.2, // Low temperature for consistent, structured output
      response_format: { type: "json_object" }, // Force JSON mode
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) throw new Error("Empty response from Groq API");

  // Strip any accidental markdown fences
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(clean);
}
