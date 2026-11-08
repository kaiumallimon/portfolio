"use client";

import React from "react";
import { StackCategory } from "@/data/stack";
import { TechTag } from "./tech-tag";

interface StackCardProps {
  category: StackCategory;
  isDimmed: boolean;
  stepIndex: number;
  totalSteps: number;
}

export function StackCard({
  category,
  isDimmed,
  stepIndex,
  totalSteps,
}: StackCardProps) {
  return (
    <div
      className={`relative border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ${
        isDimmed
          ? "opacity-30 grayscale-[70%] scale-[0.99] select-none"
          : "opacity-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xs"
      }`}
    >
      <div>
        {/* Card Header: Stage Number, Category Title, and Techs Counter */}
        <div className="flex items-start justify-between gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                STAGE {category.stageNumber}
              </span>
              <h3 className="text-xs sm:text-sm font-mono font-semibold text-zinc-950 dark:text-zinc-50">
                {category.title}
              </h3>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {category.subtitle}
            </p>
          </div>

          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 tabular-nums px-1.5 py-0.5 border border-zinc-100 dark:border-zinc-800/80 rounded-xs shrink-0">
            {category.items.length} techs
          </span>
        </div>

        {/* Short Stage Description */}
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans mb-3.5 leading-relaxed">
          {category.description}
        </p>

        {/* Tech Badges / Items */}
        <div className="flex flex-wrap gap-1.5">
          {category.items.map((item) => (
            <TechTag key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* Subtle Pipeline Step indicator at bottom */}
      <div className="mt-4 pt-2.5 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500 select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span>Pipeline Stage {stepIndex + 1} of {totalSteps}</span>
        </span>
        <span className="italic opacity-70">
          {category.filterKey}
        </span>
      </div>
    </div>
  );
}
