"use client";

import Link from "next/link";
import { ArrowLeft, Home, FolderGit2, FileText } from "lucide-react";
import { MonochromeHeader } from "@/components/monochrome/header";
import { MonochromeFooter } from "@/components/monochrome/footer";
import { ISiteSettings } from "@/lib/models";

const DEFAULT_SETTINGS: Partial<ISiteSettings> = {
  name: "Kaium Al Limon",
  title: "Full-Stack Software Engineer",
  email: "kalimon291@gmail.com",
  githubUrl: "https://github.com/kaiumallimon",
  linkedinUrl: "https://linkedin.com/in/kaiumallimon",
  twitterUrl: "https://x.com/kaiumallimon",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* Central Editorial Container */}
      <div className="mx-auto max-w-5xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <MonochromeHeader />

          {/* Sub-Header Navigation Bar */}
          <section className="px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Return to portfolio</span>
            </Link>
          </section>

          {/* 404 Error Main Stage */}
          <section className="px-4 sm:px-6 py-16 sm:py-24 text-center border-b border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
            {/* Subtle Dither Background Matrix */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.10] text-zinc-950 dark:text-white"
              style={{
                backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-lg mx-auto space-y-6">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-xs shadow-xs">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
                </span>
                <span>HTTP 404 // ROUTE_NOT_FOUND</span>
              </div>

              {/* Massive Retro Pixel 404 */}
              <div className="select-none py-1">
                <span className="font-tiny5 text-[96px] sm:text-[140px] md:text-[170px] font-normal leading-none tracking-tight text-zinc-950 dark:text-zinc-100 block">
                  404
                </span>
              </div>

              {/* Error Explanation */}
              <div className="space-y-2">
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
                  Endpoint Coordinates Unreachable
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-mono max-w-md mx-auto leading-relaxed">
                  The requested resource does not exist in the routing manifest. It may have been relocated, refactored, or never compiled.
                </p>
              </div>

              {/* Dev-Native Telemetry Box */}
              <div className="w-full max-w-md mx-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 p-3.5 font-mono text-left text-xs space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-zinc-600 dark:text-zinc-300">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    <span>telemetry.diagnostics</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">status: 404</span>
                </div>
                <div className="space-y-1 text-[11px] sm:text-xs text-zinc-700 dark:text-zinc-300">
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500">exception:</span> NullRouteResolution
                  </div>
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500">framework:</span> Next.js 16 (Turbopack)
                  </div>
                  <div>
                    <span className="text-zinc-400 dark:text-zinc-500">resolution:</span> navigate back to root index
                  </div>
                </div>
              </div>

              {/* Quick Navigation Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/"
                  prefetch={false}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-mono text-xs font-medium hover:opacity-90 active:scale-95 transition-all shadow-xs"
                >
                  <Home className="size-3.5" />
                  <span>Return Home</span>
                </Link>

                <Link
                  href="/projects"
                  prefetch={false}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-medium active:scale-95 transition-all shadow-xs"
                >
                  <FolderGit2 className="size-3.5" />
                  <span>Browse Projects</span>
                </Link>

                <Link
                  href="/thesis"
                  prefetch={false}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-medium active:scale-95 transition-all shadow-xs"
                >
                  <FileText className="size-3.5" />
                  <span>Thesis Project</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Stripe divider */}
          <div className="stripe-divider h-8 border-b border-zinc-200 dark:border-zinc-800 w-full" />
        </div>

        {/* Consistent Redesigned Footer */}
        <MonochromeFooter settings={DEFAULT_SETTINGS} />
      </div>
    </div>
  );
}
