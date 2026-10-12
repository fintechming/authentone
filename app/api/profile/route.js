import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer, isSupabaseConfigured } from "@/lib/supabase";

async function getUser() {
  if (!isSupabaseConfigured()) return { user: null, supabase: null };
  const cookieStore = await cookies();
  const supabase = supabaseServer(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { user, supabase };
}

export async function GET() {
  const { user, supabase } = await getUser();
  if (!user) return NextResponse.json({ error: "login_required" }, { status: 401 });
  const { data } = await supabase
    .from("profiles")
    .select("writing_dna, plan")
    .eq("id", user.id)
    .maybeSingle();
  return NextResponse.json({
    email: user.email,
    writing_dna: data?.writing_dna || "",
    plan: data?.plan || "free",
  });
}

export async function POST(req) {
  const { user, supabase } = await getUser();
  if (!user) return NextResponse.json({ error: "login_required" }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const dna = typeof body.writing_dna === "string" ? body.writing_dna.slice(0, 4000) : "";
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, writing_dna: dna }, { onConflict: "id" });
  if (error) return NextResponse.json({ error: "save_failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
