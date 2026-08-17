"use client";

import { Calendar, ArrowUpRight } from "lucide-react";
import { FaCalculator } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home_bg";
import TargetCursor from "@/components/TargetCursor";
import Footer from "@/components/custom-new/footer";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { springs, use3DTilt } from "@/lib/motion";

interface ToolItem {
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  status: { isAvailable: boolean; label: string };
  gradient: string;
}

function ToolCardItem({ tool, index }: { tool: ToolItem; index: number }) {
  const tilt = use3DTilt({ maxTilt: 4, scale: 1.01 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.gentle, delay: 0.15 + index * 0.1 }}
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="perspective-1000 w-full"
    >
      <motion.div
        style={tilt.style}
        className="cursor-target relative overflow-hidden rounded-3xl p-6 md:p-8 bg-slate-900/40 border border-white/10 backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-300 shadow-2xl shadow-black/40 group"
      >
        <a
          href={tool.link}
          className={`block h-full ${!tool.status.isAvailable ? "pointer-events-none" : ""}`}
        >
          <div className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
            {/* Visual Tile */}
            <div className={`relative w-full md:w-5/12 h-48 md:h-56 rounded-2xl overflow-hidden ${tool.gradient} flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-102 transition-transform duration-500`}>
              <div className="text-white drop-shadow-xl">{tool.icon}</div>
            </div>

            {/* Description Body */}
            <div className={`flex flex-col justify-center gap-3 flex-1 text-left ${index % 2 === 1 ? "md:items-start" : "md:items-start"}`}>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    tool.status.isAvailable
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {tool.status.label}
                </span>
              </div>

              <h2 className="font-bold text-2xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                {tool.name}
              </h2>

              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                {tool.description}
              </p>

              <div className="pt-2 flex items-center gap-1.5 text-indigo-400 font-semibold text-sm group-hover:text-indigo-300 transition-colors">
                <span>Launch Interactive Tool</span>
                <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </a>
      </motion.div>
    </motion.div>
  );
}

export default function ToolsView() {
  const tools: ToolItem[] = [
    {
      name: "Github Unwrapped",
      description: "An interactive web app visualizing personal GitHub statistics, contribution velocity, language breakdown, and commit graphs in an engaging snapshot.",
      link: "/tools/github-unwrapped",
      icon: <SiGithub className="w-16 h-16" />,
      status: { isAvailable: true, label: "Live System" },
      gradient: "bg-gradient-to-tr from-indigo-950 via-indigo-900/60 to-violet-800/40",
    },
    {
      name: "UIU Exam Routine Finder",
      description: "A fast, streamlined utility designed for United International University students to quickly search, filter, and export their course exam routines without portal hassle.",
      link: "/tools/uiu-exam-routine",
      icon: <Calendar className="w-16 h-16" />,
      status: { isAvailable: true, label: "Live System" },
      gradient: "bg-gradient-to-tr from-emerald-950 via-emerald-900/60 to-teal-800/40",
    },
    {
      name: "UIU CGPA Calculator",
      description: "A precise semester and cumulative Grade Point Average calculation engine tailored to UIU credit and grading standards with custom scenario simulators.",
      link: "/tools/uiu-cgpa-calculator",
      icon: <FaCalculator className="w-16 h-16" />,
      status: { isAvailable: true, label: "Live System" },
      gradient: "bg-gradient-to-tr from-cyan-950 via-cyan-900/60 to-blue-800/40",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <TargetCursor spinDuration={2.5} hideDefaultCursor parallaxOn hoverDuration={0.2} />
      <HomeBackground />
      <FloatingHeader />

      <div className="relative">
        <div className="max-w-5xl mx-auto pt-36 md:pt-44 pb-28 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.gentle}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-slate-400 hover:text-white transition-colors">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">Tools</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
              Utilities & Experiments
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Tools & Web Utilities
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-14">
              A curated suite of interactive web tools and productivity applications developed to make digital workflows and university tasks fast and effortless.
            </p>
          </motion.div>

          {/* Tools List */}
          <div className="flex flex-col gap-7 w-full">
            {tools.map((tool, index) => (
              <ToolCardItem key={tool.name} tool={tool} index={index} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
