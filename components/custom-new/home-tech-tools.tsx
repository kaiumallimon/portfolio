"use client";

import { Globe, Server } from "lucide-react";
import { FaMobile } from "react-icons/fa";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import type { SkillCategory } from "@/types/content";

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  FaMobile,
  Server,
  Globe,
};

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skills.map((tech) => {
          const Icon = ICON_MAP[tech.icon || ""] || Globe;
          return (
            <div key={tech.id} className="cursor-target backdrop-blur-md border p-6 rounded-2xl transition-colors hover:border-white/20 bg-slate-900/30">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 rounded-lg bg-white/5 text-indigo-400">
                  <Icon size={16} />
                </span>
                <h3 className="font-medium text-white">{tech.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className={`px-3 py-1 text-xs font-medium rounded-md border ${
                      skill.highlight
                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
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
