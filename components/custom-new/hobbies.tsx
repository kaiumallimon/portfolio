"use client";

import { motion } from "framer-motion";
import { MdSportsSoccer, MdVideogameAsset, MdMovie } from "react-icons/md";
import type { Hobby } from "@/types/content";
import { springs, use3DTilt } from "@/lib/motion";

const ICON_MAP: Record<string, typeof MdSportsSoccer> = {
  MdSportsSoccer,
  MdVideogameAsset,
  MdMovie,
};

function HobbyCardItem({ hobby }: { hobby: Hobby }) {
  const Icon = ICON_MAP[hobby.icon || ""] || MdSportsSoccer;
  const tilt = use3DTilt({ maxTilt: 8, scale: 1.02 });

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={tilt.handleMouseLeave}
      className="perspective-1000 h-full"
    >
      <motion.div
        style={tilt.style}
        className="flex flex-col items-center text-center p-7 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-indigo-500/30 transition-colors duration-300 shadow-xl shadow-black/30 h-full cursor-target group"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
          <Icon className="text-indigo-400 w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-indigo-300 transition-colors">
          {hobby.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">{hobby.description}</p>
      </motion.div>
    </div>
  );
}

export default function HobbiesSection({ hobbies }: { hobbies: Hobby[] }) {
  if (hobbies.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={springs.gentle}
      className="py-24 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 text-center max-w-xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
            Life Outside Work
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Hobbies & Interests
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            What keeps me inspired, curious, and energized outside the code editor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hobbies.map((hobby) => (
            <HobbyCardItem key={hobby.id} hobby={hobby} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
