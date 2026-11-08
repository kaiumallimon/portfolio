"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, ArrowRight, Sparkles, Copy, Check, MessageSquareCode } from "lucide-react";
import { RiMailLine, RiPhoneLine, RiTimeLine } from "@remixicon/react";
import { AgentThinking } from "@/components/application/agent-thinking/agent-thinking";
import { ISiteSettings } from "@/lib/models";
import { toast } from "sonner";

export function MonochromeContact({ settings }: { settings: ISiteSettings }) {
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
      {/* Section Header Bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Contact &amp; Dispatch
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Autonomous agentic intake &amp; direct telemetry routing
          </p>
        </div>
      </div>

      {/* Main CTA Section Grid */}
      <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Narrative & Action */}
        <div className="lg:col-span-7 space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>AGENTIC INTAKE ENGINE // ONLINE</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans leading-tight">
              Have an idea in mind, or looking to collaborate?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed max-w-xl">
              Skip boring static forms. Chat directly with my AI Dispatch Agent to calibrate project requirements, estimate timelines, and route your brief straight to my personal inbox.
            </p>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              prefetch={false}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-mono text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md group cursor-pointer"
            >
              <Bot className="size-4 text-emerald-400 dark:text-emerald-600 group-hover:rotate-6 transition-transform" />
              <span>Start Agentic Conversation</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 font-mono text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Copy direct email address"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              <span>{email}</span>
            </button>
          </div>

          {/* Direct Coordinate Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <RiPhoneLine className="size-3.5 text-zinc-400" />
              <a href="tel:+8801888387500" className="hover:underline">
                +880 1888 387 500
              </a>
            </div>
            <div className="flex items-center gap-2">
              <RiTimeLine className="size-3.5 text-zinc-400" />
              <span>Typical turnaround: &lt; 24 hrs (Dhaka GMT+6)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Agent Preview Card */}
        <div className="lg:col-span-5">
          <Link
            href="/contact"
            prefetch={false}
            className="group block relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 overflow-hidden shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer"
          >
            {/* Terminal Titlebar */}
            <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-100/60 dark:bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
                <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 ml-1">
                  kal-intake-agent.tsx
                </span>
              </div>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                ● Live Session
              </span>
            </div>

            {/* Chat Simulation Area */}
            <div className="p-4 space-y-3.5">
              {/* Agent Bubble */}
              <div className="flex items-start gap-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs">
                  <Bot className="size-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
                    AI Intake Agent
                  </span>
                  <div className="p-2.5 rounded-lg rounded-tl-none border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed shadow-xs">
                    Hello! What type of collaboration or project brief are you looking to calibrate today?
                  </div>
                </div>
              </div>

              {/* Sample Quick Chips */}
              <div className="pl-9 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                  🚀 Mobile &amp; Web App
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                  🤖 Multi-Agent AI
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                  💼 Full-Time Role
                </span>
              </div>

              {/* Live BoardUI AgentThinking Component */}
              <div className="pl-9 pt-1">
                <AgentThinking
                  variant="wave"
                  label="Ready to intake requirements..."
                  showTimer={true}
                  className="font-mono text-xs text-zinc-500"
                />
              </div>

              {/* Simulated Composer Pill */}
              <div className="pt-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 text-xs font-mono text-zinc-400 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 transition-colors">
                  <span>Click to open agentic chat room...</span>
                  <div className="size-6 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center">
                    <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
