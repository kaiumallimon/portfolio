import type { Metadata } from "next";
import Link from "next/link";
import { MonochromeHeader } from "@/components/monochrome/header";
import { MonochromeContactFooter } from "@/components/monochrome/contact-footer";
import { getSiteSettings } from "@/lib/data-service";
import { SITE_URL } from "@/lib/site";
import { ArrowLeft, ArrowUpRight, Layers } from "lucide-react";
import {
  RiFilePdf2Line,
  RiDownloadLine,
  RiExternalLinkLine,
  RiGithubLine,
} from "@remixicon/react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title:
      "Thesis & Defense Project: COSMOS-ITS — Kaium Al Limon",
    description:
      "Collaborative Orchestration System for Multi-Agent Optimization and Synthesis for Intelligent Tutoring Systems. B.Sc. Capstone Defense at United International University.",
    alternates: {
      canonical: `${SITE_URL}/thesis`,
    },
  };
}

const PDF_URL = "/documents/thesis-project-report-team-bcrypt.pdf";

const ARCHITECTURE_TAGS = [
  "Multi-Agent Architecture",
  "Semantic Vector Search",
  "Supervised Query Classifier",
  "Adaptive Learning Loop",
  "FastAPI",
  "ChromaDB",
  "Manim",
  "Python",
];

export default async function ThesisPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* Central Editorial Container */}
      <div className="mx-auto max-w-5xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <MonochromeHeader />

          {/* Page Banner */}
          <section className="px-4 sm:px-6 py-8 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Overview</span>
            </Link>

            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                <span className="px-2 py-0.5 rounded-xs bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-[10px] tracking-wide uppercase">
                  B.Sc. Final Defense
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  United International University
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Team Bcrypt
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans leading-tight">
                COSMOS-ITS: Collaborative Orchestration System for Multi-Agent
                Optimization and Synthesis for Intelligent Tutoring Systems
              </h1>
            </div>
          </section>

          {/* Abstract & Architecture Details */}
          <section className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              <p>
                COSMOS-ITS is personalized academic support for university
                students provided by an AI-powered intelligent tutoring system.
                With traditional educational methods, it is not easy to develop
                scalable and adaptable learning material which fits divergent
                university curricula. To address these limitations, COSMOS-ITS
                leverages a multi-agent architecture that incorporates
                state-of-the-art machine learning models, semantic vector search,
                and domain-specific AI agents to provide context-aware real-time
                tutoring.
              </p>
              <p>
                The system is organized as layers from low-level text processing
                to end-user interaction where it includes a guided chat
                interface, a supervised query classifier for domain routing,
                custom academic agents that include tools for content retrieval
                and explanation, and a continuous AI feedback loop with
                adaptive learning. The development was modular and iterative,
                relying on tools such as FastAPI, ChromaDB, and Manim.
              </p>
              <p>
                Evaluation shows COSMOS-ITS can successfully identify and
                classify queries, ensure relevant multi-modal responses, and
                personalise help based on user history both known (profile) and
                unknown (feedback). Conclusion: This innovation provides an
                adaptive and personalized platform to simulate individual
                academic guidance in school and then improve learning
                experiences of students as well as increase success in the
                classroom.
              </p>
            </div>

            {/* Architecture tags */}
            <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <Layers className="w-3.5 h-3.5" />
                <span>Architecture &amp; Core Components:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ARCHITECTURE_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
              <a
                href={PDF_URL}
                download="thesis-project-report-team-bcrypt.pdf"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium transition-colors"
              >
                <RiDownloadLine className="w-3.5 h-3.5" />
                <span>Download Report (PDF)</span>
              </a>

              <a
                href="https://cosmos-its-amber.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <span>Live Platform</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://github.com/kaiumallimon/comos-its"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <RiGithubLine className="w-3.5 h-3.5" />
                <span>GitHub Source</span>
              </a>
            </div>
          </section>

          {/* Integrated In-Project PDF Viewer */}
          <section className="p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiFilePdf2Line className="w-4 h-4 text-red-500" />
                <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
                  Full Defense Documentation Viewer
                </span>
              </div>
              <a
                href={PDF_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1"
              >
                <span>Open Raw</span>
                <RiExternalLinkLine className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="w-full h-[80vh] border border-zinc-200 dark:border-zinc-800 rounded-xs overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <iframe
                src={`${PDF_URL}#toolbar=1`}
                className="w-full h-full border-0"
                title="COSMOS-ITS Thesis Report"
              />
            </div>
          </section>

          <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
        </div>

        {/* Footer */}
        <MonochromeContactFooter settings={settings} />
      </div>
    </div>
  );
}
