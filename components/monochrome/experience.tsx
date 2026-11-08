"use client";

import { IExperience } from "@/lib/models";
import { RiLink } from "@remixicon/react";
import { toast } from "sonner";

export function MonochromeExperience({
  experiences,
}: {
  experiences: Partial<IExperience>[];
}) {
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}#experience`);
    toast.success("Section link copied");
  };

  return (
    <section id="experience" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Experience
          </h2>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Experience"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-6 space-y-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                  {exp.role}
                </h3>
                <span className="text-zinc-400 text-xs">@</span>
                <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                  {exp.company}
                </span>
                {exp.current && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-zinc-400 tabular-nums">
                {exp.period}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              {exp.description}
            </p>

            {exp.highlights && exp.highlights.length > 0 && (
              <ul className="space-y-1 pt-1.5 text-xs text-zinc-500 font-sans">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-zinc-400 font-mono select-none">—</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
