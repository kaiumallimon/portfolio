import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-only Supabase client using the SERVICE ROLE key.
// Bypasses RLS — must NEVER be imported into a client component.
const globalForSupabase = globalThis as unknown as {
  serverSupabase?: SupabaseClient;
};

export function getServerSupabase(): SupabaseClient {
  if (globalForSupabase.serverSupabase) return globalForSupabase.serverSupabase;

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  globalForSupabase.serverSupabase = client;
  return client;
}
