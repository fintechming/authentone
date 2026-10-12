import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer, isSupabaseConfigured } from "@/lib/supabase";

/** Exchanges the magic-link `code` for a session, then redirects home. */
export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  if (!code || !isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/?auth=error", url.origin));
  }
  const cookieStore = await cookies();
  const supabase = supabaseServer(cookieStore);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(
    new URL(error ? "/?auth=error" : next, url.origin)
  );
}
