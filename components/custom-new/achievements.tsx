"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Calendar, Users, Code, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Achievement } from "@/types/content";

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
    <motion.section
      id="achievements"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 max-w-6xl mx-auto relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Achievements</h2>
          <p className="text-slate-400">Recognition and awards from project showcases.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => {
            const isChampion = achievement.award_rank === "champion";
            const badgeColor = isChampion
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
              : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
            const badgeLabel = achievement.award.split("–")[0].trim();

            return (
              <div
                key={achievement.id}
                className="group cursor-target border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500"
              >
                <div className="bg-slate-900/50 p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Trophy className={`w-4 h-4 ${isChampion ? "text-amber-400" : "text-indigo-400"}`} />
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeColor}`}>
                        {badgeLabel}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{achievement.title}</h3>
                    <p className="text-sm text-slate-400">{achievement.award.split("–")[1]?.trim()}</p>
                  </div>

                  {achievement.image && (
                    <div
                      className="relative rounded-xl overflow-hidden bg-slate-800/50 h-48 cursor-pointer"
                      onClick={() => setFullscreenImage(achievement.image)}
                    >
                      <Image
                        src={achievement.image}
                        alt={achievement.project || achievement.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-6 pt-2 text-sm text-slate-400">
                    {achievement.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{achievement.date}</span>
                      </div>
                    )}
                    {achievement.project && (
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        <span>{achievement.project}</span>
                      </div>
                    )}
                    {achievement.team && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{achievement.team}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-99999 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-default"
          style={{ cursor: "default" }}
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer z-10"
            style={{ cursor: "pointer" }}
            onClick={() => setFullscreenImage(null)}
          >
            <X size={32} />
          </button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            <Image
              src={fullscreenImage}
              alt="Achievement"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="absolute bottom-15 left-1/2 -translate-x-1/2 text-white/60 text-sm flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm z-10">
            <span className="text-white/80 font-mono text-xs px-2 py-1 bg-white/10 rounded">ESC</span>
            <span>or click outside to close</span>
          </div>
        </div>
      )}
    </motion.section>
  );
}
