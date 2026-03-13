import Stripe from "npm:stripe@17";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const VND_TO_AUD_RATE = 25000;

const BASE_PRICES_VND = {
  basic: 199000,
  pro: 399000,
  expert: 699000,
};

const DURATION_DISCOUNTS = {
  monthly: { months: 1, discount: 0 },
  quarterly: { months: 3, discount: 15 },
  biannual: { months: 6, discount: 25 },
  annual: { months: 12, discount: 35 },
};

const PLAN_NAMES = {
  basic: "Gói Cơ bản",
  pro: "Gói Chuyên nghiệp",
  expert: "Gói Chuyên sâu",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { planId, durationId, email } = await req.json();

    if (!planId || !durationId || !email) {
      return Response.json({ error: "Missing required fields: planId, durationId, email" }, { status: 400 });
    }

    const basePrice = BASE_PRICES_VND[planId];
    if (!basePrice) {
      return Response.json({ error: `Invalid planId: ${planId}` }, { status: 400 });
    }

    const duration = DURATION_DISCOUNTS[durationId];
    if (!duration) {
      return Response.json({ error: `Invalid durationId: ${durationId}` }, { status: 400 });
    }

    // Calculate total price in VND
    const totalVnd = basePrice * duration.months * (1 - duration.discount / 100);
    const totalAud = Math.round(totalVnd / VND_TO_AUD_RATE * 100) / 100; // Round to 2 decimal places

    // Initialize Stripe
    if (!STRIPE_SECRET_KEY) {
      return Response.json({ error: "Stripe not configured" }, { status: 500 });
    }
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: `${PLAN_NAMES[planId]} - ${duration.months} tháng`,
              description: `Visa Path Australia - ${duration.discount > 0 ? `Giảm giá ${duration.discount}%` : "Thanh toán hàng tháng"}`,
            },
            unit_amount: Math.round(totalAud * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://visa.longcare.au/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://visa.longcare.au/pricing",
      customer_email: email,
      metadata: {
        planId,
        durationId,
        totalVnd: totalVnd.toString(),
        totalAud: totalAud.toString(),
      },
    });

    return Response.json({ url: session.url }, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
});
