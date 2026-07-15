"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { browserSupabase } from "@/lib/supabase/browser";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await browserSupabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const redirect = searchParams.get("redirect") || "/admin";
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-white/10 bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">Admin Login</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage your portfolio</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400 ml-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Sign In
        </button>
      </form>
    </div>
  );
}
