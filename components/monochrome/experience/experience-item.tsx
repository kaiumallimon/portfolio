"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExperienceRole } from "@/data/experience";
import { EASE_OUT } from "@/lib/motion";

interface ExperienceItemProps {
  role: ExperienceRole;
  isLast: boolean;
}

export function ExperienceItem({ role, isLast }: ExperienceItemProps) {
  const isLight = Boolean(role.isLightEngagement);
  const shouldReduceMotion = useReducedMotion();

  return (
    <li className="relative pl-6 sm:pl-8 pb-5 last:pb-1 group list-none">
      {/* Vertical Timeline Track Line */}
      {!isLast && (
        <motion.div
          initial={shouldReduceMotion ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-10px" }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          style={{ transformOrigin: "top center" }}
          className="absolute left-[7px] sm:left-[11px] top-3.5 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800"
          aria-hidden="true"
        />
      )}

      {/* Timeline Node Dot */}
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{
          duration: 0.3,
          delay: shouldReduceMotion ? 0 : 0.1,
          ease: EASE_OUT,
        }}
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
      </motion.div>

      {/* Row: Role Title & Dates */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10px" }}
        transition={{
          duration: 0.35,
          delay: shouldReduceMotion ? 0 : 0.15,
          ease: EASE_OUT,
        }}
        className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
      >
        <h4 className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
          {role.role}
        </h4>

        {/* Dates: Right-aligned on desktop, stacked on mobile */}
        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0">
          {role.period}
        </span>
      </motion.div>
    </li>
  );
}
