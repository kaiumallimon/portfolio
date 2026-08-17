"use client";

import { ArrowUpRight, Smartphone, Globe } from "lucide-react";
import type { Project } from "@/types/project";
import Link from "next/link";
import { motion } from "framer-motion";
import { springs, use3DTilt } from "@/lib/motion";
import { ScrollRevealSection, GSAPSectionHeader } from "@/components/shared/scroll-reveal";

function ProjectCardItem({ project, index }: { project: Project; index: number }) {
  const isMobile = project.client === "mobile";
  const tilt = use3DTilt({ maxTilt: 4, scale: 1.01 });

  const dotColor = isMobile ? "bg-indigo-400" : "bg-emerald-400";
  const badgeClass = isMobile
    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
    : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";

  const gradientBg = isMobile
    ? "bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80"
    : "bg-gradient-to-br from-emerald-950/30 via-slate-900/60 to-slate-950/80";

  const textOrder = index % 2 === 1 ? "md:order-2" : "md:order-1";
  const imageOrder = index % 2 === 1 ? "md:order-1" : "md:order-2";

  return (
    <div
      data-gsap-card
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="perspective-1000"
    >
      <motion.div
        style={tilt.style}
        className="cursor-target border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 shadow-2xl shadow-black/40 bg-slate-900/30"
      >
        <div className="p-6 md:p-9 grid md:grid-cols-2 gap-8 items-center">
          <div className={`order-2 ${textOrder} space-y-4`}>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                {isMobile ? "Mobile Application" : "Web Platform"}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
              {project.name}
            </h3>

            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              {project.short_details}
            </p>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white/5 border border-white/8 text-slate-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Link
                href={`/projects/${project.id}`}
                className="cursor-target inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-indigo-400 transition-colors"
              >
                <span>Explore Project Details</span>
                <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div
            className={`order-1 ${imageOrder} relative h-60 md:h-72 w-full rounded-2xl overflow-hidden ${gradientBg} border border-white/8 flex items-center justify-center p-6`}
          >
            {isMobile ? (
              <div className="relative flex items-center justify-center w-full h-full">
                <div className="w-36 h-64 bg-slate-900 border border-white/12 rounded-3xl shadow-2xl transform -rotate-6 translate-y-4 -translate-x-4 group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 flex flex-col p-2.5">
                  <div className="w-full h-full bg-slate-800/80 rounded-2xl overflow-hidden flex flex-col p-3 gap-2">
                    <div className="w-full h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <Smartphone size={20} className="text-indigo-400" />
                    </div>
                    <div className="w-3/4 h-3 bg-white/10 rounded-md" />
                    <div className="w-1/2 h-3 bg-white/5 rounded-md" />
                  </div>
                </div>

                <div className="w-36 h-64 bg-slate-900 border border-white/15 rounded-3xl shadow-2xl transform rotate-6 translate-y-2 translate-x-4 z-10 group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-105 transition-transform duration-500 flex flex-col p-2.5">
                  <div className="w-full h-full bg-slate-800 rounded-2xl overflow-hidden flex flex-col p-3 gap-2">
                    <div className="w-full h-20 bg-indigo-600/30 rounded-xl" />
                    <div className="w-full h-4 bg-white/10 rounded-md" />
                    <div className="w-2/3 h-4 bg-white/10 rounded-md" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-slate-900 border border-white/12 rounded-xl shadow-2xl flex flex-col overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                <div className="h-7 bg-slate-800/90 border-b border-white/8 flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  <Globe size={12} className="ml-auto text-slate-500" />
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 flex-1">
                  <div className="col-span-1 bg-white/5 rounded-xl animate-pulse" />
                  <div className="col-span-2 space-y-2.5">
                    <div className="h-6 bg-white/8 rounded-lg w-4/5" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-5/6" />
                    <div className="h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-2 flex items-center px-3 text-xs text-emerald-400 font-mono">
                      // production-ready
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function HomeProjects({ projects }: { projects: Project[] }) {
  const preview = projects.slice(0, 3);

  return (
    <ScrollRevealSection
      id="projects"
      className="py-24 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <GSAPSectionHeader
          eyebrow="Featured Work"
          title="Selected Software Projects"
          subtitle="Highlighting architecture, performance, and user-centric software design."
          rightAction={
            <a
              href="https://github.com/kaiumallimon"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              <span>View complete portfolio on GitHub</span>
              <ArrowUpRight size={16} />
            </a>
          }
        />

        <div className="space-y-7">
          {preview.map((project, index) => (
            <ProjectCardItem key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={springs.snappy}>
            <Link
              href="/projects"
              className="cursor-target group flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-white/12 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all shadow-lg text-white font-medium text-sm"
            >
              <span>View All Projects</span>
              <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </ScrollRevealSection>
  );
}
