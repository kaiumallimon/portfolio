"use client";

import {
  Mail,
  Copy,
  Check,
  MapPin,
  Clock,
  Send,
  Sparkles,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  MessageSquare,
  Zap,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SiteSettings } from "@/types/content";
import { springs, use3DTilt, useMagnetic } from "@/lib/motion";
import { ScrollRevealSection, GSAPSectionHeader } from "@/components/shared/scroll-reveal";

declare global {
  interface GrecaptchaParameters {
    sitekey: string;
    callback?: (token: string) => void;
    "expired-callback"?: () => void;
    "error-callback"?: () => void;
    theme?: "light" | "dark";
    size?: "normal" | "compact";
  }
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (container: HTMLElement, parameters: GrecaptchaParameters) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

export default function ContactForm({
  settings,
  recaptchaSiteKey,
}: {
  settings: SiteSettings | null;
  recaptchaSiteKey?: string | null;
}) {
  const email = settings?.email || "kalimon291@gmail.com";
  const location = settings?.location || "Dhaka, Bangladesh";
  const available = settings?.available_status ?? true;
  const github = settings?.github_url || "https://github.com/kaiumallimon";
  const linkedin = settings?.linkedin_url || "https://linkedin.com/in/kaiumallimon";
  const facebook = settings?.facebook_url || "https://facebook.com/kaiumallimon";

  const RECAPTCHA_SITE_KEY = recaptchaSiteKey ?? null;

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState<string>("");

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const leftTilt = use3DTilt({ maxTilt: 4, scale: 1.005 });
  const rightTilt = use3DTilt({ maxTilt: 3, scale: 1.005 });
  const buttonMagnetic = useMagnetic(0.25);

  // Live Time Telemetry (Dhaka UTC+6)
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeString = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date());
        setLocalTime(timeString);
      } catch {
        setLocalTime("");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Copy Email to Clipboard
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  // Recaptcha initialization
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    let script: HTMLScriptElement | null = null;

    const renderWidget = () => {
      if (!captchaRef.current || widgetIdRef.current !== null) return;
      const g = window.grecaptcha;
      if (g) {
        widgetIdRef.current = g.render(captchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: "dark",
          callback: (token: string) => setCaptchaToken(token),
          "expired-callback": () => setCaptchaToken(null),
          "error-callback": () => setCaptchaToken(null),
        });
      }
    };

    if (window.grecaptcha) {
      window.grecaptcha.ready(renderWidget);
    } else {
      script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => window.grecaptcha?.ready(renderWidget);
      document.body.appendChild(script);
    }

    return () => {
      if (script && script.parentNode) script.parentNode.removeChild(script);
      widgetIdRef.current = null;
    };
  }, [RECAPTCHA_SITE_KEY]);

  const resetCaptcha = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      setStatus({ type: "error", message: "Email and message are required." });
      return;
    }
    if (RECAPTCHA_SITE_KEY && !captchaToken) {
      setStatus({ type: "error", message: "Please verify you are not a robot." });
      return;
    }
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token: captchaToken }),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been received. I'll get back to you shortly.",
        });
        setFormData({ name: "", email: "", message: "" });
        resetCaptcha();
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
        resetCaptcha();
      }
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again later." });
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <ScrollRevealSection id="contact" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Sequential GSAP Entrance */}
        <GSAPSectionHeader
          eyebrow="Get In Touch"
          title="Let's build something exceptional together."
          subtitle="Open for innovative Flutter mobile engineering, full-stack architecture, and high-impact software collaborations."
          className="mb-12 md:mb-16"
        />

        {/* 12-Column Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (5 Cols): Telemetry, Communication & Social Dock */}
          <div
            data-gsap-card
            ref={leftTilt.ref}
            onMouseMove={leftTilt.handleMouseMove}
            onMouseLeave={leftTilt.handleMouseLeave}
            className="lg:col-span-5 flex flex-col justify-between perspective-1000"
          >
            <motion.div
              style={leftTilt.style}
              className="group border border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl p-7 md:p-8 flex flex-col justify-between h-full shadow-2xl shadow-black/40 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden space-y-6"
            >
              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {/* Live Availability Beacon */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    {available ? "Open for Work" : "Currently Engaged"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Zap size={13} className="text-amber-400" />
                    &lt; 12h reply
                  </span>
                </div>

                {/* Narrative pitch */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    Have a vision in mind?
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed mt-2">
                    Whether you need a high-performance Flutter mobile application, an optimized web
                    platform, or a scalable backend architecture, I&apos;m here to engineer it.
                  </p>
                </div>

                {/* Quick-Action Telemetry Bento Cards */}
                <div className="space-y-3">
                  {/* Copyable Email Card */}
                  <div
                    onClick={handleCopyEmail}
                    className="cursor-target group/email flex items-center justify-between p-4 rounded-2xl border border-white/8 bg-white/4 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 group-hover/email:scale-105 transition-transform shrink-0">
                        <Mail size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-500 font-medium">Direct Email</p>
                        <p className="text-xs md:text-sm font-semibold text-white truncate group-hover/email:text-indigo-300 transition-colors">
                          {email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Copy email address"
                      className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 ml-2"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Location & Live Clock Telemetry */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-white/8 bg-white/4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 font-medium">Location</p>
                        <p className="text-xs md:text-sm font-semibold text-white">{location}</p>
                      </div>
                    </div>

                    {localTime && (
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/8">
                        <Clock size={12} className="text-cyan-400" />
                        <span>{localTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Channels Dock */}
              <div className="pt-4 border-t border-white/8 space-y-2.5 relative z-10">
                <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
                  Connect Directly
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all group/soc"
                  >
                    <FaGithub size={14} />
                    <span>GitHub</span>
                    <ArrowUpRight size={11} className="text-slate-500 group-hover/soc:text-white transition-colors" />
                  </a>

                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all group/soc"
                  >
                    <FaLinkedin size={14} className="text-sky-400" />
                    <span>LinkedIn</span>
                    <ArrowUpRight size={11} className="text-slate-500 group-hover/soc:text-white transition-colors" />
                  </a>

                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all group/soc"
                  >
                    <FaFacebook size={14} className="text-blue-400" />
                    <span>Facebook</span>
                    <ArrowUpRight size={11} className="text-slate-500 group-hover/soc:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (7 Cols): High-End Interactive Glass Form */}
          <div
            data-gsap-card
            ref={rightTilt.ref}
            onMouseMove={rightTilt.handleMouseMove}
            onMouseLeave={rightTilt.handleMouseLeave}
            className="lg:col-span-7 perspective-1000 flex flex-col"
          >
            <motion.div
              style={rightTilt.style}
              className="group border border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl p-7 md:p-9 shadow-2xl shadow-black/40 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full space-y-6"
            >
              {/* Ambient Specular Highlight */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={14} />
                  <span>Send a Message</span>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 ml-1 flex items-center gap-1.5">
                      <User size={13} className="text-indigo-400" />
                      <span>Your Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g. Sarah Connor"
                      className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 ml-1 flex items-center gap-1.5">
                      <Mail size={13} className="text-indigo-400" />
                      <span>Email Address <span className="text-indigo-400">*</span></span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      placeholder="e.g. sarah@company.com"
                      className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 ml-1 flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-indigo-400" />
                      <span>Message <span className="text-indigo-400">*</span></span>
                    </label>
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      placeholder="Tell me about your project, timeline, or engineering opportunity..."
                      className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all resize-none disabled:opacity-50"
                    />
                  </div>

                  {/* Recaptcha */}
                  {RECAPTCHA_SITE_KEY && (
                    <div className="pt-1">
                      <div className="origin-left scale-90" ref={captchaRef} />
                    </div>
                  )}

                  {/* Dynamic Status Banner */}
                  <AnimatePresence>
                    {status.type && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={springs.snappy}
                        className={`flex items-start gap-3 p-4 rounded-2xl text-xs md:text-sm font-medium border ${
                          status.type === "success"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                        }`}
                      >
                        {status.type === "success" ? (
                          <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
                        ) : (
                          <AlertCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{status.message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Magnetic Sliding Circle Submit Button (Consistent with Header Architecture) */}
                  <div
                    ref={buttonMagnetic.ref}
                    onMouseMove={buttonMagnetic.handleMouseMove}
                    onMouseLeave={buttonMagnetic.handleMouseLeave}
                    className="w-full pt-2"
                  >
                    <motion.button
                      style={{ x: buttonMagnetic.x, y: buttonMagnetic.y }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={springs.snappy}
                      type="submit"
                      disabled={loading}
                      className="cursor-target group relative inline-flex items-center justify-center h-12 w-full overflow-hidden rounded-full p-1.5 ps-6 pe-12 text-sm font-semibold text-slate-200 hover:text-white transition-all duration-500 hover:ps-12 hover:pe-6 bg-slate-900/80 hover:bg-slate-800/90 border border-white/12 hover:border-indigo-500/50 shadow-lg shadow-black/40 hover:shadow-indigo-500/25 backdrop-blur-xl select-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 transition-all duration-500 leading-none whitespace-nowrap">
                        {loading ? "Transmitting message..." : "Send Message"}
                      </span>
                      <div className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-500 text-white border border-indigo-400/50 shadow-md shadow-indigo-600/30 transition-all duration-500 group-hover:right-[calc(100%-42px)] shrink-0">
                        {loading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ArrowUpRight size={16} className="transition-transform duration-500" />
                        )}
                      </div>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  );
}
