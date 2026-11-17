"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, DURATION_NORMAL } from "@/lib/motion";

const subscribe = () => () => {};
const getGreetingSnapshot = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
};
const getGreetingServerSnapshot = () => "Hello";

export function MonochromeAbout() {
  const greeting = useSyncExternalStore(
    subscribe,
    getGreetingSnapshot,
    getGreetingServerSnapshot
  );
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
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
    <section id="about" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={containerVariants}
        className="p-4 sm:p-6 space-y-4"
      >
        <motion.h2
          variants={itemVariants}
          className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans"
        >
          {greeting}
        </motion.h2>

        <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
          <motion.p variants={itemVariants} className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              I&apos;m <strong>Kaium Al Limon</strong>, a software engineer who enjoys turning ideas and complex problems into practical, well-engineered software.
            </span>
          </motion.p>

          <motion.p variants={itemVariants} className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              A Computer Science &amp; Engineering graduate from{" "}
              <a
                href="https://www.uiu.ac.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100"
              >
                United International University (UIU)
              </a>
              , I specialize in cross-platform mobile development with Flutter, modern web applications with Next.js, and backend engineering. I care about clean architecture, thoughtful user experiences, performance, and building software that solves actual problems.
            </span>
          </motion.p>

          <motion.p variants={itemVariants} className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              Over the years, I&apos;ve worked on several academic, personal, and collaborative projects, taking ideas from initial concepts to functional products.
            </span>
          </motion.p>
        </div>
      </motion.div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
