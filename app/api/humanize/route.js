import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { buildAnalyzePrompt, buildRewritePrompt } from "@/lib/prompts";
import { callGemini, parseAnalyzeJson } from "@/lib/gemini";
import { supabaseServer, isSupabaseConfigured } from "@/lib/supabase";
import { PLANS } from "@/lib/stripe";

const MAX_CHARS = 5000;
// Anonymous (not logged in) daily quota, keyed by IP hash.
const ANON_DAILY_REWRITES = 3;
const ANON_DAILY_ANALYZES = 20;

function detectLang(text) {
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  return cjk > text.length * 0.1 ? "zh" : "en";
}

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

async function getUser() {
  if (!isSupabaseConfigured()) return { user: null, supabase: null };
  const cookieStore = await cookies();
  const supabase = supabaseServer(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, supabase };
}

/** Stable per-IP identifier for anonymous quota (not reversible to the IP). */
function anonIpHash(req) {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip") || "unknown").trim();
  return createHash("sha256").update("authentone-anon:" + ip).digest("hex").slice(0, 32);
}

async function getAnonUsage(ipHash) {
  try {
    const admin = supabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await admin
      .from("anon_usage")
      .select("analyzes, rewrites")
      .eq("ip_hash", ipHash)
      .eq("day", today)
      .maybeSingle();
    return { analyzes: data?.analyzes || 0, rewrites: data?.rewrites || 0 };
  } catch {
    return { analyzes: 0, rewrites: 0 };
  }
}

async function bumpAnonUsage(ipHash, field) {
  try {
    const admin = supabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const usage = await getAnonUsage(ipHash);
    await admin.from("anon_usage").upsert(
      {
        ip_hash: ipHash,
        day: today,
        analyzes: usage.analyzes + (field === "analyzes" ? 1 : 0),
        rewrites: usage.rewrites + (field === "rewrites" ? 1 : 0),
      },
      { onConflict: "ip_hash,day" }
    );
  } catch {
    // quota tracking is best-effort; never break the request because of it
  }
}

/** Returns {ok:true, limit} or {ok:false, response} when quota is exhausted. */
async function checkRewriteQuota(supabase, user, plan) {
  const limit = (PLANS[plan] || PLANS.free).dailyRewrites;
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("daily_usage")
    .select("rewrites")
    .eq("user_id", user.id)
    .eq("day", today)
    .maybeSingle();
  const used = data?.rewrites || 0;
  if (used >= limit) {
    return {
      ok: false,
      limit,
      response: NextResponse.json(
        { error: "quota_exceeded", used, limit },
        { status: 429 }
      ),
    };
  }
  return { ok: true, limit, used };
}

async function bumpRewriteQuota(supabase, user) {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("daily_usage")
    .select("rewrites")
    .eq("user_id", user.id)
    .eq("day", today)
    .maybeSingle();
  await supabase.from("daily_usage").upsert(
    { user_id: user.id, day: today, rewrites: (data?.rewrites || 0) + 1 },
    { onConflict: "user_id,day" }
  );
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const { step, text = "", dna = "", intensity = "middle", platform = "blog" } = body;

  if (!["analyze", "rewrite"].includes(step)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "empty_text" }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json({ error: "too_long", max: MAX_CHARS }, { status: 400 });
  }

  const { user, supabase } = await getUser();
  const lang = detectLang(text);

  // ---- Anonymous path: try before signing up ----
  if (!user) {
    const ipHash = anonIpHash(req);
    const usage = await getAnonUsage(ipHash);
    const rewritesLeft = Math.max(0, ANON_DAILY_REWRITES - usage.rewrites);
    try {
      if (step === "analyze") {
        if (usage.analyzes >= ANON_DAILY_ANALYZES) {
          return NextResponse.json(
            { error: "anon_quota_exceeded", used: usage.rewrites, limit: ANON_DAILY_REWRITES },
            { status: 429 }
          );
        }
        const raw = await callGemini({
          prompt: buildAnalyzePrompt(text, lang),
          temperature: 0.3,
          maxTokens: 1024,
        });
        await bumpAnonUsage(ipHash, "analyzes");
        return NextResponse.json({ lang, ...parseAnalyzeJson(raw), anon: true, anonRewritesLeft: rewritesLeft });
      }
      // rewrite
      if (usage.rewrites >= ANON_DAILY_REWRITES) {
        return NextResponse.json(
          { error: "anon_quota_exceeded", used: usage.rewrites, limit: ANON_DAILY_REWRITES },
          { status: 429 }
        );
      }
      const rewritten = await callGemini({
        prompt: buildRewritePrompt({ text, dna, intensity, platform, lang }),
        temperature: 0.85,
        maxTokens: 4096,
      });
      await bumpAnonUsage(ipHash, "rewrites");
      return NextResponse.json({
        lang,
        text: rewritten.trim(),
        anon: true,
        anonRewritesLeft: Math.max(0, rewritesLeft - 1),
      });
    } catch (err) {
      if (err.code === "NO_API_KEY") {
        return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
      }
      return NextResponse.json({ error: "provider_error" }, { status: 502 });
    }
  }

  // ---- Logged-in path (unchanged) ----
  try {
    if (step === "analyze") {
      const raw = await callGemini({
        prompt: buildAnalyzePrompt(text, lang),
        temperature: 0.3,
        maxTokens: 1024,
      });
      return NextResponse.json({ lang, ...parseAnalyzeJson(raw) });
    }

    // rewrite: enforce daily quota (plan-aware)
    const { data: profile } = await supabase
      .from("profiles")
      .select("writing_dna, plan")
      .eq("id", user.id)
      .maybeSingle();
    const plan = profile?.plan === "pro" ? "pro" : "free";

    const quota = await checkRewriteQuota(supabase, user, plan);
    if (!quota.ok) return quota.response;

    // Prefer the saved writing DNA from the profile; fall back to the ad-hoc input.
    const savedDna = profile?.writing_dna || "";

    const rewritten = await callGemini({
      prompt: buildRewritePrompt({
        text,
        dna: savedDna || dna,
        intensity,
        platform,
        lang,
      }),
      temperature: 0.85,
      maxTokens: 4096,
    });
    await bumpRewriteQuota(supabase, user);
    return NextResponse.json({ lang, text: rewritten.trim() });
  } catch (err) {
    if (err.code === "NO_API_KEY") {
      return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
    }
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
