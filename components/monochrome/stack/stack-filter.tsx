"use client";

import React from "react";
import { StackFilterKey, STACK_FILTER_KEYS } from "@/data/stack";

interface StackFilterProps {
  activeFilter: StackFilterKey;
  onSelectFilter: (filter: StackFilterKey) => void;
}

export function StackFilter({
  activeFilter,
  onSelectFilter,
}: StackFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter tech stack categories"
      className="flex items-center gap-1.5 flex-wrap"
    >
      <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 mr-1 select-none hidden sm:inline">
        Filter pipeline:
      </span>
      {STACK_FILTER_KEYS.map((key) => {
        const isActive = activeFilter === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => onSelectFilter(key)}
            className={`px-2.5 py-1 text-xs font-mono border rounded-xs transition-all cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-semibold shadow-xs scale-[1.02]"
                : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
