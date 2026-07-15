import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Link as LinkIcon, Check } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home-color-bend";
import FlutterFooter from "@/components/custom-new/footer";
import TargetCursor from "@/components/TargetCursor";
import { getProjectById } from "@/lib/data";
import { getRepoReadme } from "@/lib/github";
import { toExternalUrl } from "@/lib/utils";
import { ReadmeRenderer } from "@/components/custom-new/readme-renderer";

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name ?? "Project"} — Portfolio`,
    description: project.short_details ?? undefined,
  };
}

function splitLines(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const isMobile = project.client === "mobile";
  const glowColor = isMobile ? "bg-indigo-500" : "bg-emerald-500";
  const badgeColor = isMobile ? "text-indigo-400" : "text-emerald-400";
  const dotColor = isMobile ? "bg-indigo-500" : "bg-emerald-500";

  const overview = splitLines(project.overview);
  const features = splitLines(project.features);
  const conclusion = splitLines(project.conclusion);
  const technologies = project.technologies ?? [];

  const readme = project.github_url
    ? await getRepoReadme(project.github_url)
    : null;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />
      <HomeBackground />
      <FloatingHeader />

      <div className="relative">
        <div className="max-w-5xl mx-auto px-6 py-32">
          <Link
            href="/projects"
            className="cursor-target inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> All Projects
          </Link>

          <article className="mt-8 border border-white/10 bg-slate-900/30 backdrop-blur-md rounded-3xl overflow-hidden">
            {/* Hero header */}
            <div className="relative p-8 md:p-10">
                <div
                  className={`absolute -top-24 -right-10 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30 ${glowColor}`}
                />
              <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span
                      className={`${badgeColor} text-xs font-semibold tracking-wider uppercase`}
                    >
                      {isMobile ? "Mobile" : "Web"} Project
                    </span>
                  </div>
                  <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-white tracking-tight">
                    {project.name}
                  </h1>
                  {project.short_details && (
                    <p className="mt-3 max-w-2xl text-slate-400">
                      {project.short_details}
                    </p>
                  )}
                </div>

                {(project.live_url || project.github_url) && (
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

            {/* Banner image */}
            {project.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={project.name ?? "Project"}
                className="w-full max-h-[420px] object-cover border-y border-white/10"
              />
            )}

            {/* Body */}
            <div className="p-8 md:p-10 space-y-10">
              {/* Technologies */}
              {technologies.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Technologies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Overview */}
              {overview.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Overview
                  </h2>
                  <div className="space-y-3 text-slate-300 leading-relaxed">
                    {overview.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* Features */}
              {features.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Key Features
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
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
              )}

              {/* README */}
              {readme && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <FaGithub size={18} className="text-white" />
                    <h2 className="text-lg font-semibold text-white">
                      README
                    </h2>
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
                  <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
                    <ReadmeRenderer content={readme} />
                  </div>
                </section>
              )}

              {/* Conclusion */}
              {conclusion.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Conclusion
                  </h2>
                  <div className="space-y-3 text-slate-300 leading-relaxed">
                    {conclusion.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        </div>

        <FlutterFooter />
      </div>
    </div>
  );
}
