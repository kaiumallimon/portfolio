"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Trophy,
  Calendar,
  Users,
  Code,
  X,
  Sparkles,
  ExternalLink,
  Medal,
  Award,
  Maximize2,
  TrendingUp,
  Target,
  Flame,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Achievement } from "@/types/content";
import { springs, use3DTilt } from "@/lib/motion";
import { ScrollRevealSection, GSAPSectionHeader } from "@/components/shared/scroll-reveal";

const RANK_CONFIG: Record<
  string,
  {
    icon: typeof Trophy;
    badge: string;
    border: string;
    glow: string;
    chipBg: string;
    textColor: string;
  }
> = {
  champion: {
    icon: Trophy,
    badge: "Champion",
    border: "border-amber-500/30 hover:border-amber-400/60",
    glow: "bg-amber-500/15",
    chipBg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
    textColor: "text-amber-400",
  },
  "1st-runner-up": {
    icon: Medal,
    badge: "1st Runner-Up",
    border: "border-indigo-500/30 hover:border-indigo-400/60",
    glow: "bg-indigo-500/15",
    chipBg: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300",
    textColor: "text-indigo-400",
  },
  "2nd-runner-up": {
    icon: Award,
    badge: "2nd Runner-Up",
    border: "border-sky-500/30 hover:border-sky-400/60",
    glow: "bg-sky-500/15",
    chipBg: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    textColor: "text-sky-400",
  },
  other: {
    icon: Award,
    badge: "Honorable Mention",
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    glow: "bg-emerald-500/15",
    chipBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    textColor: "text-emerald-400",
  },
};

function getRankMeta(rank: string) {
  return RANK_CONFIG[rank] ?? RANK_CONFIG.other;
}

/**
 * Flagship Champion Hero Bento (Span 8)
 */
function ChampionHeroBento({
  achievement,
  onSelectImage,
}: {
  achievement: Achievement;
  onSelectImage: (img: string) => void;
}) {
  const meta = getRankMeta(achievement.award_rank);
  const Icon = meta.icon;
  const tilt = use3DTilt({ maxTilt: 3, scale: 1.005 });
  const awardParts = achievement.award.split("–");
  const eventName = awardParts[1]?.trim() || achievement.award;

  return (
    <div
      data-gsap-card
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="col-span-1 lg:col-span-8 perspective-1000 flex flex-col"
    >
      <motion.div
        style={tilt.style}
        className={`group relative border ${meta.border} bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden p-6 md:p-8 transition-all duration-300 shadow-2xl shadow-black/40 h-full flex flex-col justify-between`}
      >
        {/* Ambient Amber Glow & Top Specular Line */}
        <div className={`absolute top-0 right-0 w-80 h-80 ${meta.glow} rounded-full blur-3xl pointer-events-none`} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Information (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-bold tracking-wide ${meta.chipBg}`}>
                <Icon size={14} className={meta.textColor} />
                <span>{meta.badge}</span>
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight group-hover:text-amber-200 transition-colors">
                {achievement.title}
              </h3>
              <p className="text-sm md:text-base text-slate-300 font-medium mt-1">
                {eventName}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1 text-xs">
              {achievement.date && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 bg-slate-950/40 text-slate-300 backdrop-blur-md">
                  <Calendar size={13} className="text-slate-400" />
                  <span>{achievement.date}</span>
                </div>
              )}
              {achievement.project && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 bg-slate-950/40 text-slate-300 backdrop-blur-md">
                  <Code size={13} className="text-cyan-400" />
                  <span>Project: {achievement.project}</span>
                </div>
              )}
              {achievement.team && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 bg-slate-950/40 text-slate-300 backdrop-blur-md">
                  <Users size={13} className="text-indigo-400" />
                  <span>{achievement.team}</span>
                </div>
              )}
            </div>
          </div>

          {/* Certificate Preview (5 cols) */}
          {achievement.image && (
            <div className="md:col-span-5">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={springs.snappy}
                className="relative rounded-2xl overflow-hidden bg-slate-950/60 border border-white/10 h-52 md:h-56 cursor-pointer group/cert shadow-xl shadow-black/40"
                onClick={() => onSelectImage(achievement.image!)}
              >
                <Image
                  src={achievement.image}
                  alt={achievement.project || achievement.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/cert:scale-105"
                />
                
                {/* Overlay Hover Trigger */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                  <span className="text-xs text-white font-medium flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                    <Maximize2 size={13} />
                    <span>View</span>
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                    <ExternalLink size={14} />
                  </span>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

/**
 * Honors Telemetry Bento Card (Span 4)
 */
function HonorsTelemetryBento({
  championCount,
  runnerUpCount,
  totalCount,
}: {
  championCount: number;
  runnerUpCount: number;
  totalCount: number;
}) {
  const tilt = use3DTilt({ maxTilt: 4, scale: 1.01 });

  return (
    <div
      data-gsap-card
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="col-span-1 lg:col-span-4 perspective-1000 flex flex-col"
    >
      <motion.div
        style={tilt.style}
        className="border border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden p-6 md:p-7 transition-all duration-300 shadow-2xl shadow-black/40 h-full flex flex-col justify-between relative group hover:border-indigo-500/30"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Trophy size={17} className="text-amber-400" />
                <span>Track Record</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Competitive Engineering Pedigree</p>
            </div>
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles size={16} />
            </span>
          </div>

          {/* 3 Metric Rows */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-2xl border border-white/8 bg-slate-950/40 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-slate-300">Champion Titles</span>
              </div>
              <span className="text-sm font-bold text-amber-300 font-mono">{championCount} Awards</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl border border-white/8 bg-slate-950/40 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Runner-Up Honors</span>
              </div>
              <span className="text-sm font-bold text-indigo-300 font-mono">{runnerUpCount} Accolades</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl border border-white/8 bg-slate-950/40 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">Total Recognitions</span>
              </div>
              <span className="text-sm font-bold text-emerald-300 font-mono">{totalCount} Showcase Honors</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/6 flex items-center gap-2 text-[11px] text-slate-400 relative z-10 mt-4">
          <Target size={13} className="text-cyan-400" />
          <span>Focused on real-world impact & innovation</span>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Landscape Half-Width Bento Card (Span 6)
 */
function LandscapeAchievementBento({
  achievement,
  onSelectImage,
}: {
  achievement: Achievement;
  onSelectImage: (img: string) => void;
}) {
  const meta = getRankMeta(achievement.award_rank);
  const Icon = meta.icon;
  const tilt = use3DTilt({ maxTilt: 4, scale: 1.01 });
  const awardParts = achievement.award.split("–");
  const eventName = awardParts[1]?.trim() || achievement.award;

  return (
    <div
      data-gsap-card
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="col-span-1 lg:col-span-6 perspective-1000 flex flex-col"
    >
      <motion.div
        style={tilt.style}
        className={`group border ${meta.border} bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden p-6 md:p-7 transition-all duration-300 h-full flex flex-col justify-between shadow-xl shadow-black/30 relative`}
      >
        <div className={`absolute top-0 right-0 w-60 h-60 ${meta.glow} rounded-full blur-3xl pointer-events-none`} />

        <div className="space-y-4 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${meta.chipBg}`}>
              <Icon size={13} className={meta.textColor} />
              <span>{meta.badge}</span>
            </span>
            {achievement.date && (
              <span className="text-xs text-slate-500 font-mono">{achievement.date}</span>
            )}
          </div>

          {/* Title & Event */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
              {achievement.title}
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">
              {eventName}
            </p>
          </div>

          {/* Certificate Thumbnail */}
          {achievement.image && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={springs.snappy}
              className="relative rounded-2xl overflow-hidden bg-slate-950/60 border border-white/8 h-48 cursor-pointer group/thumb shadow-md"
              onClick={() => onSelectImage(achievement.image!)}
            >
              <Image
                src={achievement.image}
                alt={achievement.project || achievement.title}
                fill
                className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-end justify-between p-3.5">
                <span className="text-[11px] text-white font-medium flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md">
                  <Maximize2 size={12} />
                  <span>View</span>
                </span>
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                  <ExternalLink size={12} />
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Metadata */}
        <div className="flex flex-wrap gap-2.5 pt-4 border-t border-white/6 text-xs text-slate-400 mt-4 relative z-10">
          {achievement.project && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/4 border border-white/6">
              <Code size={12} className="text-cyan-400" />
              <span>{achievement.project}</span>
            </div>
          )}
          {achievement.team && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/4 border border-white/6">
              <Users size={12} className="text-indigo-400" />
              <span>{achievement.team}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AchievementsSection({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreenImage) {
        setFullscreenImage(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullscreenImage]);

  // Filter achievements based on active tab
  const filteredAchievements =
    activeTab === "all"
      ? achievements
      : activeTab === "runner-up"
      ? achievements.filter((a) => a.award_rank === "1st-runner-up" || a.award_rank === "2nd-runner-up")
      : achievements.filter((a) => a.award_rank === activeTab);

  const championCount = achievements.filter((a) => a.award_rank === "champion").length;
  const runnerUpCount = achievements.filter((a) => a.award_rank === "1st-runner-up" || a.award_rank === "2nd-runner-up").length;

  const topChampion = achievements.find((a) => a.award_rank === "champion") || achievements[0];
  const remainingAchievements = filteredAchievements.filter((a) => a.id !== topChampion?.id);

  return (
    <ScrollRevealSection
      id="achievements"
      className="py-24 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* GSAP Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <GSAPSectionHeader
            eyebrow="Recognition & Honors"
            title="Achievements & Competition Honors"
            subtitle="Verified award accolades earned across project showcases, hackathons, and technical symposiums."
            className="mb-0"
          />

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({achievements.length})
            </button>
            <button
              onClick={() => setActiveTab("champion")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "champion"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30"
                  : "text-slate-400 hover:text-amber-300"
              }`}
            >
              <Trophy size={13} />
              <span>Champions ({championCount})</span>
            </button>
            <button
              onClick={() => setActiveTab("runner-up")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "runner-up"
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
                  : "text-slate-400 hover:text-indigo-300"
              }`}
            >
              <Medal size={13} />
              <span>Runner-Ups ({runnerUpCount})</span>
            </button>
          </div>
        </div>

        {/* Asymmetric Bento Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* In "All" View: Top Row shows 8-col Champion Hero + 4-col Honors Telemetry */}
          {activeTab === "all" && topChampion && (
            <>
              <ChampionHeroBento
                achievement={topChampion}
                onSelectImage={setFullscreenImage}
              />
              <HonorsTelemetryBento
                championCount={championCount}
                runnerUpCount={runnerUpCount}
                totalCount={achievements.length}
              />
            </>
          )}

          {/* Remaining achievements render in 6-column bento blocks */}
          {(activeTab === "all" ? remainingAchievements : filteredAchievements).map((achievement) => (
            <LandscapeAchievementBento
              key={achievement.id}
              achievement={achievement}
              onSelectImage={setFullscreenImage}
            />
          ))}

        </div>

      </div>

      {/* Spring Animated High-Definition Lightbox */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-default"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2.5 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer z-10 border border-white/10"
              onClick={() => setFullscreenImage(null)}
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={springs.bouncy}
              className="relative w-full h-full max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fullscreenImage}
                alt="Achievement Certificate"
                fill
                className="object-contain"
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
              <span className="text-white font-mono text-[10px] px-2 py-0.5 bg-white/15 rounded">ESC</span>
              <span>or click outside to dismiss</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollRevealSection>
  );
}
