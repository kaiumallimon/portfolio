"use client";

import React from "react";

interface StatChipProps {
  label: string;
}

export function StatChip({ label }: StatChipProps) {
  return (
    <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-xs border border-zinc-300/80 dark:border-zinc-700/80 bg-zinc-100/80 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 inline-flex items-center gap-1.5 shadow-2xs select-none">
      <span
        className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 shrink-0"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}
