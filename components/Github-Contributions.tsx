'use client';

import { useEffect, useState } from "react";
import { ArrowUpRight, Flame, GitCommitHorizontal } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ScrollReveal,
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from "@/components/shared/scroll-reveal";

const GITHUB_USERNAME = "kaiumallimon";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubContributionsData {
  stats: {
    totalContributions: number;
    longestStreak: number;
    totalRepos: number;
    totalStars: number;
  };
  contributionDays: ContributionDay[];
}

const LEVEL_COLORS: Record<number, string> = {
  0: "bg-white/5",
  1: "bg-indigo-900/70",
  2: "bg-indigo-700/80",
  3: "bg-indigo-500/90",
  4: "bg-indigo-400",
};

function ContributionCell({ day }: { day: ContributionDay }) {
  return (
    <div
      className={`w-full aspect-square rounded-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-indigo-400/40 cursor-target ${LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0]}`}
      title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
    />
  );
}

function ContributionsSkeleton() {
  return (
    <div className="cursor-target border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 bg-slate-900/30 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-slate-700" />
          <Skeleton className="h-4 w-64 bg-slate-700" />
        </div>
        <Skeleton className="h-9 w-36 rounded-full bg-slate-700" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl bg-slate-700" />
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1 min-w-[600px]">
          {Array.from({ length: 53 }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1 flex-1">
              {Array.from({ length: 7 }).map((_, dayIdx) => (
                <Skeleton key={dayIdx} className="w-full aspect-square rounded-sm bg-slate-700" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GithubContributions() {
  const [data, setData] = useState<GitHubContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch(`/api/github/${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData({
          stats: json.stats,
          contributionDays: json.contributionDays ?? [],
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchContributions();
  }, []);

  const statCards = data
    ? [
        { label: "Contributions", value: data.stats.totalContributions.toLocaleString(), icon: GitCommitHorizontal },
        { label: "Longest Streak", value: `${data.stats.longestStreak} days`, icon: Flame },
        { label: "Public Repos", value: data.stats.totalRepos.toLocaleString(), icon: FaGithub },
      ]
    : [];

  return (
    <ScrollRevealSection id="contributions" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Open Source Activity</h2>
            <p className="text-slate-400">Consistent coding habits reflected in my GitHub contribution graph.</p>
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors w-fit"
          >
            View profile on GitHub
            <ArrowUpRight size={16} />
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
        {loading ? (
          <ContributionsSkeleton />
        ) : error || !data ? (
          <div className="cursor-target border border-white/10 backdrop-blur-md rounded-2xl p-8 text-center bg-slate-900/30">
            <p className="text-slate-400 text-sm">Unable to load contribution data right now.</p>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <FaGithub size={16} />
              Visit GitHub profile
            </a>
          </div>
        ) : (
          <div className="relative cursor-target border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden bg-slate-900/30 hover:border-white/20 transition-all duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-6 md:p-8 space-y-6 relative">
              <ScrollRevealStagger className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <ScrollRevealStaggerItem key={stat.label}>
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white leading-tight">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.label}</p>
                      </div>
                    </div>
                    </ScrollRevealStaggerItem>
                  );
                })}
              </ScrollRevealStagger>

              <div>
                <p className="text-sm text-slate-400 mb-4">
                  <span className="text-white font-medium">{data.stats.totalContributions.toLocaleString()}</span> contributions in the last year
                </p>

                <div className="overflow-x-auto pb-1">
                  <div className="inline-flex gap-1 min-w-[600px] md:min-w-0 md:w-full">
                    {Array.from({ length: 53 }).map((_, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-1 flex-1">
                        {Array.from({ length: 7 }).map((_, dayIdx) => {
                          const dayData = data.contributionDays[weekIdx * 7 + dayIdx];
                          if (!dayData) return <div key={dayIdx} className="w-full aspect-square" />;
                          return <ContributionCell key={dayIdx} day={dayData} />;
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-sm ${LEVEL_COLORS[level]}`}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </ScrollReveal>
      </div>
    </ScrollRevealSection>
  );
}