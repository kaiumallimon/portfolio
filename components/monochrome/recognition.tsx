"use client";

import { IAchievementItem } from "@/lib/data-service";
import { RiLink, RiTrophyLine, RiMedalLine } from "@remixicon/react";
import { toast } from "sonner";

export function MonochromeRecognition({
  achievements,
}: {
  achievements: IAchievementItem[];
}) {
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}#recognition`);
    toast.success("Section link copied");
  };

  return (
    <section id="recognition" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Recognition
          </h2>
          <sup className="text-xs font-mono text-zinc-400">({achievements.length})</sup>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Recognition"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-6 space-y-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                {item.awardRank === "champion" ? (
                  <RiTrophyLine className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <RiMedalLine className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                  {item.award}
                </h3>
                <span className="text-zinc-400 text-xs">@</span>
                <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                  {item.title}
                </span>
                {item.awardRank === "champion" && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                    Champion
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-zinc-400 tabular-nums">
                {item.date}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
              <span>
                Project: <strong className="text-zinc-900 dark:text-zinc-100">{item.project}</strong>
              </span>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">•</span>
              <span>
                Team: <strong className="text-zinc-900 dark:text-zinc-100">{item.team}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
