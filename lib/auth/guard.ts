import { getSessionUser } from "@/lib/supabase/auth";
import type { User } from "@supabase/supabase-js";

/**
 * Server-side authentication guard for Server Actions and Route Handlers.
 * Throws an Error if no valid authenticated user session is found.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized: Admin authentication required.");
  }
  return user;
}
