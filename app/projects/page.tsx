'use client';

import { Code, Link as LinkIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/types/project";
import { toExternalUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import Footer from "@/components/custom-new/footer";
import TargetCursor from "@/components/TargetCursor";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
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

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      {/* Background gradient and top border */}
      <HomeBackground />
      <FloatingHeader />

      <div className="relative">
        <div className="max-w-5xl mx-auto py-42 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-slate-400 hover:text-white">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-4xl font-extrabold text-center mb-4 tracking-tight text-white"
          >
            All Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-white/70 mb-10 max-w-2xl mx-auto"
          >
            A comprehensive collection of my work, showcasing mobile and web applications built with modern technologies.
          </motion.p>

          {/* Projects Grid */}
          <div className="space-y-8">
            {loading ? (
              // Skeleton Loading State
              Array(4).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="border backdrop-blur-md rounded-3xl overflow-hidden border-white/10"
                >
                  <div className="bg-slate-900/50 rounded-[20px] p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center">
                    <div className="order-2 md:order-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-2 h-2 rounded-full bg-slate-700/50" />
                        <Skeleton className="h-3 w-20 bg-slate-700/50 rounded" />
                      </div>
                      <Skeleton className="h-7 w-3/4 bg-slate-700/50 rounded-lg" />
                      <div className="space-y-2.5">
                        <Skeleton className="h-4 w-full bg-slate-700/50 rounded" />
                        <Skeleton className="h-4 w-11/12 bg-slate-700/50 rounded" />
                        <Skeleton className="h-4 w-4/5 bg-slate-700/50 rounded" />
                      </div>
                      <div className="pt-2 flex gap-4">
                        <Skeleton className="h-5 w-28 bg-slate-700/50 rounded" />
                        <Skeleton className="h-5 w-32 bg-slate-700/50 rounded" />
                      </div>
                    </div>
                    <div className="order-1 md:order-2 h-56 md:h-72 w-full rounded-2xl bg-slate-800/30 border border-white/5 animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-700/10 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : projects.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-6">
                  <Code className="text-slate-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
                <p className="text-slate-400">Check back soon for new projects!</p>
              </motion.div>
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
                const textOrder = index % 2 === 1 ? 'md:order-2' : 'md:order-1';
                const imageOrder = index % 2 === 1 ? 'md:order-1' : 'md:order-2';

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className={`cursor-target border backdrop-blur-md rounded-3xl overflow-hidden group ${groupHoverBorder} transition-all duration-500`}
                  >
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
                            <a
                              href={toExternalUrl(project.live_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`cursor-target text-white text-sm font-medium flex items-center gap-2 ${linkHoverColor} transition-colors`}
                            >
                              <LinkIcon size={16} /> Live Demo
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={toExternalUrl(project.github_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`cursor-target text-white text-sm font-medium flex items-center gap-2 ${linkHoverColor} transition-colors`}
                            >
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
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
