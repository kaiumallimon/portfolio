"use client";

import React from "react";

export function MonochromeCommunityStats() {
  const stats = [
    { label: "Annual GitHub contributions", value: "3,553" },
    { label: "Public repositories", value: "100" },
    { label: "UIU CSE Project Show honors", value: "4 podiums" },
    { label: "UIU App Forum leadership tenure", value: "3+ years" },
  ];

  return (
    <section className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-center text-xs font-mono font-medium tracking-wider text-zinc-500 uppercase">
          Growing with the community
        </h2>
      </div>

      <dl className="grid gap-3.5 p-4 sm:p-6 font-mono text-xs sm:text-sm">
        {stats.map((s, idx) => (
          <div key={idx} className="flex items-baseline gap-2">
            <dt className="flex flex-1 items-baseline gap-2 text-zinc-600 dark:text-zinc-400 after:flex-1 after:translate-y-0.75 after:border-b after:border-dashed after:border-zinc-200 dark:after:border-zinc-800">
              {s.label}
            </dt>
            <dd className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
