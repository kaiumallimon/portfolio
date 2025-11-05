"use client";

import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { motion } from "framer-motion";
import "react-tooltip/dist/react-tooltip.css";

// Import animations from your existing lib
import { fadeInUp, staggerContainer, ANIMATION_DELAY } from "@/lib/animations";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";


const jb_mono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["latin"],
});

export default function GithubContributionsGraphComponent() {
  return (
    <motion.section
      className="relative z-10 px-6 py-15 max-w-6xl mx-auto flex flex-col items-center"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Heading */}
      <motion.h2
        variants={fadeInUp}
        custom={ANIMATION_DELAY.short}
        className="font-extrabold text-3xl md:text-4xl text-center mb-3 text-gray-900"
      >
        GitHub Insights
      </motion.h2>

      {/* Subheading */}
      <motion.p
        variants={fadeInUp}
        custom={ANIMATION_DELAY.medium}
        className={`max-w-2xl text-center text-sm text-gray-600 mb-10 ${jb_mono.className}`}
      >
        {"{"} Contributions over the past year 
        
        {" }"}
      </motion.p>


      {/* GitHub Calendar */}
      <motion.div
        variants={fadeInUp}
        custom={ANIMATION_DELAY.long}
        className="w-full overflow-x-auto"
      >
        <div className="inline-block min-w-max">
          <GitHubCalendar
            username="kaiumallimon"
            colorScheme="light"
            showWeekdayLabels
            weekStart={6}
            blockSize={15}
            renderBlock={(block, activity) =>
              React.cloneElement(block as any, {
                "data-tooltip-id": "github-tooltip",
                "data-tooltip-content": `${activity.count} contributions on ${activity.date}`,
              })
            }
          />
        </div>
        <ReactTooltip id="github-tooltip" />
      </motion.div>
    </motion.section>
  );
}
