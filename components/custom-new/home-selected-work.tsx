'use client';

import { ArrowUpRight, Code, Link as LinkIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/types/project";
import Link from 'next/link';

export default function HomeProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects?limit=3');
        const data = await res.json();
        if (data.projects) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (<div>
    <section id="projects" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Selected Work</h2>
            <p className="text-slate-400">Highlighting architecture, performance, and user-centric design.</p>
          </div>
          <a href="https://github.com/kaiumallimon" target="_blank" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View complete portfolio on GitHub
            <ArrowUpRight size={16} className="text-indigo-400" />
          </a>
        </div>

        <div className="space-y-8">
          {loading ? (
            // Skeleton Loading State
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="rounded-3xl p-1 overflow-hidden">
                <div className="bg-slate-900/50 rounded-[20px] p-6 md:p-10 grid md:grid-cols-2 gap-10 items-center">
                  <div className="order-2 md:order-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-2 h-2 rounded-full bg-slate-700" />
                      <Skeleton className="h-4 w-24 bg-slate-700" />
                    </div>
                    <Skeleton className="h-8 w-3/4 bg-slate-700" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full bg-slate-700" />
                      <Skeleton className="h-4 w-5/6 bg-slate-700" />
                      <Skeleton className="h-4 w-4/6 bg-slate-700" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full bg-slate-700" />
                      <Skeleton className="h-6 w-16 rounded-full bg-slate-700" />
                      <Skeleton className="h-6 w-16 rounded-full bg-slate-700" />
                    </div>
                    <div className="pt-4 flex gap-4">
                      <Skeleton className="h-5 w-24 bg-slate-700" />
                      <Skeleton className="h-5 w-24 bg-slate-700" />
                    </div>
                  </div>
                  <div className="order-1 md:order-2 h-64 md:h-80 w-full rounded-2xl bg-slate-800/50 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            projects.map((project, index) => {
              const isMobile = project.client === 'mobile';
              // Dynamic classes based on project type
              const groupHoverBorder = isMobile ? 'hover:border-indigo-500/30' : 'hover:border-emerald-500/30';
              const dotColor = isMobile ? 'bg-indigo-500' : 'bg-emerald-500';
              const labelColor = isMobile ? 'text-indigo-400' : 'text-emerald-400';
              const linkHoverColor = isMobile ? 'hover:text-indigo-400' : 'hover:text-emerald-400';
              const gradientBg = isMobile
                ? 'bg-linear-to-br from-indigo-900/20 to-slate-900'
                : 'bg-linear-to-br from-emerald-900/20 to-slate-900';

              // Alternating layout logic:
              // Even index (0, 2...): Text Left (order-1), Image Right (order-2)
              // Odd index (1, 3...): Text Right (order-2), Image Left (order-1)
              const textOrder = index % 2 === 1 ? 'md:order-2' : 'md:order-1';
              const imageOrder = index % 2 === 1 ? 'md:order-1' : 'md:order-2';

              return (
                <div key={project.id} className={`border backdrop-blur-md rounded-3xl overflow-hidden group ${groupHoverBorder} transition-all duration-500`}>
                  <div className="bg-slate-900/50 rounded-[20px] p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                    <div className={`order-2 ${textOrder} space-y-4`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                        <span className={`${labelColor} text-xs font-semibold tracking-wider uppercase`}>
                          {isMobile ? 'Mobile' : 'Web'}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{project.name}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                        {project.short_details}
                      </p>

                      <div className="pt-2 flex gap-4">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" className={`text-white text-sm font-medium flex items-center gap-2 ${linkHoverColor} transition-colors`}>
                            <LinkIcon size={16} /> Live Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" className={`text-white text-sm font-medium flex items-center gap-2 ${linkHoverColor} transition-colors`}>
                            <FaGithub size={16} /> Source Code
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Visual Representation Container */}
                    <div className={`order-1 ${imageOrder} relative h-56 md:h-72 w-full rounded-2xl overflow-hidden ${gradientBg} border border-white/5 flex items-center justify-center p-8`}>

                      {isMobile ? (
                        // Mobile UI Representation
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
                        // Web UI Representation
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
            })
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/projects" className="group flex items-center gap-2 px-8 py-3 rounded-full border hover:bg-white/10 backdrop:blur-in-md transition-all duration-300">
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">View All Projects</span>
            <ArrowUpRight size={16} className="text-slate-400 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  </div>);
}