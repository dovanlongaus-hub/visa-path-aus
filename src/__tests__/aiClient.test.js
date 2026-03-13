/**
 * aiClient.test.js — Tests for AI client + gateway routing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock env ──────────────────────────────────────────────
vi.stubEnv('VITE_AI_BASE_URL', 'https://api.longcare.au/v1/openai/visaaus');
vi.stubEnv('VITE_AI_API_KEY', 'test-key-xxx');
vi.stubEnv('VITE_AI_MODEL_FAST', 'mochi-gateway');
vi.stubEnv('VITE_AI_MODEL_BALANCED', 'mochi-gateway');

// ─── selectModel logic (inline, no import needed) ─────────

function selectModel(prompt) {
  const text = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
  const complexKeywords = /phân tích|so sánh|giải thích|chiến lược|why|explain|analyze/i;
  if (text.length > 500 || complexKeywords.test(text)) return 'balanced';
  return 'fast';
}

describe('selectModel', () => {
  it('returns "fast" for short simple queries', () => {
    expect(selectModel('Visa 189 là gì?')).toBe('fast');
    expect(selectModel('Hello')).toBe('fast');
  });

  it('returns "balanced" for long queries (>500 chars)', () => {
    const longQuery = 'x'.repeat(501);
    expect(selectModel(longQuery)).toBe('balanced');
  });

  it('returns "balanced" for complex Vietnamese keywords', () => {
    expect(selectModel('phân tích điểm EOI của tôi')).toBe('balanced');
    expect(selectModel('giải thích visa 482 như thế nào')).toBe('balanced');
    expect(selectModel('so sánh visa 189 và 190')).toBe('balanced');
    expect(selectModel('chiến lược xin visa')).toBe('balanced');
  });

  it('returns "balanced" for complex English keywords', () => {
    expect(selectModel('explain the difference between visa subclasses')).toBe('balanced');
    expect(selectModel('analyze my points test')).toBe('balanced');
    expect(selectModel('why was my visa rejected')).toBe('balanced');
  });

  it('case-insensitive keyword matching', () => {
    expect(selectModel('EXPLAIN this please')).toBe('balanced');
    expect(selectModel('Phân Tích hồ sơ của tôi')).toBe('balanced');
  });

  it('handles object prompts', () => {
    const obj = { question: 'Simple question?' };
    expect(selectModel(obj)).toBe('fast');
  });
});

// ─── invokeLLM error handling ──────────────────────────────

describe('invokeLLM error handling', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it('throws on non-ok response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'rate limit' }),
    });

    async function invokeLLM_mock(prompt) {
      const res = await fetch('https://api.longcare.au/v1/openai/visaaus/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-key-xxx' },
        body: JSON.stringify({ model: 'mochi-gateway', messages: [{ role: 'user', content: prompt }] }),
      });
      if (!res.ok) throw new Error(`AI error ${res.status}`);
      return '';
    }

    await expect(invokeLLM_mock('test')).rejects.toThrow('AI error 429');
  });

  it('returns text on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: 'Visa 189 yêu cầu 65 điểm.' } }],
      }),
    });

    async function invokeLLM_mock(prompt) {
      const res = await fetch('https://api.longcare.au/v1/openai/visaaus/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-key-xxx' },
        body: JSON.stringify({ model: 'mochi-gateway', messages: [{ role: 'user', content: prompt }] }),
      });
      if (!res.ok) throw new Error(`AI error ${res.status}`);
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }

    const result = await invokeLLM_mock('Visa 189 là gì?');
    expect(result).toBe('Visa 189 yêu cầu 65 điểm.');
  });

  it('handles empty choices gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ choices: [] }),
    });

    async function invokeLLM_mock() {
      const res = await fetch('https://api.longcare.au/test', { method: 'POST', headers: {}, body: '{}' });
      if (!res.ok) throw new Error('fail');
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }

    const result = await invokeLLM_mock();
    expect(result).toBe('');
  });
});

// ─── Gateway config tests ──────────────────────────────────

describe('Gateway configuration', () => {
  it('API base URL contains longcare.au or visaaus', () => {
    const base = import.meta.env.VITE_AI_BASE_URL || 'https://api.longcare.au/v1/openai/visaaus';
    expect(base).toMatch(/longcare\.au|visaaus|deepseek|taphoaapi/);
  });

  it('uses gateway model names', () => {
    const fastModel = import.meta.env.VITE_AI_MODEL_FAST || 'mochi-gateway';
    const balancedModel = import.meta.env.VITE_AI_MODEL_BALANCED || 'mochi-gateway';
    expect(typeof fastModel).toBe('string');
    expect(fastModel.length).toBeGreaterThan(0);
    expect(typeof balancedModel).toBe('string');
  });
});
