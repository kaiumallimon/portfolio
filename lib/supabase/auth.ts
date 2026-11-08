import { getCurrentUser } from "@/lib/auth/passport";

export async function getSessionUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return {
    id: user.userId,
    email: user.email,
    user_metadata: { name: user.name, role: user.role },
  };
}

export async function getAuthServerClient() {
  return {
    auth: {
      async getUser() {
        const user = await getSessionUser();
        return { data: { user }, error: null };
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        const { authenticateWithPassport } = await import("@/lib/auth/passport");
        const { user, error } = await authenticateWithPassport(email, password);
        if (error || !user) {
          return { data: { user: null }, error: { message: error || "Invalid credentials." } };
        }
        return {
          data: {
            user: {
              id: user._id.toString(),
              email: user.email,
              user_metadata: { name: user.name, role: user.role },
            },
          },
          error: null,
        };
      },
      async updatePasswordForUser() {
        return { data: null, error: null };
      },
      async resetPasswordForEmail() {
        return { data: null, error: null };
      },
    },
  };
}
