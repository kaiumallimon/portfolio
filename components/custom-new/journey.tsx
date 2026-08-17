"use client";

import {
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
  GSAPSectionHeader,
} from "@/components/shared/scroll-reveal";
import type { Activity } from "@/types/content";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion";

export default function FlutterJourneySection({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <ScrollRevealSection id="activities" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="max-w-6xl mx-auto">
        <GSAPSectionHeader
          eyebrow="Leadership & Community"
          title="Co-Curricular & Engineering Leadership"
          subtitle="Leading software development initiatives and student engagement beyond the classroom."
        />

        <div className="relative">
          <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-500/30 to-transparent" />

          <ScrollRevealStagger delay={0.2} className="space-y-6">
            {activities.map((milestone) => (
              <ScrollRevealStaggerItem key={milestone.id}>
                <div className="relative pl-12 group">
                  <div
                    className={`absolute left-0 top-3 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      milestone.active
                        ? "bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/50"
                        : "bg-slate-900 border-slate-700 group-hover:border-indigo-500/50"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        milestone.active ? "bg-white animate-ping" : "bg-slate-500"
                      }`}
                    />
                  </div>

                  <motion.div
                    whileHover={{ x: 4, scale: 1.01 }}
                    transition={springs.snappy}
                    className="cursor-target border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:border-indigo-500/30 transition-all duration-300 bg-slate-900/40 shadow-xl shadow-black/30"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                          {milestone.title}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full w-fit border ${
                            milestone.active
                              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                              : "bg-white/5 text-slate-400 border-white/10"
                          }`}
                        >
                          {milestone.period}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{milestone.organization}</p>
                    </div>
                  </motion.div>
                </div>
              </ScrollRevealStaggerItem>
            ))}
          </ScrollRevealStagger>
        </div>
      </div>
    </ScrollRevealSection>
  );
}
