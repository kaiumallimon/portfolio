"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { StackCategory } from "@/data/stack";
import { TechTag } from "./tech-tag";
import { EASE_OUT } from "@/lib/motion";

interface StackCardProps {
  category: StackCategory;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
    },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

export function StackCard({ category }: StackCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-2">
        <h3 className="text-xs sm:text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100">
          {category.title}
        </h3>
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-15px" }}
        variants={containerVariants}
        className="flex flex-wrap gap-1.5"
      >
        {category.items.map((item) => (
          <motion.div key={item.name} variants={tagVariants}>
            <TechTag item={item} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
