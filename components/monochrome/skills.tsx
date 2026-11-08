"use client";

import React, { useState } from "react";
import { RiLink, RiArrowRightLine, RiArrowDownLine } from "@remixicon/react";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { STACK_PIPELINE, StackFilterKey } from "@/data/stack";
import { StackCard } from "./stack/stack-card";
import { StackFilter } from "./stack/stack-filter";

interface MonochromeSkillsProps {
  skills?: { category: string; skills: string[] }[];
}

export function MonochromeSkills({}: MonochromeSkillsProps = {}) {
  const [activeFilter, setActiveFilter] = useState<StackFilterKey>("All");
  const shouldReduceMotion = useReducedMotion();

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#stack`);
      toast.success("Section link copied");
    }
  };

  const totalTechs = STACK_PIPELINE.reduce(
    (acc, stage) => acc + stage.items.length,
    0
  );

  return (
    <section
      id="stack"
      className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Header bar: Title, link, and stage count */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Stack
          </h2>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Stack"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1 px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded-xs">
            Shipment Pipeline
          </span>
        </div>

        {/* Total tech counter */}
        <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
          {totalTechs} technologies · 4 stages
        </span>
      </div>

      {/* Filter and Pipeline Description Sub-bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <StackFilter
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>dot indicates primary core tool</span>
        </div>
      </div>

      {/* Pipeline Grid Layout: Connected stages of how I ship products */}
      <div className="p-4 sm:p-6 relative">
        {/* Mobile vertical line connector */}
        <div
          className="absolute left-[27px] top-6 bottom-6 w-px bg-zinc-200 dark:bg-zinc-800 sm:hidden -z-0"
          aria-hidden="true"
        />

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10"
        >
          {STACK_PIPELINE.map((stage, idx) => {
            const isDimmed =
              activeFilter !== "All" && stage.filterKey !== activeFilter;

            return (
              <div key={stage.id} className="relative group">
                <StackCard
                  category={stage}
                  isDimmed={isDimmed}
                  stepIndex={idx}
                  totalSteps={STACK_PIPELINE.length}
                />

                {/* Desktop horizontal pipeline indicator between card 1 and 2 */}
                {idx === 0 && (
                  <div
                    className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center size-6 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 shadow-xs"
                    title="Pipeline Flow: Mobile & Core to Backend & API"
                  >
                    <RiArrowRightLine className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Desktop horizontal pipeline indicator between card 3 and 4 */}
                {idx === 2 && (
                  <div
                    className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 items-center justify-center size-6 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 shadow-xs"
                    title="Pipeline Flow: AI & Systems to Web & DevOps"
                  >
                    <RiArrowRightLine className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Mobile vertical connector arrow */}
                {idx < STACK_PIPELINE.length - 1 && (
                  <div className="flex sm:hidden justify-center py-1 text-zinc-300 dark:text-zinc-700">
                    <RiArrowDownLine className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
