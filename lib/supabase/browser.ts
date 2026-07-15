"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser Supabase client (anon key) — only for auth flows on the client.
// Uses @supabase/ssr so the session is persisted in cookies that the
// server (getSessionUser / middleware) can read.
export const browserSupabase = createBrowserClient(supabaseUrl, anonKey);
