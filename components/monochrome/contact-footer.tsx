"use client";

import { useState } from "react";
import { Send, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { ISiteSettings } from "@/lib/models";

export function MonochromeContactFooter({ settings }: { settings: ISiteSettings }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message.");
      }

      toast.success("Message transmitted successfully via secure SMTP (Port 465).");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Unable to transmit message at this moment. Please email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section id="contact" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        {/* Header bar */}
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
              Contact &amp; Dispatch
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Direct telemetry to {settings.email || "kaiummallimon@gmail.com"}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ada@lovelace.io"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Message
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Brief project outline, proposal or inquiry..."
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-mono text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Transmitting via SMTP 465..." : "Send Message"}</span>
            </button>
          </form>
        </div>

        <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
      </section>

      {/* Footer bar */}
      <footer className="w-full bg-white dark:bg-zinc-950 text-xs font-mono text-zinc-500">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              kaium.dev
            </span>
            <span>·</span>
            <span>© {new Date().getFullYear()} Kaium Al Limon</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Dhaka, BD (GMT+6)</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
              title="Return to top"
              aria-label="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
