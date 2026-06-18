'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Crown, FolderGit2, Smartphone, Star, Trophy, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const GITHUB_USERNAME = 'kaiumallimon';

interface MetricCard {
  label: string;
  value: number;
  suffix?: string;
  icon: typeof Smartphone;
  color: string;
  iconBg: string;
}

const STATIC_METRICS: MetricCard[] = [
  {
    label: 'Years in Flutter',
    value: 3,
    suffix: '+',
    icon: Smartphone,
    color: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
  },
  {
    label: 'Competitions',
    value: 4,
    icon: Trophy,
    color: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  {
    label: 'Wins & Top 3s',
    value: 4,
    icon: Crown,
    color: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10',
  },
  {
    label: 'App Forum Tenure',
    value: 3,
    suffix: '+ yrs',
    icon: Users,
    color: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
  },
];

function AnimatedValue({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function MetricSkeleton() {
  return (
    <div className="cursor-target border border-white/10 backdrop-blur-md rounded-2xl p-6 bg-slate-900/30">
      <Skeleton className="w-10 h-10 rounded-xl mb-4 bg-slate-700" />
      <Skeleton className="h-8 w-16 mb-2 bg-slate-700" />
      <Skeleton className="h-4 w-28 bg-slate-700" />
    </div>
  );
}

export default function FlutterPortfolioImpact() {
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [githubRes, projectsRes] = await Promise.all([
          fetch(`/api/github/${GITHUB_USERNAME}`),
          fetch('/api/projects'),
        ]);

        if (githubRes.ok) {
          const githubData = await githubRes.json();
          setGithubStars(githubData.stats?.totalStars ?? 0);
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjectCount(projectsData.projects?.length ?? 0);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  const dynamicMetrics: MetricCard[] = [
    ...(githubStars !== null
      ? [{
          label: 'GitHub Stars',
          value: githubStars,
          icon: Star,
          color: 'text-yellow-400',
          iconBg: 'bg-yellow-500/10',
        }]
      : []),
  ];

  const allMetrics = [...STATIC_METRICS, ...dynamicMetrics];

  return (
    <motion.section
      id="impact"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Impact at a Glance</h2>
          <p className="text-slate-400">Quantifying years of software development, leadership, and competition results.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <MetricSkeleton key={i} />)
            : allMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="cursor-target group border border-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 bg-slate-900/30 hover:border-white/20 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-xl ${metric.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={18} className={metric.color} />
                    </div>
                    <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                      <AnimatedValue value={metric.value} suffix={metric.suffix} />
                    </p>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">{metric.label}</p>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </motion.section>
  );
}
