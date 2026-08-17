'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Code2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ScrollReveal,
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
  SCROLL_VIEWPORT,
} from '@/components/shared/scroll-reveal';
import { springs } from '@/lib/motion';

const GITHUB_USERNAME = 'kaiumallimon';

const LANGUAGE_COLORS: Record<string, string> = {
  Dart: 'bg-[#0175C2]',
  JavaScript: 'bg-[#f1e05a]',
  TypeScript: 'bg-[#3178c6]',
  Python: 'bg-[#3572A5]',
  Java: 'bg-[#b07219]',
  Kotlin: 'bg-[#A97BFF]',
  Swift: 'bg-[#F05138]',
  C: 'bg-[#555555]',
  'C++': 'bg-[#f34b7d]',
  HTML: 'bg-[#e34c26]',
  CSS: 'bg-[#563d7c]',
  Shell: 'bg-[#89e051]',
  Go: 'bg-[#00ADD8]',
  Ruby: 'bg-[#701516]',
};

interface LanguageData {
  languageDistribution: Record<string, number>;
  stats: {
    topLanguage: string;
    mostActiveDay: string;
    mostActiveMonth: string;
    totalRepos: number;
  };
}

function BreakdownSkeleton() {
  return (
    <div className="cursor-target border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 bg-slate-900/40 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl bg-slate-800" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-800" />
            <Skeleton className="h-2.5 w-full rounded-full bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LanguageBreakdown() {
  const [data, setData] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/github/${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData({
          languageDistribution: json.languageDistribution ?? {},
          stats: json.stats,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const languages = data
    ? Object.entries(data.languageDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
    : [];

  const maxCount = languages[0]?.[1] ?? 1;
  const totalLanguages = Object.keys(data?.languageDistribution ?? {}).length;

  const insightCards = data
    ? [
        { label: 'Primary Language', value: data.stats.topLanguage, icon: Code2, color: 'text-cyan-400' },
        { label: 'Most Active Day', value: data.stats.mostActiveDay, icon: Calendar, color: 'text-indigo-400' },
        { label: 'Peak Velocity Month', value: data.stats.mostActiveMonth, icon: BarChart3, color: 'text-emerald-400' },
      ]
    : [];

  return (
    <ScrollRevealSection id="languages" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
            Codebase Composition
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Technology Distribution
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Language breakdown across {data?.stats.totalRepos ?? '—'} repositories and engineering cadence.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {loading ? (
            <BreakdownSkeleton />
          ) : error || !data ? (
            <div className="cursor-target border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center bg-slate-900/40">
              <p className="text-slate-400 text-sm">Unable to load language data right now.</p>
            </div>
          ) : (
            <div className="relative cursor-target border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden bg-slate-900/40 hover:border-indigo-500/30 transition-colors shadow-2xl shadow-black/40">
              <div className="absolute top-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="p-6 md:p-9 space-y-8 relative z-10">
                <ScrollRevealStagger className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {insightCards.map((insight) => {
                    const Icon = insight.icon;
                    return (
                      <ScrollRevealStaggerItem key={insight.label}>
                        <motion.div
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={springs.snappy}
                          className="flex items-center gap-3.5 rounded-2xl border border-white/8 bg-white/4 p-4 hover:border-indigo-500/20 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            <Icon size={18} className={insight.color} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-white truncate">{insight.value}</p>
                            <p className="text-xs text-slate-400">{insight.label}</p>
                          </div>
                        </motion.div>
                      </ScrollRevealStaggerItem>
                    );
                  })}
                </ScrollRevealStagger>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="text-slate-300 font-semibold">Repository languages</span>
                    <span className="text-slate-500">{totalLanguages} languages detected</span>
                  </div>

                  {languages.length > 0 ? (
                    languages.map(([language, count], index) => {
                      const percentage = Math.round((count / maxCount) * 100);
                      const barColor = LANGUAGE_COLORS[language] ?? 'bg-indigo-500';

                      return (
                        <motion.div
                          key={language}
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={SCROLL_VIEWPORT}
                          transition={{ ...springs.gentle, delay: index * 0.05 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-slate-200 font-medium">{language}</span>
                            <span className="text-slate-400 tabular-nums">
                              {count} repo{count !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full bg-white/6 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              viewport={SCROLL_VIEWPORT}
                              transition={{ duration: 1.1, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                              className={`h-full rounded-full ${barColor}`}
                            />
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500">No language data available for public repositories.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </ScrollRevealSection>
  );
}