"use client";

import { useEffect, useState, use } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type ProjectDetail = {
  id: string;
  idx?: number;
  name: string;
  short_details?: string;
  github_url?: string;
  technologies?: string;
  overview?: string;
  features?: string;
  conclusion?: string;
  created_at?: string;
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Normalize incoming text to render clean markdown
  const normalize = (s?: string) =>
    (s ?? "")
      .replace(/\r\n/g, "\n") // Windows newlines -> \n
      .replace(/\\n/g, "\n") // Escaped \n -> real newline
      .replace(/[ \t]+\n/g, "\n") // Trim trailing spaces before newline
      .trim();

  const toMarkdownList = (s?: string) => {
    const text = normalize(s);
    const lines = text
      .split(/\n+/)
      .map((l) => l.replace(/^[•*-]\s*/, "").replace(/,+\s*$/, "").trim())
      .filter((l) => l.length > 0);
    return lines.length ? lines.map((l) => `- ${l}`).join("\n") : text;
  };

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`, { cache: "no-store" });
        const data = await res.json();
        setProject(data.project ?? null);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  return (
    <div className="min-h-screen w-full bg-white/8 backdrop-blur-sm text-white">
      <div className="max-w-4xl mx-auto pt-24 pb-16 px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Project Details</h1>
          <Link href="/projects" className="text-white/80 hover:text-white text-sm">
            ← Back to projects
          </Link>
        </div>

        {loading ? (
          <div className="text-white/60">Loading project...</div>
        ) : !project ? (
          <div className="text-white/60">Project not found.</div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/12 bg-black/10 p-6">
              <div className="text-sm text-white/60 mb-2">Name</div>
              <div className="text-xl font-bold">{project.name}</div>
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm text-white/80"
                >
                  GitHub ↗
                </a>
              )}
            </div>

            {project.short_details && (
              <div className="rounded-xl border border-white/12 bg-black/10 p-6">
                <div className="text-sm text-white/60 mb-2">Short Details</div>
                <p className="text-white/80 text-sm leading-relaxed">{project.short_details}</p>
              </div>
            )}

            {project.overview && (
              <div className="rounded-xl border border-white/12 bg-black/10 p-6">
                <div className="text-sm text-white/60 mb-2">Overview</div>
                <div className="prose prose-invert prose-sm max-w-none text-white/80">
                  <ReactMarkdown>{normalize(project.overview)}</ReactMarkdown>
                </div>
              </div>
            )}

            {project.technologies && (
              <div className="rounded-xl border border-white/12 bg-black/10 p-6">
                <div className="text-sm text-white/60 mb-2">Technologies</div>
                <div className="prose prose-invert prose-sm max-w-none text-white/80">
                  <ReactMarkdown>{normalize(project.technologies)}</ReactMarkdown>
                </div>
              </div>
            )}

            {project.features && (
              <div className="rounded-xl border border-white/12 bg-black/10 p-6">
                <div className="text-sm text-white/60 mb-2">Features</div>
                <ul className="list-disc pl-5 space-y-2 text-white/80 text-sm">
                  {normalize(project.features)
                    .split(/\n/)
                    .map((line) => line.replace(/^[•*-]\s*/, "").replace(/,+\s*$/, "").trim())
                    .filter((line) => line.length > 0)
                    .map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                </ul>
              </div>
            )}

            {project.conclusion && (
              <div className="rounded-xl border border-white/12 bg-black/10 p-6">
                <div className="text-sm text-white/60 mb-2">Conclusion</div>
                <div className="prose prose-invert prose-sm max-w-none text-white/80">
                  <ReactMarkdown>{normalize(project.conclusion)}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
