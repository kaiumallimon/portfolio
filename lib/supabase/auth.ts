import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side session reader using the anon key (reads auth cookies).
// Use only inside Server Components / Route Handlers / Server Actions.
export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // `setAll` throws in Server Components — safe to ignore there.
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
