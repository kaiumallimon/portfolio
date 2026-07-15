"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ColorBends from "@/components/ColorBends";

type Status = "ready" | "done" | "invalid";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(token ? "ready" : "invalid");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        setLoading(false);
        return;
      }
      setStatus("done");
      setTimeout(() => router.push("/admin/login"), 1500);
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
          onSubmit={handleSubmit}
          className="relative border border-white/10 bg-slate-900/30 backdrop-blur-md rounded-3xl p-8 md:p-10 overflow-hidden space-y-6 shadow-2xl shadow-black/40"
        >
          {/* top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />
          {/* accent glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              {status === "done" ? (
                <CheckCircle2 size={20} className="text-emerald-400" />
              ) : status === "invalid" ? (
                <AlertCircle size={20} className="text-red-400" />
              ) : (
                <Lock size={20} className="text-indigo-400" />
              )}
            </div>
            <h1 className="text-2xl font-semibold text-white">
              {status === "done"
                ? "Password updated"
                : status === "invalid"
                  ? "Link expired"
                  : "Set a new password"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {status === "done"
                ? "Redirecting you to sign in..."
                : status === "invalid"
                  ? "This reset link is invalid or has expired."
                  : "Choose a new password for your account"}
            </p>
          </div>

          {status === "invalid" && (
            <button
              type="button"
              onClick={() => router.push("/admin/login")}
              className="relative z-10 w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25"
            >
              Back to login
            </button>
          )}

          {status === "ready" && (
            <>
              <div className="space-y-2 relative z-10">
                <label className="text-xs font-medium text-slate-400 ml-1">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2 relative z-10">
                <label className="text-xs font-medium text-slate-400 ml-1">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="relative z-10 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative z-10 w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                Update password
              </button>
            </>
          )}

          {status === "done" && (
            <div className="flex justify-center relative z-10 py-2">
              <Loader2 size={20} className="animate-spin text-emerald-400" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
