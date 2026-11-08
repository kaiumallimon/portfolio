import { getCurrentUser, AuthSessionPayload } from "@/lib/auth/passport";

/**
 * Server-side authentication guard for Server Actions and Route Handlers.
 * Uses Passport.js JWT session token from cookies.
 * Throws an Error if no valid authenticated user session is found.
 */
export async function requireAdmin(): Promise<AuthSessionPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Admin authentication required.");
  }
  return user;
}
