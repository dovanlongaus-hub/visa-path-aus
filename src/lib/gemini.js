import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let ai = null;

function getAI() {
  if (!ai && API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

/**
 * Call Google Gemini API with a prompt string.
 * @param {string} prompt - Full prompt text (system + history + user message)
 * @returns {Promise<string>} - The generated response text
 */
export async function invokeGemini(prompt) {
  const client = getAI();
  if (!client) {
    throw new Error(
      "VITE_GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm key vào file .env."
    );
  }

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  return response.text;
}

export const isGeminiConfigured = () => Boolean(API_KEY);
