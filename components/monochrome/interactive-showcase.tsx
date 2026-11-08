"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RiGithubLine } from "@remixicon/react";

interface ShowcaseItem {
  id: string;
  name: string;
  badge: string;
  headline: string;
  description: string;
  metrics: string;
  route: string;
  github: string;
  tech: string[];
  interactiveDemo: React.ReactNode;
}

export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<string>("routine");
  const [demoQuery, setDemoQuery] = useState<string>("CSE 411");

  const showcaseItems: Record<string, ShowcaseItem> = {
    routine: {
      id: "routine",
      name: "UIU Routine Finder",
      badge: "4,000+ Students",
      headline: "Instant Exam & Class Schedule Parser",
      description: "Sub-millisecond regex search indexing 600+ university course batches with conflict detection.",
      metrics: "< 50ms Latency",
      route: "/tools/uiu-exam-routine",
      github: "https://github.com/kaiumallimon/exam-routine",
      tech: ["FastAPI", "React 19", "Tailwind CSS"],
      interactiveDemo: (
        <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <span className="text-zinc-400 text-[11px]">Live Simulator</span>
            <span className="text-emerald-400 text-[10px]">● Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px]">$ query:</span>
            <input
              type="text"
              value={demoQuery}
              onChange={(e) => setDemoQuery(e.target.value)}
              className="bg-zinc-800/80 px-2 py-0.5 rounded text-white border border-zinc-700 outline-none w-32 focus:border-zinc-500 text-[11px]"
              placeholder="e.g. CSE 411"
            />
          </div>
          <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-200 font-semibold text-[11px]">
              <span>{demoQuery || "CSE 411"} · Section A</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Room 412</span>
            </div>
            <p className="text-[10px] text-zinc-400">10:00 AM — 12:00 PM · Dec 14</p>
          </div>
        </div>
      ),
    },
    unwrapped: {
      id: "unwrapped",
      name: "GitHub Unwrapped",
      badge: "GraphQL Telemetry",
      headline: "Contribution Telemetry Retrospective",
      description: "Generates year-in-review Spotify-wrapped developer infographics with dynamic streak calculations.",
      metrics: "SVG & PNG Canvas",
      route: "/tools/github-unwrapped",
      github: "https://github.com/kaiumallimon/github-unwrapped",
      tech: ["Next.js", "GraphQL", "Tailwind CSS"],
      interactiveDemo: (
        <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <span className="text-zinc-400 text-[11px]">Retro Canvas Preview</span>
            <span className="text-sky-400 text-[10px]">● 2026 Engine</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-[11px] text-zinc-400">Total Commits</div>
              <div className="text-base font-bold text-white tabular-nums">1,842</div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-400">Top Language</div>
              <div className="text-base font-bold text-white">Dart / TS</div>
            </div>
          </div>
        </div>
      ),
    },
    cgpa: {
      id: "cgpa",
      name: "CGPA Calculator",
      badge: "Academic Suite",
      headline: "Target GPA Predictive Forecaster",
      description: "Fast multi-term GPA simulator with target-grade threshold planning and university grade scale presets.",
      metrics: "Instant State",
      route: "/tools/cgpa-calculator",
      github: "https://github.com/kaiumallimon/cgpa-calc",
      tech: ["TypeScript", "BoardUI", "LocalStorage"],
      interactiveDemo: (
        <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <span className="text-zinc-400 text-[11px]">Cumulative GPA</span>
            <span className="text-emerald-400 text-[10px]">● High Distinction</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-2xl font-bold text-white tabular-nums font-sans">3.88</div>
            <div className="text-[11px] text-zinc-400">Completed Credits: 114 / 138</div>
          </div>
        </div>
      ),
    },
  };

  const current = showcaseItems[activeTab] || showcaseItems.routine;

  return (
    <section id="tools" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Interactive Showcase
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Production utilities and live interactive simulators
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 w-fit overflow-x-auto">
          {Object.values(showcaseItems).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === item.id
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-medium"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bento body */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
              {current.badge}
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {current.metrics}
            </span>
          </div>

          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
            {current.headline}
          </h3>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            {current.description}
          </p>

          <div className="flex items-center gap-2.5 pt-2">
            <Link
              href={current.route}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:opacity-90 transition-opacity"
            >
              <span>Launch Tool</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href={current.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              <RiGithubLine className="w-3.5 h-3.5" />
              <span>Repository</span>
            </a>
          </div>
        </div>

        <div>
          {current.interactiveDemo}
        </div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
