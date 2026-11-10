import React from "react";
import { MonochromeHeader } from "@/components/monochrome/header";

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 transition-colors duration-200">
      {/* Central Editorial Container: max-w-5xl */}
      <div className="mx-auto max-w-5xl bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <MonochromeHeader />

          {/* Top Breadcrumb Navigation Bar Skeleton */}
          <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Home</span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="text-zinc-400">Projects</span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <div className="h-3.5 w-28 rounded-xs bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" />
            </div>

            <div className="h-3.5 w-20 rounded-xs bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" />
          </div>

          {/* Project Hero Header Skeleton */}
          <section className="p-4 sm:p-6 md:p-8 space-y-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            {/* Category tag skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 rounded-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 animate-pulse" />
              <div className="h-3.5 w-20 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            </div>

            {/* Title & Summary Skeletons */}
            <div className="space-y-3">
              <div className="h-8 sm:h-10 w-2/3 max-w-md rounded-xs bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" />
              <div className="space-y-2 max-w-2xl">
                <div className="h-4 w-full rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                <div className="h-4 w-4/5 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              </div>
            </div>

            {/* Action Buttons Skeletons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="h-8 w-28 rounded-xs bg-zinc-950/10 dark:bg-zinc-100/10 animate-pulse" />
              <div className="h-8 w-36 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 animate-pulse" />
            </div>

            {/* Live GitHub Telemetry Strip Skeleton */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="h-3.5 w-16 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="h-3.5 w-16 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="h-3.5 w-24 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="h-3.5 w-20 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            </div>

            {/* Tech Tags Skeletons */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              <div className="h-5 w-16 rounded-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 animate-pulse" />
              <div className="h-5 w-14 rounded-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 animate-pulse" />
              <div className="h-5 w-20 rounded-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 animate-pulse" />
              <div className="h-5 w-18 rounded-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 animate-pulse" />
            </div>
          </section>

          {/* Visual Device Representation Frame Skeleton */}
          <div className="h-48 sm:h-64 md:h-80 w-full border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-center p-6">
            <div className="w-full max-w-md h-36 sm:h-48 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 animate-pulse" />
          </div>

          {/* Stripe Divider */}
          <div className="stripe-divider h-8 border-b border-zinc-200 dark:border-zinc-800 w-full" />

          {/* README Skeleton Card */}
          <section className="p-4 sm:p-6 md:p-8 space-y-6">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden rounded-xs">
              {/* README Header Skeleton */}
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 flex items-center justify-between">
                <div className="h-3.5 w-24 rounded-xs bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" />
                <div className="h-3.5 w-32 rounded-xs bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" />
              </div>

              {/* README Body Skeleton */}
              <div className="p-4 sm:p-6 md:p-8 space-y-5">
                <div className="h-6 w-1/3 rounded-xs bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                  <div className="h-3.5 w-11/12 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                  <div className="h-3.5 w-4/5 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                </div>
                <div className="h-28 w-full rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/40 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                  <div className="h-3.5 w-3/4 rounded-xs bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                </div>
              </div>
            </div>
          </section>

          {/* Stripe Divider */}
          <div className="stripe-divider h-8 border-y border-zinc-200 dark:border-zinc-800 w-full" />
        </div>

        {/* Footer Skeleton */}
        <div className="h-36 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/10" />
      </div>
    </div>
  );
}
