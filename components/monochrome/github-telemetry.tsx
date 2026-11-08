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
    <section className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            GitHub Telemetry &amp; Contributions
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Real-time public commit calendar and repository activity
          </p>
        </div>

        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <RiGithubLine className="w-3.5 h-3.5" />
          <span>@{username}</span>
        </a>
      </div>

      {/* 4-Stat Ticker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:border-zinc-800 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono">
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-zinc-400">Repositories</div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {stats?.publicRepos ?? 147}
            </div>
          </div>
          <BookOpen className="w-4 h-4 text-zinc-400" />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-zinc-400">Total Stars</div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {stats?.totalStars ?? 142}
            </div>
          </div>
          <Star className="w-4 h-4 text-zinc-400" />
        </div>

        <div className="p-4 flex items-center justify-between border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="text-[11px] text-zinc-400">Forks</div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {stats?.totalForks ?? 38}
            </div>
          </div>
          <GitFork className="w-4 h-4 text-zinc-400" />
        </div>

        <div className="p-4 flex items-center justify-between border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="text-[11px] text-zinc-400">Followers</div>
            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
              {stats?.followers ?? 65}
            </div>
          </div>
          <Users className="w-4 h-4 text-zinc-400" />
        </div>
      </div>

      {/* Contribution Calendar */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="overflow-x-auto py-2 flex justify-center">
          <GitHubCalendar
            username={username}
            blockSize={11}
            blockMargin={3}
            fontSize={11}
            colorScheme="dark"
            theme={{
              light: ["#f4f4f5", "#d4d4d8", "#a1a1aa", "#71717a", "#18181b"],
              dark: ["#18181b", "#27272a", "#3f3f46", "#71717a", "#fafafa"],
            }}
          />
        </div>

        {stats?.topLanguages && stats.topLanguages.length > 0 && (
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900">
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
            <div className="flex flex-wrap gap-3 mt-2.5 text-[11px] font-mono text-zinc-500">
              {stats.topLanguages.map((lang) => (
                <span key={lang.name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 dark:bg-zinc-300" />
                  <span>{lang.name}</span>
                  <span className="tabular-nums text-zinc-400">({lang.percentage}%)</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
