"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { browserSupabase } from "@/lib/supabase/browser";
import { Loader2, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import ColorBends from "@/components/ColorBends";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center px-6">
      {/* Back: ColorBends (matches hero) */}
      <div className="absolute inset-0 z-0 opacity-70">
        <ColorBends
          colors={["#000000", "#6366f1"]}
          speed={0.2}
          scale={1}
          transparent={true}
          autoRotate={0.0}
          rotation={45}
          frequency={1.0}
          mouseInfluence={1.0}
          warpStrength={1.0}
          parallax={0.5}
          noise={0}
        />
      </div>
      {/* Middle: grid (matches hero) */}
      <div
        className={cn(
          "absolute inset-0 z-[1]",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          "opacity-20"
        )}
      />

      {/* Front: card */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={mode === "login" ? handleLogin : handleForgot}
          className="relative border border-white/10 bg-slate-900/30 backdrop-blur-md rounded-3xl p-8 md:p-10 overflow-hidden space-y-6 shadow-2xl shadow-black/40"
        >
          {/* top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />
          {/* accent glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              {mode === "login" ? (
                <Lock size={20} className="text-indigo-400" />
              ) : (
                <Mail size={20} className="text-indigo-400" />
              )}
            </div>
            <h1 className="text-2xl font-semibold text-white">
              {mode === "login" ? "Admin Login" : "Reset Password"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {mode === "login"
                ? "Sign in to manage your portfolio"
                : "Enter your email and we'll send a reset link"}
            </p>
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-xs font-medium text-slate-400 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          {mode === "login" && (
            <div className="space-y-2 relative z-10">
              <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <p className="relative z-10 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>
          )}

          {mode === "forgot" && sent && (
            <p className="relative z-10 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              Check your email for a password reset link.
            </p>
          )}

          {mode === "forgot" && !sent ? (
            <button
              type="submit"
              disabled={loading}
              className="relative z-10 w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Send reset link
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="relative z-10 w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Sign In
            </button>
          )}

          <div className="text-center relative z-10">
            {mode === "login" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                  setSent(false);
                }}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-target"
              >
                Forgot password?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSent(false);
                }}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-target"
              >
                Back to login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
