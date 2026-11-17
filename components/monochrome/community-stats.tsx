"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp, EASE_OUT, DURATION_NORMAL } from "@/lib/motion";

export function MonochromeCommunityStats() {
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    { label: "Years in Software Development", value: "3+" },
    { label: "Competitions", value: "4" },
    { label: "Wins & Top 3s", value: "4" },
    { label: "GitHub Stars", value: "22" },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION_NORMAL,
        ease: EASE_OUT,
      },
    },
  };

  return (
    <section className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: DURATION_NORMAL, ease: EASE_OUT }}
        className="py-4 border-b border-zinc-200 dark:border-zinc-800"
      >
        <h2 className="text-center text-xs font-mono font-medium tracking-wider text-zinc-500 uppercase">
          Key Metrics &amp; Milestones
        </h2>
      </motion.div>

      <motion.dl
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={containerVariants}
        className="grid gap-3.5 p-4 sm:p-6 font-mono text-xs sm:text-sm"
      >
        {stats.map((s, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="flex items-baseline gap-2"
          >
            <dt className="flex flex-1 items-baseline gap-2 text-zinc-600 dark:text-zinc-400 after:flex-1 after:translate-y-0.75 after:border-b after:border-dashed after:border-zinc-200 dark:after:border-zinc-800">
              {s.label}
            </dt>
            <dd className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
              <CountUp value={s.value} delay={idx * 0.06} />
            </dd>
          </motion.div>
        ))}
      </motion.dl>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
