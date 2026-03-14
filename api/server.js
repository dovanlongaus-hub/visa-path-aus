/**
 * Visa Path Australia — Express API Server
 * Port: 3045
 * Endpoints:
 *   POST /api/create-checkout-session — Stripe Checkout
 *   POST /api/auth/activate           — Activate user token after payment
 *   GET  /api/health                  — Health check
 */

import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file from api/ directory if it exists
const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = join(__dirname, '.env');
if (existsSync(envFile)) {
  readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx < 1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key) process.env[key] = val; // .env file takes priority over PM2/system env
  });
}

const app = express();
const PORT = process.env.PORT || 3045;

// ── Stripe Setup ─────────────────────────────────────────────
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
  || '';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' });

const APP_BASE_URL = process.env.APP_BASE_URL || 'https://visa-path-aus.com';

// ── Plan config (AUD, in cents for Stripe) ───────────────────
const PLANS = {
  basic: {
    name: 'Visa Path Basic',
    monthly: { amount: 1200, description: 'Basic Plan — Monthly ($12 AUD/month)' },
    annual:  { amount: 11500, description: 'Basic Plan — Annual ($115 AUD/year, save 20%)' },
  },
  premium: {
    name: 'Visa Path Premium',
    monthly: { amount: 2500, description: 'Premium Plan — Monthly ($25 AUD/month)' },
    annual:  { amount: 24000, description: 'Premium Plan — Annual ($240 AUD/year, save 20%)' },
  },
  professional: {
    name: 'Visa Path Professional',
    monthly: { amount: 4500, description: 'Professional Plan — Monthly ($45 AUD/month)' },
    annual:  { amount: 43200, description: 'Professional Plan — Annual ($432 AUD/year, save 20%)' },
  },
  consultation: {
    name: 'Visa Consultation 30 phút',
    monthly: { amount: 14900, description: 'Expert visa consultation — 30 min 1-on-1 ($149 AUD)' },
    annual:  { amount: 14900, description: 'Expert visa consultation — 30 min 1-on-1 ($149 AUD)' },
  },
};

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    'https://visa-path-aus.com',
    'https://www.visa-path-aus.com',
    'https://visaaus.com.au',
    'https://www.visaaus.com.au',
    'https://visa.longcare.au',
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  credentials: true,
}));
app.use(express.json());

// ── Health ───────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'visa-path-aus-api', ts: new Date().toISOString() });
});

// ── POST /api/create-checkout-session ────────────────────────
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planId, isAnnual, email } = req.body;

    if (!planId || !PLANS[planId]) {
      return res.status(400).json({ error: 'Invalid plan ID. Valid plans: basic, premium, professional, consultation' });
    }

    const plan = PLANS[planId];
    const billing = isAnnual ? plan.annual : plan.monthly;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'aud',
          product_data: {
            name: plan.name,
            description: billing.description,
            images: ['https://visa-path-aus.com/og-image.png'],
          },
          unit_amount: billing.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: email || undefined,
      success_url: `${APP_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}&annual=${isAnnual ? '1' : '0'}`,
      cancel_url: `${APP_BASE_URL}/cancel`,
      metadata: {
        planId,
        isAnnual: isAnnual ? 'true' : 'false',
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('[Stripe Error]', err.message);
    res.status(500).json({ error: err.message || 'Failed to create checkout session' });
  }
});

// ── POST /api/auth/activate ──────────────────────────────────
// Called after payment success to activate a user token
app.post('/api/auth/activate', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    // Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed', status: session.payment_status });
    }

    const planId = session.metadata?.planId || 'basic';
    const isAnnual = session.metadata?.isAnnual === 'true';
    const token = randomUUID();

    // In production, you'd persist this token to a DB
    // For now, return it to the frontend and store in localStorage
    res.json({
      token,
      planId,
      isAnnual,
      premium: true,
      activatedAt: new Date().toISOString(),
      email: session.customer_email || null,
    });
  } catch (err) {
    console.error('[Activate Error]', err.message);
    res.status(500).json({ error: err.message || 'Failed to activate account' });
  }
});

// ── Email Subscription ────────────────────────────────────────
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, eoi_points, source } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const { writeFileSync, mkdirSync, existsSync: fsExists, readFileSync: fsRead } = await import('fs');
    const dataDir = join(__dirname, 'data');
    const subFile = join(dataDir, 'subscribers.json');

    if (!fsExists(dataDir)) mkdirSync(dataDir, { recursive: true });

    let subscribers = [];
    if (fsExists(subFile)) {
      try { subscribers = JSON.parse(fsRead(subFile, 'utf8')); } catch { subscribers = []; }
    }

    if (!subscribers.find(s => s.email === email)) {
      subscribers.push({
        email,
        eoi_points: eoi_points || null,
        source: source || 'unknown',
        subscribed_at: new Date().toISOString(),
      });
      writeFileSync(subFile, JSON.stringify(subscribers, null, 2));
    }

    res.json({ success: true, message: 'Subscribed!' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[visa-path-aus-api] Running on port ${PORT}`);
  console.log(`[visa-path-aus-api] Health: http://localhost:${PORT}/api/health`);
});
