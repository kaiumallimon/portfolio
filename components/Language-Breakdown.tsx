'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, Code2, Sparkles, Layers, Terminal, GitFork, Cpu } from 'lucide-react';
import {
  SiDart,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGo,
  SiCplusplus,
  SiKotlin,
  SiSwift,
  SiHtml5,
  SiCss3,
  SiRuby,
} from 'react-icons/si';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
  GSAPSectionHeader,
  SCROLL_VIEWPORT,
} from '@/components/shared/scroll-reveal';
import { springs, use3DTilt } from '@/lib/motion';

const GITHUB_USERNAME = 'kaiumallimon';

const LANGUAGE_CONFIG: Record<
  string,
  {
    color: string;
    gradient: string;
    icon: ComponentType<{ size?: number; className?: string }>;
    textColor: string;
    border: string;
    bg: string;
  }
> = {
  Dart: {
    color: '#0175C2',
    gradient: 'from-[#0175C2] to-[#02569B]',
    icon: SiDart,
    textColor: 'text-sky-400',
    border: 'hover:border-sky-500/40',
    bg: 'bg-sky-500/10',
  },
  TypeScript: {
    color: '#3178c6',
    gradient: 'from-[#3178c6] to-[#235a97]',
    icon: SiTypescript,
    textColor: 'text-blue-400',
    border: 'hover:border-blue-500/40',
    bg: 'bg-blue-500/10',
  },
  JavaScript: {
    color: '#f1e05a',
    gradient: 'from-[#f1e05a] to-[#d4c33d]',
    icon: SiJavascript,
    textColor: 'text-amber-400',
    border: 'hover:border-amber-500/40',
    bg: 'bg-amber-500/10',
  },
  Python: {
    color: '#3572A5',
    gradient: 'from-[#3572A5] to-[#ffd43b]',
    icon: SiPython,
    textColor: 'text-yellow-400',
    border: 'hover:border-yellow-500/40',
    bg: 'bg-yellow-500/10',
  },
  Go: {
    color: '#00ADD8',
    gradient: 'from-[#00ADD8] to-[#007d9c]',
    icon: SiGo,
    textColor: 'text-cyan-400',
    border: 'hover:border-cyan-500/40',
    bg: 'bg-cyan-500/10',
  },
  'C++': {
    color: '#f34b7d',
    gradient: 'from-[#f34b7d] to-[#c22d56]',
    icon: SiCplusplus,
    textColor: 'text-pink-400',
    border: 'hover:border-pink-500/40',
    bg: 'bg-pink-500/10',
  },
  Kotlin: {
    color: '#A97BFF',
    gradient: 'from-[#A97BFF] to-[#7f52ff]',
    icon: SiKotlin,
    textColor: 'text-purple-400',
    border: 'hover:border-purple-500/40',
    bg: 'bg-purple-500/10',
  },
  Swift: {
    color: '#F05138',
    gradient: 'from-[#F05138] to-[#c73922]',
    icon: SiSwift,
    textColor: 'text-orange-400',
    border: 'hover:border-orange-500/40',
    bg: 'bg-orange-500/10',
  },
  HTML: {
    color: '#e34c26',
    gradient: 'from-[#e34c26] to-[#b83818]',
    icon: SiHtml5,
    textColor: 'text-orange-500',
    border: 'hover:border-orange-500/40',
    bg: 'bg-orange-500/10',
  },
  CSS: {
    color: '#563d7c',
    gradient: 'from-[#563d7c] to-[#3d2b58]',
    icon: SiCss3,
    textColor: 'text-indigo-400',
    border: 'hover:border-indigo-500/40',
    bg: 'bg-indigo-500/10',
  },
  Ruby: {
    color: '#701516',
    gradient: 'from-[#701516] to-[#45090a]',
    icon: SiRuby,
    textColor: 'text-red-400',
    border: 'hover:border-red-500/40',
    bg: 'bg-red-500/10',
  },
};

function getLanguageMeta(lang: string) {
  return (
    LANGUAGE_CONFIG[lang] ?? {
      color: '#6366f1',
      gradient: 'from-indigo-500 to-violet-600',
      icon: Code2,
      textColor: 'text-indigo-400',
      border: 'hover:border-indigo-500/40',
      bg: 'bg-indigo-500/10',
    }
  );
}

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
    <div className="border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 bg-slate-900/40 space-y-6 shadow-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl bg-slate-800/60" />
        ))}
      </div>
      <Skeleton className="h-4 w-full rounded-full bg-slate-800/60" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl bg-slate-800/60" />
        ))}
      </div>
    </div>
  );
}

export default function LanguageBreakdown() {
  const [data, setData] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const cardTilt = use3DTilt({ maxTilt: 3, scale: 1.002 });

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
        .slice(0, 8)
    : [];

  const totalRepoCount = languages.reduce((acc, [, count]) => acc + count, 0) || 1;
  const totalLanguages = Object.keys(data?.languageDistribution ?? {}).length;

  const topLanguage = data?.stats.topLanguage || 'Dart';
  const TopIcon = getLanguageMeta(topLanguage).icon;

  return (
    <ScrollRevealSection id="languages" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* GSAP Chronological Section Header */}
        <GSAPSectionHeader
          eyebrow="Codebase Composition"
          title="Technology Distribution & Rhythm"
          subtitle={`Language breakdown across ${data?.stats.totalRepos ?? '—'} public repositories and production commits.`}
          className="mb-12 md:mb-14"
        />

        {loading ? (
          <BreakdownSkeleton />
        ) : error || !data ? (
          <div className="border border-white/10 backdrop-blur-xl rounded-3xl p-8 text-center bg-slate-900/40">
            <p className="text-slate-400 text-sm">Unable to load language telemetry right now.</p>
          </div>
        ) : (
          <div
            data-gsap-card
            ref={cardTilt.ref}
            onMouseMove={cardTilt.handleMouseMove}
            onMouseLeave={cardTilt.handleMouseLeave}
            className="perspective-1000"
          >
            <motion.div
              style={cardTilt.style}
              className="relative border border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden p-6 md:p-9 space-y-8 shadow-2xl shadow-black/40 hover:border-indigo-500/30 transition-all"
            >
              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />

              {/* 3 Top Telemetry Metrics */}
              <ScrollRevealStagger delay={0.15} className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                {/* Metric 1: Top Language Driver */}
                <ScrollRevealStaggerItem>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={springs.snappy}
                    className="flex items-center gap-3.5 rounded-2xl border border-white/8 bg-slate-950/50 p-4 backdrop-blur-md hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <TopIcon size={20} className="text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm md:text-base font-bold text-white tracking-tight truncate">
                          {data.stats.topLanguage}
                        </p>
                        <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-semibold">
                          #1
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Primary Core Driver</p>
                    </div>
                  </motion.div>
                </ScrollRevealStaggerItem>

                {/* Metric 2: Cadence Velocity */}
                <ScrollRevealStaggerItem>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={springs.snappy}
                    className="flex items-center gap-3.5 rounded-2xl border border-white/8 bg-slate-950/50 p-4 backdrop-blur-md hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Calendar size={18} className="text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm md:text-base font-bold text-white tracking-tight truncate">
                        {data.stats.mostActiveDay}
                      </p>
                      <p className="text-xs text-slate-400">Peak Coding Cadence</p>
                    </div>
                  </motion.div>
                </ScrollRevealStaggerItem>

                {/* Metric 3: Peak Velocity Month */}
                <ScrollRevealStaggerItem>
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={springs.snappy}
                    className="flex items-center gap-3.5 rounded-2xl border border-white/8 bg-slate-950/50 p-4 backdrop-blur-md hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <BarChart3 size={18} className="text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm md:text-base font-bold text-white tracking-tight truncate">
                        {data.stats.mostActiveMonth}
                      </p>
                      <p className="text-xs text-slate-400">Velocity Surge Month</p>
                    </div>
                  </motion.div>
                </ScrollRevealStaggerItem>
              </ScrollRevealStagger>

              {/* Continuous Multi-Segment Chromatic Spectrum Bar */}
              <div className="space-y-3 relative z-10 pt-1">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-slate-200 font-semibold flex items-center gap-2">
                    <Layers size={14} className="text-indigo-400" />
                    <span>Language Spectrum Distribution</span>
                  </span>
                  <span className="text-slate-400 font-mono text-xs">
                    {totalLanguages} distinct languages detected
                  </span>
                </div>

                {/* Stacked Chromatic Ribbon */}
                <div className="h-3.5 rounded-full bg-slate-950/80 p-0.5 border border-white/10 overflow-hidden flex gap-0.5 shadow-inner">
                  {languages.map(([language, count], index) => {
                    const meta = getLanguageMeta(language);
                    const pct = Math.max(2, Math.round((count / totalRepoCount) * 100));

                    return (
                      <motion.div
                        key={language}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={SCROLL_VIEWPORT}
                        transition={{
                          duration: 1.0,
                          delay: index * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ width: `${pct}%`, backgroundColor: meta.color }}
                        title={`${language}: ${pct}% (${count} repos)`}
                        className="h-full rounded-sm first:rounded-l-full last:rounded-r-full transition-all hover:brightness-125 cursor-pointer origin-left"
                      />
                    );
                  })}
                </div>
              </div>

              {/* 2-Column Responsive Language Bento Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 relative z-10">
                {languages.map(([language, count], index) => {
                  const meta = getLanguageMeta(language);
                  const Icon = meta.icon;
                  const pct = Math.round((count / totalRepoCount) * 100);

                  return (
                    <motion.div
                      key={language}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={SCROLL_VIEWPORT}
                      transition={{ ...springs.gentle, delay: index * 0.04 }}
                      whileHover={{ y: -2 }}
                      className={`p-4 rounded-2xl border border-white/8 bg-slate-950/40 backdrop-blur-md flex flex-col justify-between gap-3 transition-all ${meta.border}`}
                    >
                      {/* Language Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${meta.bg} border border-white/10 flex items-center justify-center shrink-0`}>
                            <Icon size={16} className={meta.textColor} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-tight">{language}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {count} {count === 1 ? 'repository' : 'repositories'}
                            </p>
                          </div>
                        </div>

                        {/* Percentage Pill */}
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {pct}%
                        </span>
                      </div>

                      {/* Smooth Progress Bar */}
                      <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={SCROLL_VIEWPORT}
                          transition={{
                            duration: 1.1,
                            delay: index * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{ backgroundColor: meta.color }}
                          className="h-full rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </motion.div>
          </div>
        )}
      </div>
    </ScrollRevealSection>
  );
}