"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { RiSearchLine, RiCloseLine } from "@remixicon/react";
import { IProject, ISiteSettings } from "@/lib/models";
import { MonochromeHeader } from "./header";
import { ProjectCard } from "./project-card";

const MonochromeFooter = dynamic(
  () => import("./footer").then((m) => m.MonochromeFooter),
  {
    loading: () => (
      <div className="w-full h-56 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

interface ProjectsArchiveViewProps {
  projects: Partial<IProject>[];
  settings: ISiteSettings;
}

export function ProjectsArchiveView({
  projects,
  settings,
}: ProjectsArchiveViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return projects.filter((p) => {
      const cat = p.category || "Full-Stack Web App";
      const tags = (p.tags && p.tags.length > 0) ? p.tags : (p.technologies || []);

      // Search query check
      if (!q) return true;

      const titleMatch = (p.title || p.name)?.toLowerCase().includes(q);
      const summaryMatch = (p.summary || p.short_details)?.toLowerCase().includes(q);
      const descMatch = (p.description || p.short_details)?.toLowerCase().includes(q);
      const categoryMatch = cat.toLowerCase().includes(q);
      const tagMatch = tags.some((t) => t.toLowerCase().includes(q));

      return (
        titleMatch ||
        summaryMatch ||
        descMatch ||
        categoryMatch ||
        tagMatch
      );
    });
  }, [projects, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* Central Editorial Container */}
      <div className="mx-auto max-w-5xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <MonochromeHeader />

          {/* Page Banner */}
          <section className="px-4 sm:px-6 py-8 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="space-y-4">
              <Link
                href="/"
                prefetch={false}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Overview</span>
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
                      Projects Archive
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed">
                    Curated archive of production mobile applications, high-throughput web systems, distributed APIs, and open-source packages.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Search Bar */}
          <section className="px-4 sm:px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="relative w-full max-w-lg">
              <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, stack, keyword (Flutter, Next.js, etc.)..."
                className="w-full pl-8.5 pr-8 py-1.5 text-xs font-mono rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <RiCloseLine className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </section>

          {/* Results Status Subtext */}
          <div className="px-4 sm:px-6 py-2 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/20 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span>
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:underline text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Reset search
              </button>
            )}
          </div>

          {/* Projects Grid */}
          <section className="p-4 sm:p-6">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filteredProjects.map((p, index) => (
                  <ProjectCard
                    key={p.slug || (p._id ? String(p._id) : index)}
                    project={p}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 my-6 space-y-3">
                <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
                  No projects match your search query &quot;{searchQuery}&quot;
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-3 py-1.5 text-xs font-mono border border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 rounded-xs transition-colors cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>

          <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
        </div>

        {/* Footer */}
        <MonochromeFooter settings={settings} />
      </div>
    </div>
  );
}
