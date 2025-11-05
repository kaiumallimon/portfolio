

'use client';

import LogoLoop from "@/components/LogoLoop";
import { ANIMATION_DELAY, fadeInUp } from "@/lib/animations";
import { motion } from "framer-motion";
import { Geist, JetBrains_Mono } from "next/font/google";
import { SiFlutter, SiNextdotjs } from "react-icons/si";


const jb_mono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["latin"],
});





export default function SkillsSection() {
  const skills = [
    // Flutter / Mobile
    "Dart",
    "Flutter Widgets",
    "State Management (Provider, Bloc, GetX)",
    "SQLite & Hive",
    "RESTful APIs",
    "Firebase Integration",
    "Custom UI",
    "Cross-Platform Development",
    "Responsive Design",
    "Third-Party SDK Integrations",
    "Continuous Learning",
    "Supabase",
    "Dependency Injection",
    "Deep Linking",
    "Platform-Channel Communication",
    "Payment Gateway Integration",

    // Next.js / Web
    "HTML & CSS",
    "JavaScript / TypeScript",
    "React & Next.js",
    "Tailwind CSS",
    "Framer Motion",
    "Zustand",
    "SSR & Performance Optimization",
    "Unit Testing",
    "REST APIs",
    "Responsive Web Design",
    "Vercel Deployment",
    "Git & GitHub",

    // Other Programming Skills
    "Problem Solving",
    "C (Core)",
    "C++ (Core)",
    "Java (Core)",
    "Python (Core)",
    "FastAPI (Intermediate)",
    "Langchain & LLMs (Intermediate)",
    "SQL & Databases",
    "Data Structures & Algorithms",
    "OOP Principles",
    "Design Patterns",
    "MySQL",
    "MongoDB",
  ];

  return (
    <section className="relative z-10 px-6 py-15 max-w-6xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-3 flex items-center gap-2">
        Skills I Do Have
      </h2>

      <motion.p
        variants={fadeInUp}
        custom={ANIMATION_DELAY.medium}
        className={`max-w-2xl text-center text-sm text-gray-600 mb-10 ${jb_mono.className}`}
      >
        {"{ While completing my projects, I've gained experience with a variety of technologies and tools, including but not limited to: }"}
      </motion.p>

      <div className="w-full flex flex-wrap justify-center gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 text-sm font-medium text-gray-600
            border rounded-none bg-transparent cursor-default select-none transition-all duration-300 hover:bg-gray-700 hover:border-gray-700 hover:text-white"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
