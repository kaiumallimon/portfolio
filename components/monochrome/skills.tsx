"use client";

import { RiLink } from "@remixicon/react";
import { toast } from "sonner";

export function MonochromeSkills({
  skills,
}: {
  skills: { category: string; skills: string[] }[];
}) {
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}#stack`);
    toast.success("Section link copied");
  };

  return (
    <section id="stack" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Stack
          </h2>
          <sup className="text-xs font-mono text-zinc-400">({skills.length})</sup>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Stack"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((group) => (
          <div
            key={group.category}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <span className="text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {group.category}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 tabular-nums">
                {group.skills.length} techs
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
