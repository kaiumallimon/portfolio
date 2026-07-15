"use client";

import { Globe, Server, Brain } from "lucide-react";
import { FaMobile } from "react-icons/fa";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import type { SkillCategory } from "@/types/content";

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  FaMobile,
  Server,
  Globe,
  Brain,
};

// Distinct accent per toolkit card (icon chip, hover border, highlighted chips).
const ACCENTS = [
  {
    iconChip: "bg-indigo-500/10 text-indigo-400",
    hoverBorder: "hover:border-indigo-500/30",
    chip: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  },
  {
    iconChip: "bg-emerald-500/10 text-emerald-400",
    hoverBorder: "hover:border-emerald-500/30",
    chip: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  {
    iconChip: "bg-sky-500/10 text-sky-400",
    hoverBorder: "hover:border-sky-500/30",
    chip: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  },
  {
    iconChip: "bg-amber-500/10 text-amber-400",
    hoverBorder: "hover:border-amber-500/30",
    chip: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  {
    iconChip: "bg-fuchsia-500/10 text-fuchsia-400",
    hoverBorder: "hover:border-fuchsia-500/30",
    chip: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20",
  },
];

// Asymmetric bento spans (desktop). Feature spans 2 rows; last item forced full width below.
const SPANS = [
  "md:col-span-4 md:row-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
];

export default function TechToolsSection({
  skills,
}: {
  skills: SkillCategory[];
}) {
  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-20 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="mb-12">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Engineering Toolkit</h2>
        <p className="text-slate-400 max-w-xl">A full-stack approach with a mobile-first mindset. My stack is chosen for speed, scalability, and developer experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[minmax(180px,auto)] gap-5">
        {skills.map((tech, index) => {
          const Icon = ICON_MAP[tech.icon || ""] || Globe;
          const accent = ACCENTS[index % ACCENTS.length];
          const isLast = index === skills.length - 1;
          const span = isLast ? "md:col-span-6" : (SPANS[index] ?? "md:col-span-3");
          const isFeature = index === 0;
          return (
            <div
              key={tech.id}
              className={`cursor-target group flex flex-col backdrop-blur-md border border-white/10 p-6 rounded-3xl transition-all duration-300 ${accent.hoverBorder} bg-slate-900/30 ${span}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className={`p-2 rounded-xl ${accent.iconChip}`}>
                  <Icon size={isFeature ? 20 : 16} />
                </span>
                <h3 className={`font-medium text-white ${isFeature ? "text-lg" : ""}`}>{tech.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {tech.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className={`px-3 py-1 text-xs font-medium rounded-md border ${
                      skill.highlight
                        ? accent.chip
                        : "bg-white/5 text-slate-300 border-white/10"
                    }`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
