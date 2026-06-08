const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getOpenRouterConfig() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is required");
  }

  if (!process.env.OPENROUTER_MODEL) {
    throw new Error("OPENROUTER_MODEL is required");
  }

  return {
    key: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL,
  };
}

async function openRouterChat(messages, options = {}) {
  const { key, model } = getOpenRouterConfig();

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:5173",
      "X-Title": process.env.OPENROUTER_APP_NAME || "AgriScan",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 700,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter request failed: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

function parseJsonResponse(content) {
  const cleaned = content.replace(/```json|```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const jsonText =
    firstBrace >= 0 && lastBrace >= 0
      ? cleaned.slice(firstBrace, lastBrace + 1)
      : cleaned;

  return JSON.parse(jsonText);
}

export async function identifyCattleBreed(imageUrl) {
  const content = await openRouterChat(
    [
      {
        role: "system",
        content:
          "You are a cattle breed identification assistant. Return only valid JSON with keys breed, confidence, explanation. Confidence must be a number from 0 to 100.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Identify the cattle breed in this image. Tell how sure you are. Return JSON only.",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    { maxTokens: 300 }
  );

  const parsed = parseJsonResponse(content);
  return {
    breed: String(parsed.breed || "Unknown"),
    confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 0)),
    explanation: String(parsed.explanation || ""),
  };
}

export async function askAssistant(question) {
  return openRouterChat(
    [
      {
        role: "system",
        content:
          "You are AgriScan's cattle farming assistant. Answer user questions clearly and practically. Keep answers focused on cattle care, breeding, health, identification, and farming operations.",
      },
      { role: "user", content: question },
    ],
    { temperature: 0.4, maxTokens: 900 }
  );
}
