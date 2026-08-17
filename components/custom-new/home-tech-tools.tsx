"use client";

import { Globe, Server, Brain } from "lucide-react";
import { FaMobile } from "react-icons/fa";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import type { SkillCategory } from "@/types/content";
import { springs, use3DTilt } from "@/lib/motion";
import { ScrollRevealSection } from "@/components/shared/scroll-reveal";

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  FaMobile,
  Server,
  Globe,
  Brain,
};

const ACCENTS = [
  {
    iconChip: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    hoverBorder: "hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    chip: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    glow: "bg-indigo-500/15",
  },
  {
    iconChip: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    glow: "bg-emerald-500/15",
  },
  {
    iconChip: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    hoverBorder: "hover:border-sky-500/40 hover:shadow-sky-500/10",
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    glow: "bg-sky-500/15",
  },
  {
    iconChip: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    hoverBorder: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    glow: "bg-amber-500/15",
  },
  {
    iconChip: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20",
    hoverBorder: "hover:border-fuchsia-500/40 hover:shadow-fuchsia-500/10",
    chip: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    glow: "bg-fuchsia-500/15",
  },
];

const SPANS = [
  "md:col-span-4 md:row-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
];

function BentoSkillCard({
  tech,
  index,
  isLast,
  isFeature,
}: {
  tech: SkillCategory;
  index: number;
  isLast: boolean;
  isFeature: boolean;
}) {
  const Icon = ICON_MAP[tech.icon || ""] || Globe;
  const accent = ACCENTS[index % ACCENTS.length];
  const span = isLast ? "md:col-span-6" : (SPANS[index] ?? "md:col-span-3");
  const tilt = use3DTilt({ maxTilt: isFeature ? 5 : 8, scale: 1.01 });

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className={`perspective-1000 ${span}`}
    >
      <motion.div
        style={tilt.style}
        className={`cursor-target group relative flex flex-col h-full backdrop-blur-xl border border-white/10 p-6 md:p-7 rounded-3xl transition-all duration-300 shadow-xl ${accent.hoverBorder} bg-slate-900/40 overflow-hidden`}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${accent.glow}`} />

        <div className="flex items-center gap-3.5 mb-6 relative z-10">
          <span className={`p-2.5 rounded-2xl ${accent.iconChip}`}>
            <Icon size={isFeature ? 22 : 18} />
          </span>
          <div>
            <h3 className={`font-semibold text-white tracking-tight ${isFeature ? "text-xl" : "text-base"}`}>
              {tech.category}
            </h3>
            <span className="text-[11px] text-slate-500">
              {tech.skills.length} core technologies
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto relative z-10">
          {tech.skills.map((skill, skillIndex) => (
            <motion.span
              key={skillIndex}
              whileHover={{ scale: 1.08, y: -2 }}
              transition={springs.snappy}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                skill.highlight
                  ? accent.chip
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {skill.name}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function TechToolsSection({ skills }: { skills: SkillCategory[] }) {
  return (
    <ScrollRevealSection
      id="skills"
      className="py-24 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="mb-12">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
          Skills & Stack
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
          Engineering Toolkit
        </h2>
        <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
          A full-stack approach with a mobile-first mindset. My stack is chosen for speed, scalability, and robust architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[minmax(190px,auto)] gap-5">
        {skills.map((tech, index) => {
          const isLast = index === skills.length - 1;
          const isFeature = index === 0;
          return (
            <BentoSkillCard
              key={tech.id}
              tech={tech}
              index={index}
              isLast={isLast}
              isFeature={isFeature}
            />
          );
        })}
      </div>
    </ScrollRevealSection>
  );
}
