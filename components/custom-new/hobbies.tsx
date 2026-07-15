"use client";

import { motion } from "framer-motion";
import { MdSportsSoccer, MdVideogameAsset, MdMovie } from "react-icons/md";
import type { Hobby } from "@/types/content";

const ICON_MAP: Record<string, typeof MdSportsSoccer> = {
  MdSportsSoccer,
  MdVideogameAsset,
  MdMovie,
};

export default function HobbiesSection({ hobbies }: { hobbies: Hobby[] }) {
  if (hobbies.length === 0) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Hobbies & Interests</h2>
          <p className="text-slate-400">A little about what keeps me balanced outside of code.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {hobbies.map((hobby) => {
            const Icon = ICON_MAP[hobby.icon || ""] || MdSportsSoccer;
            return (
              <div
                key={hobby.id}
                className="flex flex-col items-center text-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">{hobby.title}</h3>
                <p className="text-slate-400 text-sm md:text-base">{hobby.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
