"use client";

import { useState } from "react";
import { ArrowUpRight, Star, GitFork } from "lucide-react";
import { RiGithubLine } from "@remixicon/react";
import { IProject } from "@/lib/models";

export function MonochromeProjects({ projects }: { projects: Partial<IProject>[] }) {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Tools", "Mobile", "Full-Stack"];

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
              Selected Works
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              Production applications, tools & open-source libraries
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2 py-0.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                  filter === cat
                    ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-medium"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-column bento grid on wider canvas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredProjects.map((p, index) => (
            <div
              key={p.slug || index}
              className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-zinc-400">
                      [{p.category || "Full-Stack"}]
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-sans">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {p.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags?.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right links & stars */}
                <div className="flex flex-col items-end gap-2 shrink-0 pt-0.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    {typeof p.stars === "number" && p.stars > 0 && (
                      <span className="flex items-center gap-0.5 text-[11px]">
                        <Star className="w-3 h-3 text-zinc-400" />
                        <span>{p.stars}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target={p.demoUrl.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center gap-0.5"
                      >
                        <span>Demo</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        title="GitHub Code"
                      >
                        <RiGithubLine className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
