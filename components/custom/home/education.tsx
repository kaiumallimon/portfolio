"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, ANIMATION_DELAY } from "@/lib/animations";
import { JetBrains_Mono } from "next/font/google";


const jb_mono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["latin"],
});

export default function EducationSectionComponent() {
  const education = [
    {
      institution: "United International University (UIU)",
      degree: "Bachelor of Science in Computer Science and Engineering",
      duration: "2022 - Mid 2026 (Expected)",
      location: "Madani Ave, Dhaka-1212",
    },
    {
      institution: "Safiuddin Sarker Academy & College",
      degree: "Higher Secondary Certificate (HSC) in Science",
      duration: "Late 2018 - 2020",
      location: "Tongi, Gazipur",
    },
    {
      institution: "Daudpur Putina High School",
      degree: "Secondary School Certificate (SSC) in Science",
      duration: "2012 - Early 2018",
      location: "Rupganj, Narayanganj",
    },
  ];

  return (
    <motion.section
      className="relative z-10 px-6 py-20 max-w-6xl mx-auto flex flex-col items-center"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Section heading */}
      <motion.h2
        variants={fadeInUp}
        custom={ANIMATION_DELAY.short}
        className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-3"
      >
        Education
      </motion.h2>

      <motion.p
        variants={fadeInUp}
        custom={ANIMATION_DELAY.medium}
        className={`max-w-2xl text-center text-sm text-gray-600 mb-10 ${jb_mono.className}`}
      >
        {"{ Here is a summary of my educational background and qualifications. }"}
      </motion.p>

      {/* Education list */}
      <div className="w-full max-w-4xl flex flex-col divide-y divide-gray-300 dark:divide-gray-700">
        {education.map((edu, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            custom={ANIMATION_DELAY.medium + index * 0.1}
            className="flex justify-between items-center px-4 py-5 transition-colors duration-300 cursor-default hover:bg-black hover:text-white"
          >
            <div className="flex flex-col">
              <h3 className="text-lg md:text-xl font-semibold">{edu.institution}</h3>
              <p className="text-gray-400">{edu.degree}</p>
            </div>
            <div className="text-gray-400 text-right text-sm">
              {edu.duration} <br />
              {edu.location}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
