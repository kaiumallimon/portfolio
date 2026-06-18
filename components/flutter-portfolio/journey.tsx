'use client';

import { motion } from 'framer-motion';

export default function FlutterJourneySection() {
  const milestones = [
    {
      title: "Head of Software & Innovation",
      organization: "UIU App Forum",
      period: "Sep 2024 – Oct 2025",
      active: true,
    },
    {
      title: "Junior Executive of Development",
      organization: "UIU App Forum",
      period: "Aug 2023 – Sep 2024",
      active: false,
    },
    {
      title: "Mentor — Grooming for CSE Project Show",
      organization: "UIU App Forum",
      period: "Aug 2023",
      active: false,
    },
    {
      title: "General Member",
      organization: "UIU App Forum",
      period: "Mar 2022 – Aug 2023",
      active: false,
    },
  ];

  return (
    <motion.section
      id="activities"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Co-Curricular Activities</h2>
          <p className="text-slate-400">Leading mobile development beyond the classroom.</p>
        </div>

        <div className="relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-linear-to-b from-indigo-500/50 via-indigo-500/20 to-transparent"></div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-12 group">
                <div className={`absolute left-0 top-2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  milestone.active
                    ? 'bg-indigo-500 border-indigo-400 shadow-lg shadow-indigo-500/50'
                    : 'bg-slate-900 border-slate-700 group-hover:border-indigo-500/50'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${milestone.active ? 'bg-white' : 'bg-slate-600'}`}></div>
                </div>

                <div className="cursor-target border border-white/10 backdrop-blur-md rounded-xl p-6 hover:border-white/20 transition-all duration-300 bg-slate-900/30">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${
                        milestone.active
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                      }`}>
                        {milestone.period}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{milestone.organization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
