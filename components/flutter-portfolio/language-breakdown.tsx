'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Code2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="cursor-target border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 bg-slate-900/30 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl bg-slate-700" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-slate-700" />
            <Skeleton className="h-2.5 w-full rounded-full bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FlutterLanguageBreakdown() {
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
        { label: 'Top Language', value: data.stats.topLanguage, icon: Code2 },
        { label: 'Most Active Day', value: data.stats.mostActiveDay, icon: Calendar },
        { label: 'Peak Month', value: data.stats.mostActiveMonth, icon: BarChart3 },
      ]
    : [];

  return (
    <motion.section
      id="languages"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Codebase Composition</h2>
          <p className="text-slate-400">
            Language distribution across {data?.stats.totalRepos ?? '—'} public repositories and coding rhythm insights.
          </p>
        </div>

        {loading ? (
          <BreakdownSkeleton />
        ) : error || !data ? (
          <div className="cursor-target border border-white/10 backdrop-blur-md rounded-2xl p-8 text-center bg-slate-900/30">
            <p className="text-slate-400 text-sm">Unable to load language data right now.</p>
          </div>
        ) : (
          <div className="relative cursor-target border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden bg-slate-900/30 hover:border-white/20 transition-all duration-500">
            <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-6 md:p-8 space-y-8 relative">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {insightCards.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <motion.div
                      key={insight.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{insight.value}</p>
                        <p className="text-xs text-slate-500">{insight.label}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Repository languages</span>
                  <span className="text-slate-500">{totalLanguages} languages detected</span>
                </div>

                {languages.length > 0 ? (
                  languages.map(([language, count], index) => {
                    const percentage = Math.round((count / maxCount) * 100);
                    const barColor = LANGUAGE_COLORS[language] ?? 'bg-indigo-500';

                    return (
                      <motion.div
                        key={language}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300 font-medium">{language}</span>
                          <span className="text-slate-500 tabular-nums">
                            {count} repo{count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.06, ease: 'easeOut' }}
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
      </div>
    </motion.section>
  );
}
