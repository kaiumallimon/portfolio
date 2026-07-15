"use client";

import { ArrowUpRight, Link as LinkIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { Project } from "@/types/project";
import { toExternalUrl } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeProjects({ projects }: { projects: Project[] }) {
  const preview = projects.slice(0, 3);

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Selected Work</h2>
            <p className="text-slate-400">Highlighting architecture, performance, and user-centric design.</p>
          </div>
          <a href="https://github.com/kaiumallimon" target="_blank" className="cursor-target text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View complete portfolio on GitHub
            <ArrowUpRight size={16} className="text-indigo-400" />
          </a>
        </div>

        <div className="space-y-8">
          {preview.map((project, index) => {
            const isMobile = project.client === "mobile";
            const groupHoverBorder = isMobile ? "hover:border-indigo-500/30" : "hover:border-emerald-500/30";
            const dotColor = isMobile ? "bg-indigo-500" : "bg-emerald-500";
            const labelColor = isMobile ? "text-indigo-400" : "text-emerald-400";
            const linkHoverColor = isMobile ? "hover:text-indigo-400" : "hover:text-emerald-400";
            const gradientBg = isMobile
              ? "bg-linear-to-br from-indigo-900/20 to-slate-900"
              : "bg-linear-to-br from-emerald-900/20 to-slate-900";

            const textOrder = index % 2 === 1 ? "md:order-2" : "md:order-1";
            const imageOrder = index % 2 === 1 ? "md:order-1" : "md:order-2";

            return (
              <div key={project.id} className={`cursor-target border backdrop-blur-md rounded-3xl overflow-hidden group ${groupHoverBorder} transition-all duration-500`}>
                <div className="bg-slate-900/50 rounded-[20px] p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                  <div className={`order-2 ${textOrder} space-y-4`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                      <span className={`${labelColor} text-xs font-semibold tracking-wider uppercase`}>
                        {isMobile ? "Mobile" : "Web"}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{project.name}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">{project.short_details}</p>

                    <div className="pt-2 flex gap-4">
                      {project.live_url && (
                        <a href={toExternalUrl(project.live_url)} target="_blank" className={`text-white text-sm font-medium flex items-center gap-2 ${linkHoverColor} transition-colors`}>
                          <LinkIcon size={16} /> Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a href={toExternalUrl(project.github_url)} target="_blank" className={`text-white text-sm font-medium flex items-center gap-2 ${linkHoverColor} transition-colors`}>
                          <FaGithub size={16} /> Source Code
                        </a>
                      )}
                    </div>
                  </div>

                  <div className={`order-1 ${imageOrder} relative h-56 md:h-72 w-full rounded-2xl overflow-hidden ${gradientBg} border border-white/5 flex items-center justify-center p-8`}>
                    {isMobile ? (
                      <>
                        <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
                        <div className="w-40 h-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl transform -rotate-6 translate-y-8 -translate-x-5 group-hover:rotate-0 group-hover:translate-x-0 transition-all duration-500 flex flex-col p-2">
                          <div className="w-full h-full bg-slate-800 rounded-xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-indigo-600/20"></div>
                          </div>
                        </div>
                        <div className="w-40 h-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl transform rotate-6 translate-y-4 translate-x-5 z-10 group-hover:rotate-0 group-hover:translate-x-0 group-hover:scale-105 transition-all duration-500 flex flex-col p-2">
                          <div className="w-full h-full bg-slate-800 rounded-xl overflow-hidden flex flex-col gap-2 p-2">
                            <div className="w-full h-20 bg-indigo-500/20 rounded-lg"></div>
                            <div className="w-full h-8 bg-white/5 rounded-lg"></div>
                            <div className="w-2/3 h-8 bg-white/5 rounded-lg"></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-slate-900 border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                        <div className="h-6 bg-slate-800 border-b border-white/5 flex items-center px-3 gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                        </div>
                        <div className="p-4 grid grid-cols-3 gap-4">
                          <div className="col-span-1 bg-white/5 h-32 rounded-lg animate-pulse"></div>
                          <div className="col-span-2 space-y-3">
                            <div className="h-8 bg-white/5 rounded w-3/4"></div>
                            <div className="h-4 bg-white/5 rounded w-full"></div>
                            <div className="h-4 bg-white/5 rounded w-5/6"></div>
                            <div className="h-20 bg-emerald-500/10 rounded w-full border border-emerald-500/20 mt-2"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/projects" className="cursor-target group flex items-center gap-2 px-8 py-3 rounded-full border hover:bg-white/10 backdrop:blur-in-md transition-all duration-300">
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">View All Projects</span>
            <ArrowUpRight size={16} className="text-slate-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
