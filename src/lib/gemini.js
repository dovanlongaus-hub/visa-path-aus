import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;

function getGenAI() {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

/**
 * Call Google Gemini API with a prompt string.
 * @param {string} prompt - Full prompt text (system + history + user message)
 * @returns {Promise<string>} - The generated response text
 */
export async function invokeGemini(prompt) {
  const client = getGenAI();
  if (!client) {
    throw new Error(
      "VITE_GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm key vào file .env."
    );
  }

  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export const isGeminiConfigured = () => Boolean(API_KEY);
