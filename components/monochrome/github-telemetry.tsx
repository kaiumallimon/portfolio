"use client";

import React, { useMemo } from "react";
import { GitHubStats } from "@/lib/github";
import { Star, GitFork, BookOpen, Flame } from "lucide-react";
import { RiGithubLine } from "@remixicon/react";
import { ActivityCalendar } from "react-activity-calendar";
import { getKaiumContributionData } from "@/lib/github-data";

export function MonochromeGitHubTelemetry({
  stats,
  username = "kaiumallimon",
}: {
  stats: GitHubStats | null;
  username?: string;
}) {
  const contributionData = useMemo(() => getKaiumContributionData(), []);

  return (
    <section className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Calendar Area */}
      <div className="p-4 sm:p-6 overflow-hidden">
        {/* Calendar Summary Line */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              3,553 contributions
            </span>{" "}
            in the last year
          </div>
          <div className="text-[11px] text-zinc-400">
            9 Nov 2025 — 8 Nov 2026
          </div>
        </div>

        {/* Square Sharp Matrix: rx=0 ry=0 enforced on all svg rects */}
        <div className="overflow-x-auto py-2 flex justify-center [&_rect]:rx-0 [&_rect]:ry-0">
          <ActivityCalendar
            data={contributionData}
            blockSize={11.5}
            blockMargin={3}
            fontSize={11}
            blockRadius={0}
            colorScheme="dark"
            tooltips={{
              activity: {
                text: (activity) =>
                  `${activity.count} contributions on ${activity.date}`,
              },
            }}
            renderBlock={(block, activity) =>
              React.cloneElement(block, {
                title: `${activity.count} contributions on ${activity.date}`,
              })
            }
            theme={{
              light: ["#f4f4f5", "#d4d4d8", "#a1a1aa", "#71717a", "#18181b"],
              dark: ["#18181b", "#27272a", "#3f3f46", "#71717a", "#fafafa"],
            }}
          />
        </div>

        {/* Telemetry metrics bar */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5" title="Public Repositories">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                {stats?.publicRepos || 100}
              </span>
              <span>repos</span>
            </span>

            <span className="flex items-center gap-1.5" title="Total Stars">
              <Star className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                {stats?.totalStars || 22}
              </span>
              <span>stars</span>
            </span>

            <span className="flex items-center gap-1.5" title="Longest Streak">
              <Flame className="w-3.5 h-3.5 text-orange-500/80" />
              <span className="text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                12
              </span>
              <span>day streak</span>
            </span>
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <RiGithubLine className="w-3.5 h-3.5" />
            <span>@{username}</span>
          </a>
        </div>
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
