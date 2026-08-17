'use client';

import { useEffect, useState } from "react";
import { ArrowUpRight, Flame, GitCommitHorizontal } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  ScrollReveal,
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from "@/components/shared/scroll-reveal";
import { springs } from "@/lib/motion";

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
  1: "bg-indigo-900/60",
  2: "bg-indigo-700/80",
  3: "bg-indigo-500/90",
  4: "bg-indigo-400 shadow-xs shadow-indigo-400",
};

function ContributionCell({ day }: { day: ContributionDay }) {
  return (
    <motion.div
      whileHover={{ scale: 1.4, zIndex: 10 }}
      transition={springs.snappy}
      className={`w-full aspect-square rounded-[2px] cursor-target ${LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0]} transition-colors`}
      title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
    />
  );
}

function ContributionsSkeleton() {
  return (
    <div className="cursor-target border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 bg-slate-900/40 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-slate-800" />
          <Skeleton className="h-4 w-64 bg-slate-800" />
        </div>
        <Skeleton className="h-9 w-36 rounded-full bg-slate-800" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl bg-slate-800" />
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1 min-w-[600px]">
          {Array.from({ length: 53 }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1 flex-1">
              {Array.from({ length: 7 }).map((_, dayIdx) => (
                <Skeleton key={dayIdx} className="w-full aspect-square rounded-sm bg-slate-800" />
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
        { label: "Contributions (Year)", value: data.stats.totalContributions.toLocaleString(), icon: GitCommitHorizontal, color: "text-indigo-400" },
        { label: "Longest Streak", value: `${data.stats.longestStreak} days`, icon: Flame, color: "text-amber-400" },
        { label: "Public Repositories", value: data.stats.totalRepos.toLocaleString(), icon: FaGithub, color: "text-cyan-400" },
      ]
    : [];

  return (
    <ScrollRevealSection id="contributions" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
              Open Source
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Engineering Consistency
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Consistent shipping habits reflected in my real-time GitHub activity graph.
            </p>
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors w-fit font-medium"
          >
            <span>View profile on GitHub</span>
            <ArrowUpRight size={16} />
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {loading ? (
            <ContributionsSkeleton />
          ) : error || !data ? (
            <div className="cursor-target border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center bg-slate-900/40">
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
            <div className="relative cursor-target border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden bg-slate-900/40 hover:border-indigo-500/30 transition-colors shadow-2xl shadow-black/40">
              <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="p-6 md:p-9 space-y-7 relative z-10">
                <ScrollRevealStagger className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <ScrollRevealStaggerItem key={stat.label}>
                        <motion.div
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={springs.snappy}
                          className="flex items-center gap-3.5 rounded-2xl border border-white/8 bg-white/4 p-4 hover:border-indigo-500/20 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            <Icon size={18} className={stat.color} />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-white leading-tight">{stat.value}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                          </div>
                        </motion.div>
                      </ScrollRevealStaggerItem>
                    );
                  })}
                </ScrollRevealStagger>

                <div>
                  <p className="text-sm text-slate-400 mb-4">
                    <span className="text-white font-semibold">{data.stats.totalContributions.toLocaleString()}</span> contributions across public repositories in the last year
                  </p>

                  <div className="overflow-x-auto pb-2">
                    <div className="inline-flex gap-1.5 min-w-[640px] md:min-w-0 md:w-full">
                      {Array.from({ length: 53 }).map((_, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-1.5 flex-1">
                          {Array.from({ length: 7 }).map((_, dayIdx) => {
                            const dayData = data.contributionDays[weekIdx * 7 + dayIdx];
                            if (!dayData) return <div key={dayIdx} className="w-full aspect-square" />;
                            return <ContributionCell key={dayIdx} day={dayData} />;
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 font-medium">
                    <span>Less</span>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`w-3.5 h-3.5 rounded-[2px] ${LEVEL_COLORS[level]}`}
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