"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Trophy, Calendar, Users, Code, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Achievement } from "@/types/content";
import { springs, use3DTilt } from "@/lib/motion";
import { ScrollRevealSection, GSAPSectionHeader } from "@/components/shared/scroll-reveal";

function AchievementCardItem({ achievement, onSelectImage }: { achievement: Achievement; onSelectImage: (img: string) => void }) {
  const isChampion = achievement.award_rank === "champion";
  const tilt = use3DTilt({ maxTilt: 5, scale: 1.01 });

  const badgeColor = isChampion
    ? "bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/20"
    : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-sm shadow-indigo-500/20";
  const badgeLabel = achievement.award.split("–")[0].trim();

  return (
    <div
      data-gsap-card
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="perspective-1000 h-full"
    >
      <motion.div
        style={tilt.style}
        className="group cursor-target border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden hover:border-indigo-500/40 transition-colors duration-300 h-full bg-slate-900/40 shadow-xl shadow-black/30"
      >
        <div className="p-6 md:p-7 space-y-4 flex flex-col h-full">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/5">
                <Trophy className={`w-4 h-4 ${isChampion ? "text-amber-400" : "text-indigo-400"}`} />
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeColor}`}>
                {badgeLabel}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
              {achievement.title}
            </h3>
            <p className="text-sm text-slate-400">
              {achievement.award.split("–")[1]?.trim() || achievement.award}
            </p>
          </div>

          {achievement.image && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={springs.snappy}
              className="relative rounded-2xl overflow-hidden bg-slate-800/60 h-48 cursor-pointer border border-white/8 group/img"
              onClick={() => onSelectImage(achievement.image!)}
            >
              <Image
                src={achievement.image}
                alt={achievement.project || achievement.title}
                fill
                className="object-cover transition-transform duration-500 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-[11px] text-white/90 font-medium bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
                  Click to view certificate
                </span>
              </div>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400 mt-auto">
            {achievement.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{achievement.date}</span>
              </div>
            )}
            {achievement.project && (
              <div className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-500" />
                <span>{achievement.project}</span>
              </div>
            )}
            {achievement.team && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{achievement.team}</span>
              </div>
            )}
          </div>
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreenImage) {
        setFullscreenImage(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [fullscreenImage]);

  return (
    <ScrollRevealSection
      id="achievements"
      className="py-24 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <GSAPSectionHeader
          eyebrow="Recognition & Honors"
          title="Achievements & Competition Honors"
          subtitle="Competition awards and honors earned across software exhibitions, hackathons, and symposiums."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <AchievementCardItem
              key={achievement.id}
              achievement={achievement}
              onSelectImage={setFullscreenImage}
            />
          ))}
        </div>
      </div>

      {/* Spring Animated Lightbox */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-default"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer z-10"
              onClick={() => setFullscreenImage(null)}
              aria-label="Close Lightbox"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={springs.bouncy}
              className="relative w-full h-full max-w-5xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fullscreenImage}
                alt="Achievement Certificate"
                fill
                className="object-contain"
              />
            </motion.div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <span className="text-white/80 font-mono text-[10px] px-2 py-0.5 bg-white/10 rounded">ESC</span>
              <span>or click anywhere outside to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollRevealSection>
  );
}
