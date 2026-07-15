"use client";

import { MailIcon, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { IoLocationOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SiteSettings } from "@/types/content";

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
  }, []);

  const resetCaptcha = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      setStatus({ type: "error", message: "Email and message are required" });
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
    "w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 max-w-6xl mx-auto"
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative border border-white/10 bg-slate-900/30 backdrop-blur-md rounded-3xl p-8 md:p-12 overflow-hidden">
          {/* top accent line */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />
          {/* accent glow */}
          <div className="absolute -top-24 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-10 md:gap-12 relative z-10">
            {/* Left: pitch + contact */}
            <div className="space-y-8">
              <div className="space-y-4">
                {available && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Available for work
                  </span>
                )}
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Let&apos;s build something{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-violet-400 to-indigo-500">
                    extraordinary.
                  </span>
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  I am currently available for junior software engineering roles. Whether you have a
                  question or just want to say hi, I&apos;ll try my best to get back to you!
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-target"
                >
                  <span className="w-11 h-11 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <MailIcon size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm text-white truncate">{email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                  <span className="w-11 h-11 shrink-0 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                    <IoLocationOutline size={20} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm text-white">{location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Message *</label>
                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className={`${inputClass} resize-none overflow-hidden`}
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              {RECAPTCHA_SITE_KEY && (
                <div className="flex w-full justify-start">
                  <div className="origin-left scale-90 -mb-1.5" ref={captchaRef} />
                </div>
              )}

              {status.type && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                    status.type === "success"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle size={16} className="shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all text-sm flex items-center justify-center gap-2 group cursor-target disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
