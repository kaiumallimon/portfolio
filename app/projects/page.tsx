"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/supabase-client";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        const data = await res.json();
        console.log("Projects API response:", data);
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.warn("Projects payload missing or invalid", data);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Removed framer-motion animations for simplicity

  return (
    <div className="min-h-screen w-full bg-white/8 backdrop-blur-sm text-white">
      <div className="max-w-7xl mx-auto pt-24 pb-16 px-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-4 tracking-tight">Projects</h1>
        <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
          A collection of projects I've worked on, showcasing my skills and passion for building innovative solutions.
        </p>

        {loading ? (
          <div className="text-center text-white/60">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-white/60">No projects found.</div>
        ) : (
          <BentoGrid className="gap-4 md:auto-rows-[14rem]">
            {projects.map((project, idx) => {
              // Simpler, more consistent spans to reduce whitespace
              const spanClass =
                idx % 5 === 0
                  ? "md:col-span-2 md:row-span-1"
                  : "md:col-span-1 md:row-span-1";

              const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
              const isValidId = typeof project.id === "string" && uuidRegex.test(project.id);

              return (
                <div
                  key={project.id}
                  className="contents"
                >
                  <BentoGridItem
                    title={
                      <span className="text-white text-xl font-bold">
                        {project.name}
                      </span>
                    }
                    description={
                      <span className="text-white/80 text-sm">
                        {project.short_details}
                        {!isValidId && (
                          <span className="ml-2 text-[11px] text-white/60">(detail unavailable)</span>
                        )}
                      </span>
                    }
                    className={
                      "group relative overflow-hidden rounded-xl border border-white/12 bg-black/10 p-5 transition-transform duration-300 transform hover:scale-[1.01] dark:bg-black/10 dark:border-white/12 " +
                      spanClass
                    }
                    header={
                      <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 pointer-events-none" />
                    }
                    icon={
                      <div className="mt-2 mb-2">
                        <div className="flex gap-4">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-white/80"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiGithub className="w-4 h-4" />
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    }
                  />
                </div>
              );
            })}
          </BentoGrid>
        )}
      </div>
    </div>
  );
}