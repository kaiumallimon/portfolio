import { getServerSupabase } from "@/lib/supabase/server";

// Finds a user by email using the admin API (works around the absence of
// getUserByEmail in some supabase-js builds). For a portfolio this is a tiny
// user set, so a single listUsers page is sufficient.
export async function findUserByEmail(
  email: string,
): Promise<{ id: string } | null> {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) return null;
  const match = data.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  return match ? { id: match.id } : null;
}
