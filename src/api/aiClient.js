/**
 * aiClient.js — AI Client for VisaPath Australia
 * Powered by taphoaapi.info.vn (OpenAI-compatible)
 * Bilingual VI/EN, specialized for Australian immigration
 */

const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'https://taphoaapi.info.vn/v1';
const AI_API_KEY  = import.meta.env.VITE_AI_API_KEY || '';

export const MODELS = {
  fast:     import.meta.env.VITE_AI_MODEL_FAST     || 'claude-haiku-4-5-20251001',
  balanced: import.meta.env.VITE_AI_MODEL_BALANCED || 'claude-sonnet-4-6',
};

const VISA_SYSTEM_PROMPT = `Bạn là chuyên gia tư vấn di trú Úc, hỗ trợ người Việt Nam di cư sang Úc.
Bạn thông thạo: Visa 500 (Student), 485 (Graduate), 482 (TSS), 186 (ENS), 189/190/491 (Skilled), 858 (Global Talent).
Luôn trả lời bằng tiếng Việt trừ khi người dùng hỏi bằng tiếng Anh.
Tham chiếu chính sách từ immi.homeaffairs.gov.au.
Không cung cấp tư vấn pháp lý chính thức — khuyến nghị tham vấn MARA agent khi cần.
Trả lời ngắn gọn, thực tế, có ví dụ cụ thể.`;

// ─── Core invoke ───────────────────────────────────────────
export async function invokeLLM(prompt, options = {}) {
  const {
    model = MODELS.fast,
    json = false,
    systemPrompt = VISA_SYSTEM_PROMPT,
    maxTokens = 2048,
    temperature = 0.7,
  } = options;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: typeof prompt === 'string' ? prompt : JSON.stringify(prompt) },
  ];

  const body = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
    ...(json ? { response_format: { type: 'json_object' } } : {}),
  };

  const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`AI error ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';

  if (json) {
    try { return JSON.parse(text); } catch { return text; }
  }
  return text;
}

// ─── Streaming for Chat page ───────────────────────────────
export async function invokeLLMStream(prompt, onChunk, options = {}) {
  const {
    model = MODELS.balanced,
    systemPrompt = VISA_SYSTEM_PROMPT,
    history = [],
  } = options;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: prompt },
  ];

  const res = await fetch(`${AI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({ model, messages, stream: true, max_tokens: 4096 }),
  });

  if (!res.ok) throw new Error(`AI stream error ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
    for (const line of lines) {
      const json = line.replace('data: ', '');
      if (json === '[DONE]') break;
      try {
        const delta = JSON.parse(json).choices?.[0]?.delta?.content || '';
        fullText += delta;
        if (onChunk) onChunk(delta, fullText);
      } catch { /* skip malformed */ }
    }
  }
  return fullText;
}

// ─── Smart routing ─────────────────────────────────────────
export function selectModel(prompt) {
  const text = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
  if (text.length > 500 || /phân tích|so sánh|giải thích|chiến lược|why|explain|analyze/i.test(text))
    return MODELS.balanced;
  return MODELS.fast;
}

export async function invokeLLMSmart(prompt, options = {}) {
  const model = options.model || selectModel(prompt);
  return invokeLLM(prompt, { ...options, model });
}
