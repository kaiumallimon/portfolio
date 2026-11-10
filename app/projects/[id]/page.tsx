import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import dynamicImport from "next/dynamic";
import {
  ArrowLeft,
  ArrowUpRight,
  Star,
  GitFork,
  CircleDot,
  FileText,
  Code2,
  ExternalLink,
} from "lucide-react";
import { RiGithubLine } from "@remixicon/react";
import { MonochromeHeader } from "@/components/monochrome/header";
import { DeviceMockup } from "@/components/monochrome/device-mockup";
import { MonochromeReadmeRenderer } from "@/components/monochrome/monochrome-readme-renderer";
import { getProjectBySlugOrId, getSiteSettings } from "@/lib/data-service";
import { getRepoReadme, getRepoMeta } from "@/lib/github";
import { SITE_URL } from "@/lib/site";

const MonochromeFooter = dynamicImport(
  () =>
    import("@/components/monochrome/footer").then((m) => m.MonochromeFooter),
  {
    loading: () => (
      <div className="w-full h-56 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
    ),
  }
);

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectBySlugOrId(id);
  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project case study could not be found.",
    };
  }

  const title = `${project.title || project.name} — Project Case Study`;
  const description =
    project.summary ||
    project.short_details ||
    project.description ||
    `Explore ${project.title || project.name}, built by Kaium Al Limon.`;

  const canonicalSlug = project.slug || id;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/projects/${canonicalSlug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/projects/${canonicalSlug}`,
      siteName: "Kaium Al Limon Portfolio",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const [project, settings] = await Promise.all([
    getProjectBySlugOrId(id),
    getSiteSettings(),
  ]);

  if (!project) notFound();

  const title = project.title || project.name || "Project";
  const summary = project.summary || project.short_details || "";
  const description = project.description || "";
  const demoUrl = project.demoUrl || project.live_url;
  const githubUrl = project.githubUrl || project.github_url;
  const tags =
    project.tags && project.tags.length > 0
      ? project.tags
      : project.technologies || [];

  const isMobile =
    project.category?.toLowerCase().includes("mobile") ||
    project.client?.toLowerCase() === "mobile";

  const categoryLabel =
    project.category || (isMobile ? "Mobile App" : "Full-Stack Web App");

  // Fetch GitHub README and metadata using the fine-grained token from .env.local
  const [readme, meta] = await Promise.all([
    githubUrl ? getRepoReadme(githubUrl) : Promise.resolve(null),
    githubUrl ? getRepoMeta(githubUrl) : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* Central Editorial Container */}
      <div className="mx-auto max-w-5xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <MonochromeHeader />

          {/* Top Breadcrumb Navigation Bar */}
          <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-500">
              <Link
                href="/"
                className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/projects"
                className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
              >
                Projects
              </Link>
              <span>/</span>
              <span className="text-zinc-950 dark:text-zinc-100 font-medium truncate max-w-[200px] sm:max-w-xs">
                {title}
              </span>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">All Projects</span>
            </Link>
          </div>

          {/* Project Hero Header */}
          <section className="p-4 sm:p-6 md:p-8 space-y-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            {/* Category badge */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-xs text-[11px] font-mono font-medium border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                [{categoryLabel}]
              </span>
              {meta?.defaultBranch && (
                <span className="text-[11px] font-mono text-zinc-400">
                  branch: {meta.defaultBranch}
                </span>
              )}
            </div>

            {/* Title & Summary */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
                {title}
              </h1>
              {summary && (
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-3xl">
                  {summary}
                </p>
              )}
            </div>

            {/* Action Buttons & Links */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {demoUrl && (
                <a
                  href={demoUrl.startsWith("http") ? demoUrl : `https://${demoUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-xs bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:opacity-90 active:scale-95 transition-all shadow-xs"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-950 dark:hover:text-white transition-all shadow-xs"
                >
                  <RiGithubLine className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>

            {/* Live GitHub Telemetry Strip */}
            {meta && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
                <span className="flex items-center gap-1.5" title="GitHub Stars">
                  <Star className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {meta.stars}
                  </span>
                  <span>stars</span>
                </span>

                <span className="flex items-center gap-1.5" title="GitHub Forks">
                  <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {meta.forks}
                  </span>
                  <span>forks</span>
                </span>

                <span className="flex items-center gap-1.5" title="Open Issues">
                  <CircleDot className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {meta.openIssues}
                  </span>
                  <span>open issues</span>
                </span>

                {meta.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {meta.language}
                    </span>
                  </span>
                )}

                {meta.license && (
                  <span className="text-zinc-400">
                    License: {meta.license}
                  </span>
                )}
              </div>
            )}

            {/* Tech Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Visual Device Representation Frame */}
          <div className="h-48 sm:h-64 md:h-80 w-full border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-center relative overflow-hidden">
            <DeviceMockup
              type={isMobile ? "mobile" : "web"}
              category={categoryLabel}
              title={title}
              slug={project.slug}
            />
          </div>

          {/* Stripe Divider */}
          <div className="stripe-divider h-8 border-b border-zinc-200 dark:border-zinc-800 w-full" />

          {/* GitHub README Section */}
          <section className="p-4 sm:p-6 md:p-8 space-y-6">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden rounded-xs">
              {/* README File Header */}
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <span>README.md</span>
                  <span className="text-zinc-400">·</span>
                  <span className="text-[11px] text-zinc-500">
                    {meta?.defaultBranch || "main"}
                  </span>
                </div>

                {githubUrl && (
                  <a
                    href={`${githubUrl}/blob/${meta?.defaultBranch || "main"}/README.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    <span className="hidden sm:inline">View Raw on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* README Markdown Body */}
              <div className="p-4 sm:p-6 md:p-8">
                {readme ? (
                  <MonochromeReadmeRenderer content={readme} />
                ) : (
                  <div className="py-8 text-center space-y-4">
                    <Code2 className="w-8 h-8 text-zinc-400 mx-auto" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                        {githubUrl
                          ? "README currently unavailable via GitHub API"
                          : "No public GitHub repository linked"}
                      </h3>
                      <p className="text-xs text-zinc-500 max-w-md mx-auto font-sans">
                        {description || summary || "This project is currently private or in active staging."}
                      </p>
                    </div>

                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <RiGithubLine className="w-3.5 h-3.5" />
                        <span>Visit Repository Directly</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Stripe Divider */}
          <div className="stripe-divider h-8 border-y border-zinc-200 dark:border-zinc-800 w-full" />

          {/* Bottom Action Footer */}
          <div className="px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all projects</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-xs bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:opacity-90 active:scale-95 transition-all shadow-xs"
              >
                <span>Discuss this project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <MonochromeFooter settings={settings} />
      </div>
    </div>
  );
}
