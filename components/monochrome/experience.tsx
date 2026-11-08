"use client";

import React from "react";
import { IExperience } from "@/lib/models";
import { RiLink, RiBuildingLine, RiMapPinLine } from "@remixicon/react";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { EXPERIENCE_DATA } from "@/data/experience";
import { ExperienceItem } from "./experience/experience-item";

interface MonochromeExperienceProps {
  experiences?: Partial<IExperience>[];
}

export function MonochromeExperience({}: MonochromeExperienceProps = {}) {
  const shouldReduceMotion = useReducedMotion();

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#experience`);
      toast.success("Section link copied");
    }
  };

  return (
    <section
      id="experience"
      className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Section Header */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Experience
          </h2>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Experience"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider ml-1 px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded-xs">
            Leadership &amp; Engineering
          </span>
        </div>

        <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
          {EXPERIENCE_DATA.roles.length} roles · Single Track
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Unified Organization Header Card */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
              <RiBuildingLine className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50 font-sans">
                  {EXPERIENCE_DATA.organization}
                </h3>
                <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
                  Engineering Club
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
                {EXPERIENCE_DATA.tagline} · {EXPERIENCE_DATA.institution}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
            <RiMapPinLine className="w-3.5 h-3.5" />
            <span>{EXPERIENCE_DATA.location}</span>
          </div>
        </div>

        {/* Vertical Promotion Timeline */}
        <motion.ol
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          aria-label="Promotion path at UIU App Forum"
          className="relative pt-2"
        >
          {EXPERIENCE_DATA.roles.map((role, idx) => (
            <ExperienceItem
              key={role.id}
              role={role}
              isLast={idx === EXPERIENCE_DATA.roles.length - 1}
              initialExpanded={idx === 0} // First (newest) role expanded by default
            />
          ))}
        </motion.ol>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
