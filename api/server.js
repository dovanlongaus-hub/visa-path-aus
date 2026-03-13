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
};

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: [
    'https://visa-path-aus.com',
    'https://www.visa-path-aus.com',
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
      return res.status(400).json({ error: 'Invalid plan ID. Valid plans: basic, premium, professional' });
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

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[visa-path-aus-api] Running on port ${PORT}`);
  console.log(`[visa-path-aus-api] Health: http://localhost:${PORT}/api/health`);
});
