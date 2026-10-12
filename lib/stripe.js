import Stripe from "stripe";

let stripe = null;

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    const err = new Error("stripe_not_configured");
    err.code = "NO_STRIPE_KEY";
    throw err;
  }
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    });
  }
  return stripe;
}

export const PLANS = {
  pro: {
    priceEnv: "STRIPE_PRO_PRICE_ID",
    dailyRewrites: 100,
  },
  free: {
    dailyRewrites: 5,
  },
};
