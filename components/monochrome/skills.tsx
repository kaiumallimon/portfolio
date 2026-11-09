"use client";

import React from "react";
import { RiLink } from "@remixicon/react";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { STACK_CATEGORIES } from "@/data/stack";
import { StackCard } from "./stack/stack-card";
import { EASE_OUT } from "@/lib/motion";

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
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {STACK_CATEGORIES.map((category) => (
            <StackCard key={category.id} category={category} />
          ))}
        </motion.div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
