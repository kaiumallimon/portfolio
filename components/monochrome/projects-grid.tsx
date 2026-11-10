"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RiLink } from "@remixicon/react";
import { IProject } from "@/lib/models";
import { toast } from "sonner";
import { ProjectCard } from "./project-card";

interface MonochromeProjectsProps {
  projects: Partial<IProject>[];
}

export function MonochromeProjects({ projects }: MonochromeProjectsProps) {
  // Show only top 4 featured projects on home page
  const displayProjects = projects.slice(0, 4);

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#projects`);
      toast.success("Section link copied");
    }
  };

  return (
    <section
      id="projects"
      className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Header Bar — no filter tabs */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Projects
          </h2>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Projects"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <Link
          href="/projects"
          prefetch={false}
          className="text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors group"
        >
          <span>All works</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid of Top 4 Projects with Device Frames */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayProjects.map((p, index) => (
          <div
            key={p.slug || (p._id ? String(p._id) : index)}
            className="h-full flex flex-col"
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </div>

      {/* "See More" CTA Banner linking to /projects */}
      <div className="px-4 sm:px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100">
            Looking for more work?
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
            Explore production mobile apps, high-throughput web systems, and open-source utilities.
          </p>
        </div>

        <Link
          href="/projects"
          prefetch={false}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 hover:border-zinc-900 dark:hover:border-zinc-100 hover:shadow-xs transition-all cursor-pointer group shrink-0"
        >
          <span>See all projects</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
