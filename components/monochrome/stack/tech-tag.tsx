"use client";

import React from "react";
import { TechItem } from "@/data/stack";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TechTagProps {
  item: TechItem;
}

export function TechTag({ item }: TechTagProps) {
  const isPrimary = Boolean(item.isPrimary);

  const tagContent = (
    <span
      tabIndex={item.note ? 0 : undefined}
      className={`px-2 py-0.5 text-[11px] font-mono border transition-all cursor-default select-none inline-flex items-center gap-1.5 rounded-xs outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 ${
        isPrimary
          ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100/90 dark:bg-zinc-800/80 text-zinc-950 dark:text-zinc-50 font-semibold shadow-xs hover:border-zinc-500 dark:hover:border-zinc-400"
          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      {isPrimary && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"
          aria-hidden="true"
        />
      )}
      <span>{item.name}</span>
    </span>
  );

  if (!item.note) {
    return tagContent;
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{tagContent}</TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={5}
          className="font-mono text-[10px] bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 border border-zinc-700 dark:border-zinc-300 py-1 px-2 shadow-md z-50 pointer-events-none"
        >
          {item.note}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
