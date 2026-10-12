import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { getCreem, creemProductId } from "@/lib/creem";

/** Creates a Creem checkout session for the Pro subscription. Login required. */
export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }
  const productId = creemProductId();
  if (!productId) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const cookieStore = await cookies();
  const supabase = supabaseServer(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "login_required" }, { status: 401 });

  try {
    const creem = getCreem();
    const checkout = await creem.checkouts.create({
      productId,
      successUrl: `${siteUrl}/?upgraded=1`,
      customer: { email: user.email },
      // referenceId flows through to webhooks so we can map the payment to this user.
      metadata: { referenceId: user.id },
    });
    return NextResponse.json({ url: checkout.checkoutUrl });
  } catch (err) {
    if (err.code === "NO_CREEM_KEY") {
      return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
    }
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
