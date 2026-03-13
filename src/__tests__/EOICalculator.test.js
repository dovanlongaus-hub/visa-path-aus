/**
 * EOICalculator.test.js — Unit tests for EOI points logic
 * Tests the official Home Affairs points tables
 */

import { describe, it, expect } from 'vitest';

// ─── Points tables (mirrored from EOICalculator.jsx) ──────

const AGE_POINTS = [
  { min: 18, max: 24, points: 25 },
  { min: 25, max: 32, points: 30 },
  { min: 33, max: 39, points: 25 },
  { min: 40, max: 44, points: 15 },
  { min: 45, max: 99, points: 0 },
];

const ENGLISH_POINTS = {
  competent:  0,
  proficient: 10,
  superior:   20,
};

const OVERSEAS_EXP_POINTS = {
  '0': 0,   // < 3 years
  '3': 5,   // 3–4 years
  '5': 10,  // 5–7 years
  '8': 15,  // 8+ years
};

const AUS_EXP_POINTS = {
  '0': 0,
  '1': 5,   // 1–2 years
  '3': 10,  // 3–4 years
  '5': 15,  // 5–7 years
  '8': 20,  // 8–9 years
  '10': 20, // 10+ years
};

// ─── Helper functions ──────────────────────────────────────

function getAgePoints(age) {
  const bracket = AGE_POINTS.find(b => age >= b.min && age <= b.max);
  return bracket ? bracket.points : 0;
}

function getEnglishPoints(level) {
  return ENGLISH_POINTS[level] ?? 0;
}

function getOverseasExpPoints(years) {
  return OVERSEAS_EXP_POINTS[String(years)] ?? 0;
}

function getAusExpPoints(years) {
  return AUS_EXP_POINTS[String(years)] ?? 0;
}

function calculateTotal(age, english, overseasExp, ausExp, hasPartnerSkills = false, hasAusStudy = false) {
  let total = getAgePoints(age);
  total += getEnglishPoints(english);
  total += getOverseasExpPoints(overseasExp);
  total += getAusExpPoints(ausExp);
  if (hasPartnerSkills) total += 10;
  if (hasAusStudy) total += 5;
  return total;
}

// ─── Tests ────────────────────────────────────────────────

describe('EOI Age Points', () => {
  it('18–24 → 25 points', () => {
    expect(getAgePoints(18)).toBe(25);
    expect(getAgePoints(21)).toBe(25);
    expect(getAgePoints(24)).toBe(25);
  });

  it('25–32 → 30 points (peak bracket)', () => {
    expect(getAgePoints(25)).toBe(30);
    expect(getAgePoints(28)).toBe(30);
    expect(getAgePoints(32)).toBe(30);
  });

  it('33–39 → 25 points', () => {
    expect(getAgePoints(33)).toBe(25);
    expect(getAgePoints(36)).toBe(25);
    expect(getAgePoints(39)).toBe(25);
  });

  it('40–44 → 15 points', () => {
    expect(getAgePoints(40)).toBe(15);
    expect(getAgePoints(42)).toBe(15);
    expect(getAgePoints(44)).toBe(15);
  });

  it('45+ → 0 points', () => {
    expect(getAgePoints(45)).toBe(0);
    expect(getAgePoints(50)).toBe(0);
    expect(getAgePoints(60)).toBe(0);
  });

  it('boundary: age 24→25 drops from 25 to 30', () => {
    expect(getAgePoints(24)).toBe(25);
    expect(getAgePoints(25)).toBe(30); // peak starts
  });

  it('boundary: age 32→33 drops from 30 to 25', () => {
    expect(getAgePoints(32)).toBe(30);
    expect(getAgePoints(33)).toBe(25);
  });

  it('boundary: age 44→45 drops from 15 to 0', () => {
    expect(getAgePoints(44)).toBe(15);
    expect(getAgePoints(45)).toBe(0);
  });

  it('under 18 → 0 points', () => {
    expect(getAgePoints(17)).toBe(0);
  });
});

describe('EOI English Points', () => {
  it('competent → 0 points', () => {
    expect(getEnglishPoints('competent')).toBe(0);
  });

  it('proficient → 10 points (IELTS 7.0 / PTE 65)', () => {
    expect(getEnglishPoints('proficient')).toBe(10);
  });

  it('superior → 20 points (IELTS 8.0+ / PTE 79+)', () => {
    expect(getEnglishPoints('superior')).toBe(20);
  });

  it('unknown level → 0 points (safe default)', () => {
    expect(getEnglishPoints('unknown')).toBe(0);
    expect(getEnglishPoints('')).toBe(0);
  });
});

describe('EOI Overseas Experience Points', () => {
  it('0 years → 0 points', () => {
    expect(getOverseasExpPoints('0')).toBe(0);
  });

  it('3–4 years → 5 points', () => {
    expect(getOverseasExpPoints('3')).toBe(5);
  });

  it('5–7 years → 10 points', () => {
    expect(getOverseasExpPoints('5')).toBe(10);
  });

  it('8+ years → 15 points', () => {
    expect(getOverseasExpPoints('8')).toBe(15);
  });
});

describe('EOI Australian Experience Points', () => {
  it('0 years → 0 points', () => {
    expect(getAusExpPoints('0')).toBe(0);
  });

  it('1–2 years → 5 points', () => {
    expect(getAusExpPoints('1')).toBe(5);
  });

  it('3–4 years → 10 points', () => {
    expect(getAusExpPoints('3')).toBe(10);
  });

  it('5–7 years → 15 points', () => {
    expect(getAusExpPoints('5')).toBe(15);
  });

  it('8+ years → 20 points', () => {
    expect(getAusExpPoints('8')).toBe(20);
    expect(getAusExpPoints('10')).toBe(20);
  });
});

describe('EOI Total Score Calculation', () => {
  it('typical candidate: age 28, proficient English, 3yr overseas → 45 pts', () => {
    // 30 (age) + 10 (english) + 5 (overseas) + 0 (aus) = 45
    expect(calculateTotal(28, 'proficient', '3', '0')).toBe(45);
  });

  it('strong candidate: age 28, superior English, 8yr overseas, 3yr aus → 75 pts', () => {
    // 30 + 20 + 15 + 10 = 75
    expect(calculateTotal(28, 'superior', '8', '3')).toBe(75);
  });

  it('minimum 65 threshold check', () => {
    // 30 + 20 + 15 + 0 = 65 — exactly at threshold
    const score = calculateTotal(28, 'superior', '8', '0');
    expect(score).toBe(65);
    expect(score >= 65).toBe(true);
  });

  it('partner skills bonus adds 10 points', () => {
    const withoutBonus = calculateTotal(28, 'proficient', '3', '0', false);
    const withBonus    = calculateTotal(28, 'proficient', '3', '0', true);
    expect(withBonus - withoutBonus).toBe(10);
  });

  it('Australian study bonus adds 5 points', () => {
    const withoutStudy = calculateTotal(28, 'proficient', '3', '0', false, false);
    const withStudy    = calculateTotal(28, 'proficient', '3', '0', false, true);
    expect(withStudy - withoutStudy).toBe(5);
  });

  it('older candidate 45+ gets 0 age points', () => {
    // 0 (age) + 20 (english) + 15 (overseas) + 0 (aus) = 35 — below threshold
    const score = calculateTotal(50, 'superior', '8', '0');
    expect(score).toBe(35);
    expect(score < 65).toBe(true);
  });
});
