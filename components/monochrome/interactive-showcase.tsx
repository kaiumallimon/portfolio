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
        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs space-y-2.5">
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
              className="bg-zinc-800/80 px-2 py-0.5 rounded text-white border border-zinc-700 outline-none w-28 focus:border-zinc-500 text-[11px]"
              placeholder="e.g. CSE 411"
            />
          </div>
          <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-zinc-200 font-semibold text-[11px]">
              <span>{demoQuery || "CSE 411"} · Section A</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-300">Room 412</span>
            </div>
            <p className="text-[10px] text-zinc-400">10:00 AM — 12:00 PM · Dec 14</p>
          </div>
        </div>
      ),
    },
    unwrapped: {
      id: "unwrapped",
      name: "GitHub Unwrapped",
      badge: "Viral Utility",
      headline: "Annual Developer Contribution Retrospective",
      description: "Interactive Spotify-Wrapped-inspired recap transforming raw GitHub GraphQL telemetry into exportable cards.",
      metrics: "SVG/PNG Engine",
      route: "/tools/github-unwrapped",
      github: "https://github.com/kaiumallimon/github-unwrapped",
      tech: ["Next.js 16", "GitHub GraphQL", "html-to-image"],
      interactiveDemo: (
        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <span className="text-zinc-400 text-[11px]">Card Preview</span>
            <span className="text-zinc-500 text-[10px]">@kaiumallimon</span>
          </div>
          <div className="p-2.5 rounded bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-700 space-y-1.5">
            <div className="flex justify-between items-center text-[10px]">
              <span className="tracking-widest uppercase text-zinc-400">2026 Year</span>
              <span className="px-1 py-0.2 rounded bg-white text-zinc-950 font-bold">DIAMOND</span>
            </div>
            <div className="text-base font-sans font-bold text-white">1,420+ Commits</div>
          </div>
        </div>
      ),
    },
    cgpa: {
      id: "cgpa",
      name: "CGPA Calculator",
      badge: "Academic Engine",
      headline: "Predictive Grade Point & Planning",
      description: "Mathematical academic modeling calibrated to grading scale distributions and honors milestones.",
      metrics: "Exact Algorithm",
      route: "/tools/uiu-cgpa-calculator",
      github: "https://github.com/kaiumallimon/cgpa-calculator",
      tech: ["Next.js", "Zustand", "Radix UI"],
      interactiveDemo: (
        <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
            <span className="text-zinc-400 text-[11px]">Projection</span>
            <span className="text-emerald-400 text-[10px]">3.88 CGPA</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-1.5 rounded bg-zinc-950/80 border border-zinc-800">
              <div className="text-zinc-500">Current: <span className="text-white font-bold">3.82</span></div>
            </div>
            <div className="p-1.5 rounded bg-zinc-950/80 border border-zinc-800">
              <div className="text-zinc-500">Target: <span className="text-emerald-400 font-bold">3.90</span></div>
            </div>
          </div>
        </div>
      ),
    },
  };

  const current = showcaseItems[activeTab] || showcaseItems.routine;

  return (
    <section id="tools" className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
        {/* Section Header */}
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Interactive Showcase
          </h2>
          <span className="text-xs font-mono text-zinc-400">
            Live Interactive Demos
          </span>
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

        {/* Bento card */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                  {current.badge}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {current.metrics}
                </span>
              </div>

              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans">
                {current.headline}
              </h3>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {current.description}
              </p>

              <div className="flex items-center gap-2.5 pt-2">
                <Link
                  href={current.route}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-mono font-medium rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90 transition-opacity"
                >
                  <span>Launch Tool</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <a
                  href={current.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                >
                  <RiGithubLine className="w-3.5 h-3.5" />
                  <span>Repo</span>
                </a>
              </div>
            </div>

            <div>
              {current.interactiveDemo}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
