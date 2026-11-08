"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RiLink,
  RiFilePdf2Line,
  RiDownloadLine,
  RiExternalLinkLine,
  RiCloseLine,
  RiGithubLine,
  RiArrowRightLine,
} from "@remixicon/react";
import { ArrowUpRight, BookOpen, Layers } from "lucide-react";
import { toast } from "sonner";

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

const TRUNCATED_TEXT =
  "COSMOS-ITS is personalized academic support for university students provided by an AI-powered intelligent tutoring system. With traditional educational methods, it is not easy to develop scalable and adaptable learning material which fits divergent university curricula. To address these limitations, COSMOS-ITS leverages a multi-agent architecture that incorporates state-of-the-art machine learning models, semantic vector search, and domain-specific AI agents to provide context-aware real-time tutoring...";

const FULL_ABSTRACT = `COSMOS-ITS is personalized academic support for university students provided by an AI-powered intelligent tutoring system. With traditional educational methods, it is not easy to develop scalable and adaptable learning material which fits divergent university curricula. To address these limitations, COSMOS-ITS leverages a multi-agent architecture that incorporates state-of-the-art machine learning models, semantic vector search, and domain-specific AI agents to provide context-aware real-time tutoring.

The system is organized in layers from low-level text processing to end-user interaction, including a guided chat interface, a supervised query classifier for domain routing, custom academic agents that include tools for content retrieval and explanation, and a continuous AI feedback loop with adaptive learning. The development was modular and iterative, relying on tools such as FastAPI, ChromaDB, and Manim.

Evaluation shows COSMOS-ITS can successfully identify and classify queries, ensure relevant multi-modal responses, and personalise help based on user history both known (profile) and unknown (feedback). This innovation provides an adaptive and personalized platform to simulate individual academic guidance, improving the learning experience of students and increasing success in the classroom.`;

interface ThesisViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThesisViewerModal({ isOpen, onClose }: ThesisViewerModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-2 sm:p-4 select-none animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="w-full max-w-5xl mx-auto h-full flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xs shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <RiFilePdf2Line className="w-5 h-5 text-red-500 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-zinc-50 truncate font-sans">
                COSMOS-ITS — Thesis & Defense Final Documentation
              </h3>
              <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                thesis-project-report-team-bcrypt.pdf (6.0 MB) · Team Bcrypt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Download Link */}
            <a
              href={PDF_URL}
              download="thesis-project-report-team-bcrypt.pdf"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors"
              title="Download PDF report"
            >
              <RiDownloadLine className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Open in full tab */}
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors"
              title="Open raw PDF in new browser tab"
            >
              <RiExternalLinkLine className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Raw Tab</span>
            </a>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xs hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Close viewer (Esc)"
              aria-label="Close viewer"
            >
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Iframe Viewport */}
        <div className="relative flex-1 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
          <iframe
            src={`${PDF_URL}#toolbar=1&navpanes=0`}
            className="w-full h-full border-0"
            title="COSMOS-ITS Thesis Report PDF Preview"
          />

          {/* Fallback overlay note for mobile browsers that do not support embedded PDF viewing */}
          <div className="sm:hidden absolute bottom-2 left-2 right-2 bg-zinc-900/90 text-white text-[11px] font-mono p-2 rounded-xs border border-zinc-700 text-center backdrop-blur-xs flex items-center justify-between">
            <span>Viewing on mobile?</span>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Open PDF full screen →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MonochromeThesis() {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#thesis`);
      toast.success("Section link copied");
    }
  };

  return (
    <section
      id="thesis"
      className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Thesis &amp; Defense Project
          </h2>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Thesis & Defense Project"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          Capstone Defense
        </span>
      </div>

      {/* Main Thesis Content Card */}
      <div className="p-4 sm:p-6">
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 sm:p-7 space-y-5">
          {/* Top Metadata Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-4">
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <span className="px-2 py-0.5 rounded-xs bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-[10px] tracking-wide uppercase">
                B.Sc. Final Defense
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                Department of Computer Science &amp; Engineering
              </span>
            </div>

            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
              United International University · July 2026
            </div>
          </div>

          {/* Project Title */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              [Research &amp; Engineering Defense]
            </div>
            <h3 className="text-lg sm:text-2xl font-semibold text-zinc-950 dark:text-zinc-50 font-sans tracking-tight leading-snug">
              COSMOS-ITS: Collaborative Orchestration System for Multi-Agent
              Optimization and Synthesis for Intelligent Tutoring Systems
            </h3>
          </div>

          {/* Truncated Description with Ellipsis & Expandable Abstract */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              {showFullAbstract ? FULL_ABSTRACT : TRUNCATED_TEXT}
            </p>
            <button
              type="button"
              onClick={() => setShowFullAbstract((prev) => !prev)}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 cursor-pointer underline decoration-dotted transition-colors"
            >
              {showFullAbstract ? "[Collapse abstract]" : "[Read expanded abstract]"}
            </button>
          </div>

          {/* Architecture & Stack Tags */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Architecture &amp; Technologies:</span>
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

          {/* Call to Actions & Links Bar */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Primary CTA: Open Integrated Thesis PDF Reader */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer group shadow-xs"
              >
                <RiFilePdf2Line className="w-4 h-4 text-red-400 dark:text-red-600" />
                <span>Read Full Thesis Report (PDF)</span>
                <RiArrowRightLine className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <Link
                href="/thesis"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-xs border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 transition-colors"
                title="View dedicated page"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dedicated View</span>
              </Link>
            </div>

            {/* External Links: Demo & Code */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <a
                href="https://cosmos-its-amber.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 font-medium transition-colors"
              >
                <span>Live Demo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://github.com/kaiumallimon/comos-its"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <RiGithubLine className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated PDF Reader Modal */}
      <ThesisViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
