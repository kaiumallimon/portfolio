"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { RiSearchLine, RiCloseLine, RiHomeLine, RiLoader4Line } from "@remixicon/react";
import { IProject, ISiteSettings } from "@/lib/models";
import { PaginatedProjectsResult } from "@/lib/data-service";
import { MonochromeHeader } from "./header";
import { ProjectCard } from "./project-card";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { ProjectConstellation } from "./project-constellation";

const MonochromeFooter = dynamic(
  () => import("./footer").then((m) => m.MonochromeFooter),
  {
    loading: () => (
      <div className="w-full h-56 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

/**
 * Editable description copy template for the Projects Archive hero.
 * Tokens {count} and {techs} are derived from data or fallback list.
 */
export const ARCHIVE_HERO_DESCRIPTION_TEMPLATE =
  "Curated archive of {count} projects across mobile apps, web systems, APIs and AI, built with {techs}.";

/**
 * Top technologies featured in the description copy. Tweak this array to adjust highlighted stack.
 */
export const ARCHIVE_HERO_TOP_TECHS = ["Flutter", "Next.js", "TypeScript", "Python"];

/**
 * Formats the archive hero description using the template and project dataset.
 */
export function formatArchiveDescription(
  count: number,
  template = ARCHIVE_HERO_DESCRIPTION_TEMPLATE,
  topTechs = ARCHIVE_HERO_TOP_TECHS
): string {
  const techsFormatted = topTechs.slice(0, 4).join(", ");
  return template
    .replace("{count}", String(count))
    .replace("{techs}", techsFormatted);
}

interface ProjectsArchiveViewProps {
  projects?: Partial<IProject>[];
  allProjects?: Partial<IProject>[];
  initialPaginated?: PaginatedProjectsResult;
  settings: ISiteSettings;
}

export function ProjectsArchiveView({
  projects,
  allProjects,
  initialPaginated,
  settings,
}: ProjectsArchiveViewProps) {
  // Global dataset of all projects: used for hero description, constellation, and global stats
  const globalProjects = useMemo(() => {
    return allProjects || projects || [];
  }, [allProjects, projects]);

  // Server-side paginated list of projects currently loaded on the screen (starts with 10)
  const [displayedProjects, setDisplayedProjects] = useState<Partial<IProject>[]>(() => {
    if (initialPaginated?.projects) return initialPaginated.projects;
    return globalProjects.slice(0, 10);
  });

  const [page, setPage] = useState<number>(initialPaginated?.page || 1);
  const [hasMore, setHasMore] = useState<boolean>(() => {
    if (initialPaginated) return initialPaginated.hasMore;
    return globalProjects.length > 10;
  });

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [totalMatching, setTotalMatching] = useState<number>(() => {
    if (initialPaginated) return initialPaginated.totalMatching;
    return globalProjects.length;
  });

  // Global matching slugs for search highlighting in constellation
  const [matchingSlugs, setMatchingSlugs] = useState<Set<string>>(() => {
    if (initialPaginated?.matchingSlugs) return new Set(initialPaginated.matchingSlugs);
    return new Set(globalProjects.map((p) => p.slug || (p._id ? String(p._id) : "")));
  });

  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // 1. Server-side Search with 250ms debounce
  useEffect(() => {
    // Avoid double fetch on initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const q = searchQuery.trim();
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/projects?page=1&limit=10&q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data: PaginatedProjectsResult = await res.json();
          setDisplayedProjects(data.projects);
          setPage(1);
          setHasMore(data.hasMore);
          setTotalMatching(data.totalMatching);
          setMatchingSlugs(new Set(data.matchingSlugs));
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          console.error("Failed to search projects:", err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // 2. Load More handler (fetches next page from server)
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const q = searchQuery.trim();

    try {
      const res = await fetch(
        `/api/projects?page=${nextPage}&limit=10&q=${encodeURIComponent(q)}`
      );
      if (res.ok) {
        const data: PaginatedProjectsResult = await res.json();
        setDisplayedProjects((prev) => {
          const existingIds = new Set(prev.map((p) => p.slug || String(p._id)));
          const fresh = data.projects.filter(
            (p) => !existingIds.has(p.slug || String(p._id))
          );
          return [...prev, ...fresh];
        });
        setPage(nextPage);
        setHasMore(data.hasMore);
        setTotalMatching(data.totalMatching);
      }
    } catch (err) {
      console.error("Failed to load more projects:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page, searchQuery]);

  // 3. Infinite Scroll Sentinel via IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { rootMargin: "300px" } // trigger seamlessly before reaching absolute bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // 4. Handle clicking a constellation node: if not on screen yet, load all and scroll
  const handleSelectProject = useCallback(
    async (slug: string) => {
      const existing = document.getElementById(`project-${slug}`);
      if (existing) {
        existing.scrollIntoView({ behavior: "smooth", block: "center" });
        existing.classList.add("ring-2", "ring-zinc-950", "dark:ring-zinc-100");
        setTimeout(() => {
          existing.classList.remove("ring-2", "ring-zinc-950", "dark:ring-zinc-100");
        }, 1200);
        return;
      }

      // If project is on a subsequent page, load remaining projects
      try {
        const res = await fetch(
          `/api/projects?page=1&limit=50&q=${encodeURIComponent(searchQuery.trim())}`
        );
        if (res.ok) {
          const data: PaginatedProjectsResult = await res.json();
          setDisplayedProjects(data.projects);
          setHasMore(false);
          setTimeout(() => {
            const el = document.getElementById(`project-${slug}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.classList.add("ring-2", "ring-zinc-950", "dark:ring-zinc-100");
              setTimeout(() => {
                el.classList.remove("ring-2", "ring-zinc-950", "dark:ring-zinc-100");
              }, 1200);
            }
          }, 150);
        }
      } catch (err) {
        console.error("Failed to jump to project:", err);
      }
    },
    [searchQuery]
  );

  const descriptionText = useMemo(() => {
    return formatArchiveDescription(globalProjects.length);
  }, [globalProjects.length]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* Central Editorial Container */}
      <div className="mx-auto max-w-5xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <MonochromeHeader />

          {/* Page Banner / Tightened Hero */}
          <section className="px-4 sm:px-6 py-5 sm:py-6 md:py-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              {/* Left Column: Breadcrumb, H1, Description, Metadata row */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <Breadcrumb className="mb-2 sm:mb-2.5">
                  <BreadcrumbItem href="/" icon={RiHomeLine}>
                    Overview
                  </BreadcrumbItem>
                  <BreadcrumbItem current>Projects Archive</BreadcrumbItem>
                </Breadcrumb>

                <div className="space-y-1.5">
                  <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans leading-tight">
                    Projects Archive
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-sans max-w-md sm:max-w-lg leading-relaxed">
                    {descriptionText}
                  </p>
                </div>

                {/* Metadata Row — Plain, non-interactive text based on global dataset */}
                <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-zinc-200/80 dark:border-zinc-800/80 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 select-none">
                  <span>
                    {globalProjects.length} projects · Mobile & Web
                  </span>
                </div>
              </div>

              {/* Right Column: Cardless Constellation Visual with global project nodes */}
              <div className="md:col-span-5 flex items-center justify-center md:justify-end overflow-visible">
                <ProjectConstellation
                  projects={globalProjects}
                  hoveredSlug={hoveredSlug}
                  onHoverSlug={setHoveredSlug}
                  matchingSlugs={matchingSlugs}
                  onSelectProject={handleSelectProject}
                />
              </div>
            </div>
          </section>

          {/* Search Bar */}
          <section className="px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="relative w-full max-w-lg">
              {isSearching ? (
                <RiLoader4Line className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400 animate-spin" />
              ) : (
                <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              )}
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <RiCloseLine className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </section>

          {/* Results Status Subtext */}
          <div className="px-4 sm:px-6 py-2 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/20 flex items-center justify-between text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            <span>
              Showing {displayedProjects.length} of {totalMatching} {searchQuery ? "results" : "projects"}
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:underline text-zinc-800 dark:text-zinc-200 cursor-pointer font-medium"
              >
                Reset search
              </button>
            )}
          </div>

          {/* Projects Grid */}
          <section className="p-4 sm:p-6">
            {displayedProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {displayedProjects.map((p, index) => {
                  const slug = p.slug || (p._id ? String(p._id) : `project-${index}`);
                  return (
                    <ProjectCard
                      key={slug}
                      project={p}
                      isHighlighted={hoveredSlug === slug}
                      onHover={setHoveredSlug}
                    />
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 my-6 space-y-3">
                <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
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

            {/* Infinite Scroll Loading Sentinel */}
            <div ref={sentinelRef} className="h-6 w-full" />

            {/* Loading Indicator */}
            {isLoadingMore && (
              <div className="py-6 flex items-center justify-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                <RiLoader4Line className="w-4 h-4 animate-spin text-zinc-700 dark:text-zinc-300" />
                <span>Loading more projects...</span>
              </div>
            )}

            {/* End of list banner */}
            {!hasMore && displayedProjects.length >= 10 && (
              <div className="py-6 text-center text-[11px] font-mono text-zinc-400 dark:text-zinc-600 border-t border-zinc-100 dark:border-zinc-900 mt-4">
                All {totalMatching} projects loaded
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
