import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createCreem } from "creem_io";

export const dynamic = "force-dynamic";

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function setPlan(userId, plan) {
  const supabase = supabaseAdmin();
  await supabase.from("profiles").upsert({ id: userId, plan }, { onConflict: "id" });
}

/**
 * Creem webhook: flips profiles.plan between free/pro.
 * Configure in the Creem dashboard (Developers > Webhooks):
 *   URL: https://authentone.com/api/webhook
 *   Events: subscription.paid (grant), subscription.canceled,
 *           subscription.expired, subscription.paused (revoke)
 */
export async function POST(req) {
  const apiKey = process.env.CREEM_API_KEY;
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
  if (!apiKey || !webhookSecret) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 500 });
  }
  const signature = req.headers.get("creem-signature");
  if (!signature) {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  const creem = createCreem({
    apiKey,
    webhookSecret,
    testMode: apiKey.startsWith("creem_test_"),
  });

  const rawBody = await req.text();
  try {
    await creem.webhooks.handleEvents(rawBody, signature, {
      onGrantAccess: async ({ metadata }) => {
        const userId = metadata?.referenceId;
        if (userId) await setPlan(userId, "pro");
      },
      onRevokeAccess: async ({ metadata }) => {
        const userId = metadata?.referenceId;
        if (userId) await setPlan(userId, "free");
      },
    });
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}
