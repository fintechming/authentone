/**
 * Server-side Gemini API caller.
 * The API key always comes from process.env.GEMINI_API_KEY and is never
 * exposed to the client.
 */

const API_HOST = "https://generativelanguage.googleapis.com";

export function getConfig() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  return { apiKey, model };
}

export async function callGemini({ prompt, temperature = 0.8, maxTokens = 4096 }) {
  const { apiKey, model } = getConfig();
  if (!apiKey) {
    const err = new Error("server_misconfigured");
    err.code = "NO_API_KEY";
    throw err;
  }
  const url = `${API_HOST}/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens: maxTokens },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`gemini_api_error_${res.status}`);
    err.code = "PROVIDER_ERROR";
    err.detail = body.slice(0, 300);
    throw err;
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw Object.assign(new Error("empty_response"), { code: "PROVIDER_ERROR" });
  return text;
}

/** Strip markdown code fences and parse the analyzer's JSON output. */
export function parseAnalyzeJson(raw) {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  const aiScore = Math.max(0, Math.min(100, parseInt(parsed.aiScore, 10) || 0));
  const findings = Array.isArray(parsed.findings)
    ? parsed.findings.map(String).slice(0, 6)
    : [];
  return { aiScore, findings };
}
