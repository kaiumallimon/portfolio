"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RiLink } from "@remixicon/react";
import { toast } from "sonner";
import { STACK_CATEGORIES } from "@/data/stack";
import { StackCard } from "./stack/stack-card";
import { EASE_OUT, DURATION_NORMAL } from "@/lib/motion";

interface MonochromeSkillsProps {
  skills?: { category: string; skills: string[] }[];
}

export function MonochromeSkills({}: MonochromeSkillsProps = {}) {
  const shouldReduceMotion = useReducedMotion();

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#stack`);
      toast.success("Section link copied");
    }
  };

  return (
    <section
      id="stack"
      className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Header bar: Simple Title and Section Copy Link */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
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
        </div>
      </div>

      {/* Minimalist 2-column Grid of Tech Categories */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STACK_CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: DURATION_NORMAL,
                delay: shouldReduceMotion ? 0 : (idx % 2) * 0.07 + Math.floor(idx / 2) * 0.05,
                ease: EASE_OUT,
              }}
              className="h-full flex flex-col"
            >
              <StackCard category={category} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
