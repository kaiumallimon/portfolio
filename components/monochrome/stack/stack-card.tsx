"use client";

import React from "react";
import { StackCategory } from "@/data/stack";
import { TechTag } from "./tech-tag";

interface StackCardProps {
  category: StackCategory;
}

export function StackCard({ category }: StackCardProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-2">
        <h3 className="text-xs sm:text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100">
          {category.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {category.items.map((item) => (
          <div key={item.name}>
            <TechTag item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
