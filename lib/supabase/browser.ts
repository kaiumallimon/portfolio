// Browser dummy client matching previous API for safe migration
export const browserSupabase = {
  auth: {
    async getUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return { data: { user: null }, error: null };
        const data = await res.json();
        return { data: { user: data.user }, error: null };
      } catch {
        return { data: { user: null }, error: null };
      }
    },
    async signOut() {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    },
  },
  channel(_name?: string) {
    return {
      on(_type?: string, _filter?: unknown, _callback?: unknown) {
        return this;
      },
      subscribe(_callback?: (status: string) => void) {
        if (_callback) _callback("SUBSCRIBED");
        return this;
      },
      unsubscribe() {},
    };
  },
  removeChannel(_channel?: unknown) {},
};

export function createBrowserClient() {
  return browserSupabase;
}
