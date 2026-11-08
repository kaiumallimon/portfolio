"use client";

import { useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { RiGithubLine, RiLink } from "@remixicon/react";
import { IProject } from "@/lib/models";
import { toast } from "sonner";

export function MonochromeProjects({ projects }: { projects: Partial<IProject>[] }) {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Mobile", "Web", "Tools"];

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) => {
          if (filter === "Tools") return p.category === "Tools" || p.category === "Full-Stack";
          return p.category === filter;
        });

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}#projects`);
    toast.success("Section link copied");
  };

  return (
    <section id="projects" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Header Bar */}
      <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800">
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

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-0.5 text-xs font-mono transition-colors cursor-pointer ${
                filter === cat
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-medium"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProjects.map((p, index) => (
          <div
            key={p.slug || index}
            className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium text-zinc-400">
                    [{p.category || "Web"}]
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                    {p.title}
                  </h3>
                </div>

                {typeof p.stars === "number" && p.stars > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 shrink-0">
                    <Star className="w-3 h-3 text-zinc-400" />
                    <span>{p.stars}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                {p.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.tags?.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-3 text-xs font-mono">
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1"
                >
                  <span>Live Preview</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1"
                >
                  <RiGithubLine className="w-3.5 h-3.5" />
                  <span>Code</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
