"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare, ArrowRight, Copy, Check } from "lucide-react";
import { ISiteSettings } from "@/lib/models";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

export function MonochromeContact({ settings }: { settings: ISiteSettings }) {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const email = settings.email || "kalimon291@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    toast.success("Email address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Clean Centered CTA Stage */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="px-4 sm:px-6 py-14 sm:py-20 text-center max-w-2xl mx-auto space-y-6"
      >
        {/* Subtle Online Indicator */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-mono text-xs">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 dark:bg-zinc-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
          </span>
          <span>Online // Ready to Connect</span>
        </div>

        {/* Clean Headline & Copy */}
        <div className="space-y-3">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Let’s build something together.
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono max-w-lg mx-auto leading-relaxed">
            Calibrate project requirements, explore collaboration, and route your brief directly to my inbox.
          </p>
        </div>

        {/* Action Button Pair */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/contact"
            prefetch={false}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-mono text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm group cursor-pointer"
          >
            <MessageSquare className="size-3.5 text-zinc-300 dark:text-zinc-600 group-hover:text-white dark:group-hover:text-zinc-950 group-hover:scale-110 transition-all" />
            <span>Let&apos;s Talk</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-mono text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-2xs"
            title="Copy email to clipboard"
          >
            {copied ? <Check className="size-3.5 text-zinc-950 dark:text-zinc-50" /> : <Copy className="size-3.5" />}
            <span>{email}</span>
          </button>
        </div>

        {/* Sub-telemetry footnote */}
        <div className="pt-2 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
          Typical response turnaround &lt; 24 hrs // Dhaka (GMT+6)
        </div>
      </motion.div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
