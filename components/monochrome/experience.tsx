"use client";

import React from "react";
import { IExperience } from "@/lib/models";
import { RiLink, RiBuildingLine, RiMapPinLine } from "@remixicon/react";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { EXPERIENCE_DATA } from "@/data/experience";
import { ExperienceItem } from "./experience/experience-item";
import { EASE_OUT } from "@/lib/motion";

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
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Co-Curricular &amp; Engineering Leadership
          </h2>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Co-Curricular & Engineering Leadership"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Organization Header */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
              <RiBuildingLine className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50 font-sans">
                {EXPERIENCE_DATA.organization}
              </h3>
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

        {/* Minimalist Timeline of Roles */}
        <motion.ol
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          aria-label="Roles at UIU App Forum"
          className="relative pt-1 pl-1"
        >
          {EXPERIENCE_DATA.roles.map((role, idx) => (
            <ExperienceItem
              key={role.id}
              role={role}
              isLast={idx === EXPERIENCE_DATA.roles.length - 1}
            />
          ))}
        </motion.ol>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
