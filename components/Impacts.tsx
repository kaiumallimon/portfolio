"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Crown, Smartphone, Star, Trophy, Users, ComputerIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ScrollReveal,
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from "@/components/shared/scroll-reveal";
import type { Metric } from "@/types/content";

const GITHUB_USERNAME = "kaiumallimon";

const ICON_MAP: Record<string, typeof Smartphone> = {
  Smartphone,
  Trophy,
  Crown,
  Users,
  Star,
};

interface MetricCard {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon: typeof Smartphone;
  color: string;
  iconBg: string;
  bento: string;
  featured?: boolean;
}

const BENTO_LAYOUT = [
  "col-span-2 row-span-2",
  "col-span-1",
  "col-span-1",
  "col-span-1",
  "col-span-1",
];

function AnimatedValue({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
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

function BentoSkeleton({ featured }: { featured?: boolean }) {
  return (
    <div
      className={cn(
        "border border-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 bg-slate-900/30",
        featured && "col-span-2 row-span-2 min-h-[200px] md:min-h-0"
      )}
    >
      <Skeleton className={cn("rounded-xl mb-4 bg-slate-700", featured ? "w-12 h-12" : "w-10 h-10")} />
      <Skeleton className={cn("mb-2 bg-slate-700", featured ? "h-10 w-20" : "h-8 w-16")} />
      <Skeleton className="h-4 w-28 bg-slate-700" />
    </div>
  );
}

function MetricBentoCard({ metric }: { metric: MetricCard }) {
  const Icon = metric.icon;
  return (
    <ScrollRevealStaggerItem className={cn(metric.bento, "h-full")}>
      <div
        className={cn(
          "cursor-target group relative overflow-hidden border border-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 bg-slate-900/30 hover:border-white/20 transition-all duration-300 h-full",
          metric.featured && "bg-gradient-to-br from-blue-500/10 via-slate-900/30 to-slate-900/30 min-h-[160px] md:min-h-0"
        )}
      >
        {metric.featured && (
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        )}
        <div className={cn("relative flex flex-col h-full", metric.featured && "justify-between")}>
          <div className={cn("rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300", metric.iconBg, metric.featured ? "w-12 h-12" : "w-10 h-10")}>
            <Icon size={metric.featured ? 22 : 18} className={metric.color} />
          </div>
          <div className={metric.featured ? "mt-auto" : undefined}>
            <p className={cn("font-semibold text-white tracking-tight", metric.featured ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl")}>
              <AnimatedValue value={metric.value} suffix={metric.suffix} />
            </p>
            <p className={cn("text-slate-500 mt-1", metric.featured ? "text-sm md:text-base" : "text-xs md:text-sm")}>{metric.label}</p>
          </div>
        </div>
      </div>
    </ScrollRevealStaggerItem>
  );
}

export default function PortfolioImpact({ metrics }: { metrics: Metric[] }) {
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch(`/api/github/${GITHUB_USERNAME}`);
        if (res.ok) {
          const data = await res.json();
          setGithubStars(data.stats?.totalStars ?? 0);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  const COLOR_MAP: Record<string, { color: string; iconBg: string }> = {
    Smartphone: { color: "text-blue-400", iconBg: "bg-blue-500/10" },
    Trophy: { color: "text-amber-400", iconBg: "bg-amber-500/10" },
    Crown: { color: "text-indigo-400", iconBg: "bg-indigo-500/10" },
    Users: { color: "text-cyan-400", iconBg: "bg-cyan-500/10" },
    Star: { color: "text-yellow-400", iconBg: "bg-yellow-500/10" },
  };

  const allMetrics: MetricCard[] = [
    ...metrics.map((m, i) => ({
      id: m.id,
      label: m.label,
      value: m.value,
      suffix: m.suffix || undefined,
      icon: ICON_MAP[m.icon || ""] || ComputerIcon,
      color: COLOR_MAP[m.icon || ""]?.color || "text-slate-300",
      iconBg: COLOR_MAP[m.icon || ""]?.iconBg || "bg-white/5",
      bento: BENTO_LAYOUT[i % BENTO_LAYOUT.length],
      featured: m.featured,
    })),
    ...(githubStars !== null
      ? [
          {
            id: "github-stars",
            label: "GitHub Stars",
            value: githubStars,
            icon: Star,
            color: "text-yellow-400",
            iconBg: "bg-yellow-500/10",
            bento: BENTO_LAYOUT[Math.min(metrics.length, BENTO_LAYOUT.length - 1)],
          },
        ]
      : []),
  ];

  return (
    <ScrollRevealSection id="impact" className="py-24 px-6 max-w-6xl mx-auto relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Impact at a Glance</h2>
          <p className="text-slate-400">Quantifying years of software development, leadership, and competition results.</p>
        </ScrollReveal>

        <ScrollRevealStagger className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-3 md:gap-4">
          {loading ? (
            <>
              <BentoSkeleton featured />
              {Array.from({ length: 4 }).map((_, i) => (
                <BentoSkeleton key={i} />
              ))}
            </>
          ) : (
            allMetrics.map((metric) => <MetricBentoCard key={metric.id} metric={metric} />)
          )}
        </ScrollRevealStagger>
      </div>
    </ScrollRevealSection>
  );
}
