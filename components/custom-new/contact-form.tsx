"use client";

import { MailIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { IoLocationOutline } from "react-icons/io5";
import { useState } from "react";
import { motion } from "framer-motion";
import type { SiteSettings } from "@/types/content";

export default function ContactForm({
  settings,
}: {
  settings: SiteSettings | null;
}) {
  const email = settings?.email || "kalimon291@gmail.com";
  const location = settings?.location || "Dhaka, Bangladesh";

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      setStatus({ type: "error", message: "Email and message are required" });
      return;
    }
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: "success", message: "Message sent successfully! I'll get back to you soon." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send message. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6"
    >
      <div className="max-w-4xl mx-auto border border-white/10 bg-slate-900/30 backdrop-blur-md rounded-3xl p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

        <div className="grid md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Let's build something extraordinary.</h2>
            <p className="text-slate-400">
              I am currently available for junior software engineering roles. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <MailIcon className="text-indigo-400" size={20} />
                </div>
                <span className="text-sm">{email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <IoLocationOutline size={20} className="text-green-400" />
                </div>
                <span className="text-sm">{location}</span>
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 ml-1">Message *</label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-700 resize-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            {status.type && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                status.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                {status.type === "success" ? <CheckCircle size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                <span>{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 transition-all text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-target"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}
