import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Link as LinkIcon,
  Check,
  Star,
  GitFork,
  Eye,
  CircleDot,
  Users,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import FlutterFooter from "@/components/custom-new/footer";
import TargetCursor from "@/components/TargetCursor";
import { getProjectById } from "@/lib/data";
import {
  getRepoReadme,
  getRepoMeta,
  getRepoLanguages,
  getRepoContributors,
} from "@/lib/github";
import { toExternalUrl } from "@/lib/utils";
import { ReadmeRenderer } from "@/components/custom-new/readme-renderer";
import { Reveal } from "@/components/custom-new/reveal";
import { DonutChart } from "@/components/admin/charts/donut";
import { ProjectGallery } from "@/components/custom-new/project-gallery";

import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project case study could not be found.",
    };
  }

  const title = `${project.name} — ${project.client === "mobile" ? "Mobile App" : "Web Platform"} Case Study`;
  const description =
    project.short_details ||
    project.overview ||
    `Explore ${project.name}, a ${project.client === "mobile" ? "mobile" : "web"} application built by Kaium Al Limon using ${project.technologies?.join(", ") || "modern technologies"}.`;

  const projectImage = project.image || project.images?.[0] || "/bordered.png";
  const imageUrl = projectImage.startsWith("http") ? projectImage : `${SITE_URL}${projectImage}`;

  return {
    title,
    description,
    keywords: [
      project.name ?? "Project",
      ...(project.technologies ?? []),
      project.client === "mobile" ? "Flutter App" : "Next.js Web App",
      "Case Study",
      "Kaium Al Limon",
      "Software Engineering",
    ],
    alternates: {
      canonical: `${SITE_URL}/projects/${project.id}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/projects/${project.id}`,
      siteName: "Kaium Al Limon Portfolio",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.name ?? "Project Preview",
        },
      ],
    },
  };
}

function splitLines(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Shell: "#89e051",
  ObjectiveC: "#438eff",
  CMake: "#DA3434",
};

const LANG_PALETTE = [
  "#6366f1",
  "#10b981",
  "#0ea5e9",
  "#f59e0b",
  "#d946ef",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
];

function langColor(name: string, i: number): string {
  if (LANG_COLORS[name]) return LANG_COLORS[name];
  return LANG_PALETTE[i % LANG_PALETTE.length];
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const projectImages =
    project.images && project.images.length > 0
      ? project.images
      : project.image
        ? [project.image]
        : [];

  const isMobile = project.client === "mobile";
  const glowColor = isMobile ? "bg-indigo-500" : "bg-emerald-500";
  const badgeColor = isMobile ? "text-indigo-400" : "text-emerald-400";
  const dotColor = isMobile ? "bg-indigo-500" : "bg-emerald-500";

  const overview = splitLines(project.overview);
  const features = splitLines(project.features);
  const conclusion = splitLines(project.conclusion);
  const technologies = project.technologies ?? [];

  const githubUrl = project.github_url;
  const [readme, meta, languages, contributors] = await Promise.all([
    githubUrl ? getRepoReadme(githubUrl) : Promise.resolve(null),
    githubUrl ? getRepoMeta(githubUrl) : Promise.resolve(null),
    githubUrl ? getRepoLanguages(githubUrl) : Promise.resolve(null),
    githubUrl ? getRepoContributors(githubUrl) : Promise.resolve(null),
  ]);

  const hasLinks = Boolean(project.live_url || project.github_url);

  // Language distribution (top 8 + "Other").
  const languagesDonut = languages
    ? (() => {
        const top = languages.slice(0, 8);
        const restBytes = languages
          .slice(8)
          .reduce((s, l) => s + l.bytes, 0);
        const data = top.map((l, i) => ({
          label: l.name,
          value: l.bytes,
          color: langColor(l.name, i),
        }));
        if (restBytes > 0) {
          data.push({ label: "Other", value: restBytes, color: "#64748b" });
        }
        return data;
      })()
    : null;

  const primaryImage = project.image || project.images?.[0] || "/bordered.png";
  const projectImageUrl = primaryImage.startsWith("http") ? primaryImage : `${SITE_URL}${primaryImage}`;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": isMobile ? "MobileApplication" : "WebApplication",
    name: project.name,
    description: project.short_details || project.overview,
    applicationCategory: isMobile ? "MobileApp" : "WebApplication",
    operatingSystem: isMobile ? "Android, iOS" : "All",
    author: {
      "@type": "Person",
      name: "Kaium Al Limon",
      url: SITE_URL,
    },
    url: `${SITE_URL}/projects/${project.id}`,
    image: projectImageUrl,
    keywords: project.technologies?.join(", "),
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />
      <HomeBackground />
      <FloatingHeader />

      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 py-28">
          <Link
            href="/projects"
            className="cursor-target inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> All Projects
          </Link>

          <Reveal className="mt-8">
            <article className="border border-white/10 bg-slate-900/30 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
              {/* Hero */}
              <div className="relative overflow-hidden p-6 md:p-10">
                <div
                  className={`pointer-events-none absolute -top-32 -right-16 h-80 w-80 rounded-full blur-3xl opacity-30 ${glowColor}`}
                />
                <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full blur-3xl opacity-20 bg-indigo-500" />

                <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span
                        className={`${badgeColor} text-xs font-semibold tracking-wider uppercase`}
                      >
                        {isMobile ? "Mobile" : "Web"} Project
                      </span>
                    </div>
                    <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-white tracking-tight">
                      {project.name}
                    </h1>
                    {project.short_details && (
                      <p className="mt-4 max-w-2xl text-lg text-slate-400 leading-relaxed">
                        {project.short_details}
                      </p>
                    )}
                  </div>

                  {hasLinks && (
                    <div className="flex shrink-0 gap-3">
                      {project.live_url && (
                        <a
                          href={toExternalUrl(project.live_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-target inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors"
                        >
                          <LinkIcon size={16} /> Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={toExternalUrl(project.github_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-target inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors shadow-lg shadow-indigo-500/25"
                        >
                          <FaGithub size={16} /> Source Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Banner gallery */}
              <ProjectGallery images={projectImages} alt={project.name ?? "Project"} />

              {/* Body */}
              <div className="space-y-12 border-t border-white/10 p-6 md:p-10">
                {/* GitHub stats strip */}
                {meta && (
                  <Reveal>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <RepoStat icon={Star} label="Stars" value={meta.stars} />
                      <RepoStat icon={GitFork} label="Forks" value={meta.forks} />
                      <RepoStat
                        icon={CircleDot}
                        label="Open Issues"
                        value={meta.openIssues}
                      />
                      <RepoStat icon={Eye} label="Watchers" value={meta.watchers} />
                    </div>
                  </Reveal>
                )}

                {/* Code insights: languages + repository details */}
                {(languagesDonut || meta) && (
                  <Reveal delay={0.05}>
                    <div className="grid gap-6 lg:grid-cols-2">
                      {languagesDonut && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                          <SectionTitle>Languages</SectionTitle>
                          <DonutChart
                            data={languagesDonut}
                            unit="Languages"
                            showPercentage
                          />
                        </div>
                      )}
                      {meta && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                          <SectionTitle>Repository</SectionTitle>
                          <RepoDetails meta={meta} />
                        </div>
                      )}
                    </div>
                  </Reveal>
                )}

                {/* Contributors */}
                {contributors && contributors.length > 0 && (
                  <Reveal delay={0.05}>
                    <section>
                      <SectionTitle>
                        <span className="inline-flex items-center gap-2">
                          <Users size={18} className="text-indigo-400" />
                          Contributors
                        </span>
                      </SectionTitle>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {contributors.map((c) => (
                          <div
                            key={c.login}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                          >
                            {c.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={c.avatar}
                                alt={c.login}
                                className="h-9 w-9 rounded-full border border-white/10"
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-full bg-slate-700" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium text-white">
                                {c.login}
                              </div>
                              <div className="text-xs text-slate-500">
                                {c.contributions.toLocaleString()} commits
                              </div>
                            </div>
                            <div className="text-right text-xs">
                              <div className="text-emerald-400">
                                +{c.additions.toLocaleString()}
                              </div>
                              <div className="text-red-400">
                                -{c.deletions.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </Reveal>
                )}

                {overview.length > 0 && (
                  <Reveal>
                    <section>
                      <SectionTitle>Overview</SectionTitle>
                      <div className="space-y-3 text-slate-300 leading-relaxed">
                        {overview.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    </section>
                  </Reveal>
                )}

                {features.length > 0 && (
                  <Reveal delay={0.05}>
                    <section>
                      <SectionTitle>Key Features</SectionTitle>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20"
                          >
                            <Check
                              size={16}
                              className="mt-0.5 shrink-0 text-emerald-400"
                            />
                            <span className="text-sm text-slate-300">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </Reveal>
                )}

                {readme && (
                  <Reveal delay={0.1}>
                    <section>
                      <SectionTitle>README</SectionTitle>
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50">
                        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
                          <FaGithub size={16} className="text-white" />
                          <span className="text-sm font-medium text-white">
                            README.md
                          </span>
                          {project.github_url && (
                            <a
                              href={toExternalUrl(project.github_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                            >
                              View on GitHub
                              <ArrowUpRight size={14} />
                            </a>
                          )}
                        </div>
                        <div className="p-6">
                          <ReadmeRenderer content={readme} />
                        </div>
                      </div>
                    </section>
                  </Reveal>
                )}

                {conclusion.length > 0 && (
                  <Reveal delay={0.05}>
                    <section>
                      <SectionTitle>Conclusion</SectionTitle>
                      <div className="space-y-3 text-slate-300 leading-relaxed">
                        {conclusion.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    </section>
                  </Reveal>
                )}
              </div>
            </article>
          </Reveal>
        </div>

        <FlutterFooter />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-5 w-1 rounded-full bg-indigo-500" />
      <h2 className="text-xl font-semibold text-white">{children}</h2>
    </div>
  );
}

function RepoStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold text-white tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function RepoDetails({ meta }: { meta: import("@/lib/github").RepoMeta }) {
  const sizeLabel =
    meta.sizeKb >= 1024
      ? `${(meta.sizeKb / 1024).toFixed(1)} MB`
      : `${meta.sizeKb} KB`;
  const rows: { label: string; value: string }[] = [
    { label: "Default Branch", value: meta.defaultBranch || "—" },
    { label: "Primary Language", value: meta.language || "—" },
    { label: "Created", value: formatDate(meta.createdAt) },
    { label: "License", value: meta.license || "—" },
    { label: "Size", value: sizeLabel },
  ];
  return (
    <div className="space-y-5">
      <dl className="space-y-3 text-sm">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-3"
          >
            <dt className="text-slate-500">{r.label}</dt>
            <dd className="font-medium text-slate-200">{r.value}</dd>
          </div>
        ))}
      </dl>

      {meta.htmlUrl && (
        <a
          href={toExternalUrl(meta.htmlUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-target inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
        >
          View Repository
          <ArrowUpRight size={14} />
        </a>
      )}

      {meta.topics && meta.topics.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Topics
          </div>
          <div className="flex flex-wrap gap-2">
            {meta.topics.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
