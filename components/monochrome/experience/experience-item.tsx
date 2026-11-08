"use client";

import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine, RiGitCommitLine } from "@remixicon/react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExperienceRole } from "@/data/experience";
import { StatChip } from "./stat-chip";

interface ExperienceItemProps {
  role: ExperienceRole;
  isLast: boolean;
  initialExpanded?: boolean;
}

export function ExperienceItem({
  role,
  isLast,
  initialExpanded = false,
}: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const shouldReduceMotion = useReducedMotion();

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const isLight = Boolean(role.isLightEngagement);

  return (
    <li className="relative pl-6 sm:pl-8 pb-8 group list-none">
      {/* Vertical Timeline Track Line */}
      {!isLast && (
        <div
          className="absolute left-[7px] sm:left-[11px] top-4 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800"
          aria-hidden="true"
        />
      )}

      {/* Promotion Marker Badge between roles */}
      {role.isPromoted && (
        <div
          className="absolute -top-3.5 left-4 sm:left-6 z-10 px-2 py-0.5 rounded-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-xs"
          title="Promoted from Junior Executive to Head of Software & Innovation"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Promoted</span>
        </div>
      )}

      {/* Timeline Node Dot */}
      <div
        className={`absolute z-10 rounded-full border bg-white dark:bg-zinc-950 flex items-center justify-center transition-colors ${
          isLight
            ? "left-[4px] sm:left-[8px] top-1.5 size-2 border-zinc-300 dark:border-zinc-700"
            : "left-[2px] sm:left-[6px] top-1 size-3.5 border-zinc-400 dark:border-zinc-500 group-hover:border-zinc-900 dark:group-hover:border-zinc-100"
        }`}
        aria-hidden="true"
      >
        {!isLight && (
          <div className="size-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
        )}
      </div>

      <div className="space-y-3">
        {/* Header Row: Role Title, Decorative Git Hash, and Dates */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50 font-sans tracking-tight">
              {role.role}
            </h3>

            {/* Decorative Git commit hash (hidden from screen-readers) */}
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-0.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1 py-0.2 rounded-xs border border-zinc-200 dark:border-zinc-800"
              title={`Git log commit ${role.gitHash}`}
            >
              <RiGitCommitLine className="w-2.5 h-2.5" />
              <span>{role.gitHash}</span>
            </span>
          </div>

          {/* Dates: Right-aligned on desktop, stacked on mobile */}
          <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
            {role.period}
          </div>
        </div>

        {/* Role Summary Description */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
          {role.description}
        </p>

        {/* Impact Stat Chips */}
        {role.statChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {role.statChips.map((chip, idx) => (
              <StatChip key={idx} label={chip} />
            ))}
          </div>
        )}

        {/* Skill Tags */}
        {role.skillTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 mr-0.5 select-none">
              Skills:
            </span>
            {role.skillTags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.2 text-[10px] font-mono border border-zinc-200 dark:border-zinc-800 rounded-xs bg-zinc-50/70 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Collapsible Accomplishment Bullets */}
        {role.bullets.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={toggleExpand}
              aria-expanded={isExpanded}
              aria-controls={`bullets-${role.id}`}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded-xs py-0.5"
            >
              {isExpanded ? (
                <>
                  <RiArrowUpSLine className="w-3.5 h-3.5" />
                  <span>Hide key achievements ({role.bullets.length})</span>
                </>
              ) : (
                <>
                  <RiArrowDownSLine className="w-3.5 h-3.5" />
                  <span>View key achievements ({role.bullets.length})</span>
                </>
              )}
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  id={`bullets-${role.id}`}
                  initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-1.5 pt-2 pl-1 border-l border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 font-sans mt-1">
                    {role.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 pl-2">
                        <span className="text-zinc-400 dark:text-zinc-500 font-mono select-none">
                          —
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </li>
  );
}
