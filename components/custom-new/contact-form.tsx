"use client";

import { MailIcon, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { IoLocationOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SiteSettings } from "@/types/content";
import { springs, useMagnetic } from "@/lib/motion";
import { ScrollRevealSection } from "@/components/shared/scroll-reveal";

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

  const RECAPTCHA_SITE_KEY = recaptchaSiteKey ?? null;

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const buttonMagnetic = useMagnetic(0.25);

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
        setStatus({ type: "success", message: "Message sent successfully! I'll get back to you soon." });
        setFormData({ name: "", email: "", message: "" });
        resetCaptcha();
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send message. Please try again." });
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

  const inputClass =
    "w-full bg-slate-950/60 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50";

  return (
    <ScrollRevealSection
      id="contact"
      className="py-24 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative border border-white/10 bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-8 md:p-14 overflow-hidden shadow-2xl shadow-black/50">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />
          <div className="absolute -top-28 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-10 md:gap-14 relative z-10">
            {/* Left: Info */}
            <div className="space-y-8 flex flex-col justify-between">
              <div className="space-y-4">
                {available && (
                  <span className="gsap-eyebrow inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                    </span>
                    Available for work
                  </span>
                )}

                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight perspective-1000">
                  <span className="inline-block overflow-hidden mr-2.5">
                    <span className="gsap-word inline-block">Let&apos;s</span>
                  </span>
                  <span className="inline-block overflow-hidden mr-2.5">
                    <span className="gsap-word inline-block">build</span>
                  </span>
                  <span className="inline-block overflow-hidden mr-2.5">
                    <span className="gsap-word inline-block">something</span>
                  </span>
                  <span className="inline-block overflow-hidden">
                    <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300">
                      exceptional.
                    </span>
                  </span>
                </h2>

                <p className="gsap-subtitle text-slate-400 text-sm md:text-base leading-relaxed">
                  I am currently open to full-stack and mobile software engineering opportunities. Whether you have a project idea, proposal, or question, feel free to reach out!
                </p>
              </div>

              <div data-gsap-card className="space-y-3">
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/4 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-target"
                >
                  <span className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <MailIcon size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium">Direct Email</p>
                    <p className="text-sm font-semibold text-white truncate">{email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/4">
                  <span className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                    <IoLocationOutline size={22} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Location</p>
                    <p className="text-sm font-semibold text-white">{location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form (renders AFTER headline & subtitle) */}
            <form data-gsap-card className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                  placeholder="e.g. Sarah Connor"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className={inputClass}
                  placeholder="e.g. sarah@company.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">Message *</label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className={`${inputClass} resize-none`}
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              {RECAPTCHA_SITE_KEY && (
                <div className="pt-1">
                  <div className="origin-left scale-90" ref={captchaRef} />
                </div>
              )}

              {status.type && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={springs.snappy}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl text-xs md:text-sm font-medium ${
                    status.type === "success"
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/10 text-red-300 border border-red-500/30"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle size={18} className="shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle size={18} className="shrink-0 text-red-400" />
                  )}
                  <span>{status.message}</span>
                </motion.div>
              )}

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
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-2xl font-semibold shadow-xl shadow-indigo-500/25 transition-all text-sm flex items-center justify-center gap-2 group cursor-target disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  );
}
