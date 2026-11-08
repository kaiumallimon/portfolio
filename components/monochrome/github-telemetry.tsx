"use client";

import { GitHubStats } from "@/lib/github";
import { Star, GitFork, BookOpen, Users } from "lucide-react";
import { RiGithubLine } from "@remixicon/react";
import { GitHubCalendar } from "react-github-calendar";

export function MonochromeGitHubTelemetry({
  stats,
  username = "kaiumallimon",
}: {
  stats: GitHubStats | null;
  username?: string;
}) {
  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
              Open Source & Activity
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              Live GitHub repository statistics and commit heatmap
            </p>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <RiGithubLine className="w-3.5 h-3.5" />
            <span>@{username}</span>
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono">
              <span>Repos</span>
              <BookOpen className="w-3 h-3" />
            </div>
            <div className="mt-1 text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {stats?.publicRepos ?? 147}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono">
              <span>Stars</span>
              <Star className="w-3 h-3" />
            </div>
            <div className="mt-1 text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {stats?.totalStars ?? 142}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono">
              <span>Forks</span>
              <GitFork className="w-3 h-3" />
            </div>
            <div className="mt-1 text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {stats?.totalForks ?? 38}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-mono">
              <span>Followers</span>
              <Users className="w-3 h-3" />
            </div>
            <div className="mt-1 text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {stats?.followers ?? 65}
            </div>
          </div>
        </div>

        {/* Heatmap Card */}
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3 overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
            <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
              Contribution Graph
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              UTC +6
            </span>
          </div>

          <div className="overflow-x-auto py-1 flex justify-center">
            <GitHubCalendar
              username={username}
              blockSize={10}
              blockMargin={2.5}
              fontSize={10}
              colorScheme="dark"
              theme={{
                light: ["#f4f4f5", "#d4d4d8", "#a1a1aa", "#71717a", "#18181b"],
                dark: ["#18181b", "#27272a", "#3f3f46", "#71717a", "#fafafa"],
              }}
            />
          </div>

          {stats?.topLanguages && stats.topLanguages.length > 0 && (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex h-1.5 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 gap-0.5">
                {stats.topLanguages.map((lang, i) => (
                  <div
                    key={lang.name}
                    style={{ width: `${lang.percentage}%` }}
                    className={`h-full ${
                      i === 0
                        ? "bg-zinc-900 dark:bg-zinc-100"
                        : i === 1
                        ? "bg-zinc-700 dark:bg-zinc-300"
                        : i === 2
                        ? "bg-zinc-500 dark:bg-zinc-500"
                        : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2.5 mt-2 text-[10px] font-mono text-zinc-500">
                {stats.topLanguages.map((lang) => (
                  <span key={lang.name} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 dark:bg-zinc-300" />
                    <span>{lang.name}</span>
                    <span className="tabular-nums text-zinc-400">({lang.percentage}%)</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
