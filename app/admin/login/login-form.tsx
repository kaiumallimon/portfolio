"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { browserSupabase } from "@/lib/supabase/browser";
import {
  Lock,
  Mail,
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GradientWaves from "@/components/reactbits/GradientWaves";
import TargetCursor from "@/components/TargetCursor";
import { springs } from "@/lib/motion";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await browserSupabase.auth.signInWithPassword({
      email,
      password,
    });
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

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070712] flex flex-col justify-between items-center px-4 py-8 sm:px-6">
      <TargetCursor />

      {/* ReactBits GradientWaves WebGL Background */}
      <GradientWaves
        horizonColor="#06060c"
        waveColor="#4f46e5"
        crestColor="#818cf8"
        speed={0.28}
        amplitude={2.2}
        waveScale={0.62}
        waveRatio={0.9}
        swell={28}
        turbulence={16}
        tilt={1.12}
        height={5.2}
        fogDepth={18}
        brightness={1.2}
        opacity={0.85}
        mouseInteraction={true}
        parallaxStrength={0.45}
        grain={true}
        grainIntensity={0.03}
        className="opacity-100"
      />

      {/* Ambient Radial Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#070712]/40 to-[#070712]/90 pointer-events-none" />

      {/* Subtle Matrix Grid */}
      <div
        className={cn(
          "absolute inset-0 z-[1]",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]",
          "opacity-30 pointer-events-none"
        )}
      />

      {/* Top Specular Horizon Beam */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      {/* Top Navigation Bar: Return to Portfolio */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between">
        <Link
          href="/"
          className="cursor-target group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-xl shadow-lg transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Security Telemetry Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium font-mono">
          <ShieldCheck size={13} className="text-indigo-400" />
          <span>256-bit Encrypted</span>
        </div>
      </div>

      {/* Main Form Center Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springs.snappy}
        className="relative z-10 w-full max-w-md my-auto py-6"
      >
        <form
          onSubmit={mode === "login" ? handleLogin : handleForgot}
          className="relative border border-white/12 bg-slate-900/45 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 overflow-hidden space-y-6 shadow-2xl shadow-black/70"
        >
          {/* Top Specular Accent Border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
          {/* Ambient Glow Orb */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Identity & Mode Title */}
          <div className="text-center relative z-10 flex flex-col items-center">
            {/* Holographic Glowing Avatar Ring */}
            <div className="relative p-[2px] rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-violet-700/40 shadow-[0_0_24px_rgba(99,102,241,0.45)] mb-3 shrink-0">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-indigo-400/30 bg-slate-950">
                <Image
                  src="/bordered.png"
                  alt="Kaium Al Limon"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Eyebrow Capsule */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium mb-2.5 font-mono">
              <ShieldCheck size={12} className="text-indigo-400" />
              <span>Restricted System Gateway</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              {mode === "login" ? "Authorized Access" : "Reset Access"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
              {mode === "login"
                ? "This console is strictly restricted to authorized administrators. All authentication attempts are encrypted & logged."
                : "Enter your registered administrator email to receive a secure recovery token"}
            </p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4 relative z-10">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Administrator Email</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@domain.com"
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-indigo-500/60 focus:bg-slate-950/90 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Password Input (Login Mode Only) */}
            {mode === "login" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError(null);
                      setSent(false);
                    }}
                    className="cursor-target text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950/60 border border-white/10 focus:border-indigo-500/60 focus:bg-slate-950/90 rounded-2xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-inner font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-target absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feedback & Error States */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="relative z-10 text-xs text-red-400 bg-red-500/10 border border-red-500/25 rounded-2xl p-3.5 flex items-start gap-2.5"
              >
                <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {mode === "forgot" && sent && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="relative z-10 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3.5 flex items-start gap-2.5"
              >
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>A secure password reset link has been dispatched to your email address.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Primary Action Button (Matching Hero CTA Pill Style) */}
          <div className="relative z-10 pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={springs.snappy}
              type="submit"
              disabled={loading || (mode === "forgot" && sent)}
              className="cursor-target group relative flex items-center justify-center h-12 w-full overflow-hidden rounded-full p-1 ps-5 pe-12 text-sm font-semibold text-white transition-all duration-500 hover:ps-12 hover:pe-5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 shadow-xl shadow-indigo-600/30 disabled:opacity-50 select-none cursor-pointer"
            >
              <span className="relative z-10 transition-all duration-500 leading-none whitespace-nowrap flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : mode === "login" ? (
                  "Authenticate & Enter"
                ) : (
                  "Send Recovery Link"
                )}
              </span>
              <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-700 shadow-md transition-all duration-500 group-hover:right-[calc(100%-44px)] shrink-0">
                <ArrowUpRight size={16} className="transition-transform duration-500" />
              </div>
            </motion.button>
          </div>

          {/* Bottom Switch Mode Toggle */}
          <div className="text-center relative z-10 pt-2 border-t border-white/8">
            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSent(false);
                }}
                className="cursor-target inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors font-medium"
              >
                <ArrowLeft size={13} />
                <span>Return to Sign In</span>
              </button>
            )}

            {mode === "login" && (
              <p className="text-[11px] text-slate-500 font-mono">
                Protected by TLS 1.3 & Supabase Row Level Security
              </p>
            )}
          </div>
        </form>
      </motion.div>

      {/* Bottom Footer Telemetry */}
      <div className="relative z-10 text-center text-xs text-slate-500 font-mono tracking-wider uppercase py-2">
        <span>Kaium Al Limon · Admin Control Center</span>
      </div>
    </div>
  );
}
