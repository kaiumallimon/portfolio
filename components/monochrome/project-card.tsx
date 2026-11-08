"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { RiGithubLine } from "@remixicon/react";
import { IProject } from "@/lib/models";
import { DeviceMockup } from "./device-mockup";

interface ProjectCardProps {
  project: Partial<IProject>;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isMobile =
    project.category?.toLowerCase() === "mobile" ||
    project.tags?.some((t) => t.toLowerCase().includes("flutter"));

  return (
    <div className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex flex-col justify-between overflow-hidden">
      <div>
        {/* Visual Device Representation Header (iPhone for mobile, MacBook for web) */}
        <div className="h-40 sm:h-44 w-full border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-center relative overflow-hidden">
          <DeviceMockup
            type={isMobile ? "mobile" : "web"}
            title={project.title}
          />
        </div>

        {/* Project Card Content */}
        <div className="p-4 sm:p-5 space-y-2.5">
          {/* Category & Title — star count removed */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-medium text-zinc-400 dark:text-zinc-500">
              [{project.category || (isMobile ? "Mobile" : "Web")}]
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50 font-sans tracking-tight">
              {project.title}
            </h3>
          </div>

          {/* Project Summary */}
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-3">
            {project.summary}
          </p>

          {/* Tech Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions (Live Preview & Code) */}
      <div className="p-4 sm:px-5 sm:pb-4 sm:pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>Live Preview</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <RiGithubLine className="w-3.5 h-3.5" />
              <span>Code</span>
            </a>
          )}
        </div>

        {/* Indicator */}
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {isMobile ? "APP" : "SYS"}
        </span>
      </div>
    </div>
  );
}
