"use client";

import React from "react";
import { EducationItem, EDUCATION_DATA } from "@/data/education";
import { RiLink } from "@remixicon/react";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";

interface MonochromeEducationProps {
  education?: EducationItem[];
}

export function MonochromeEducation({
  education = EDUCATION_DATA,
}: MonochromeEducationProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const items = education && education.length > 0 ? education : EDUCATION_DATA;

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#education`);
      toast.success("Section link copied");
    }
  };

  return (
    <section
      id="education"
      className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Education
          </h2>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Education"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Minimalist Vertical Timeline matching Experience section */}
      <div className="p-4 sm:p-6">
        <motion.ol
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          aria-label="Education history"
          className="relative pt-1 pl-1"
        >
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;

            return (
              <li
                key={item.id}
                className="relative pl-6 sm:pl-8 pb-5 last:pb-1 group list-none"
              >
                {/* Vertical Timeline Track Line */}
                {!isLast && (
                  <div
                    className="absolute left-[7px] sm:left-[11px] top-3.5 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800"
                    aria-hidden="true"
                  />
                )}

                {/* Timeline Node Dot */}
                <div
                  className="absolute left-[2px] sm:left-[6px] top-1 size-3.5 rounded-full border border-zinc-400 dark:border-zinc-500 bg-white dark:bg-zinc-950 flex items-center justify-center group-hover:border-zinc-900 dark:group-hover:border-zinc-100 transition-colors"
                  aria-hidden="true"
                >
                  <div className="size-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                </div>

                {/* Entry Content */}
                <div className="space-y-1">
                  {/* Row: Degree, Institution, and Dates */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
                        {item.degree}
                      </h3>
                      <span
                        className="text-zinc-400 dark:text-zinc-500 text-xs select-none"
                        aria-hidden="true"
                      >
                        @
                      </span>
                      <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                        {item.institution}
                      </span>
                    </div>

                    {/* Dates: Right-aligned on desktop, stacked on mobile */}
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tabular-nums shrink-0">
                      {item.period}
                    </span>
                  </div>

                  {/* Description / Subtext */}
                  {item.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </motion.ol>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
