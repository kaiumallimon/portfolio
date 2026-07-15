"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser Supabase client (anon key) — only for auth flows on the client.
export const browserSupabase = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
