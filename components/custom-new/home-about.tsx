"use client";

import { GraduationCap, Award } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Book } from "lucide-react";
import { motion } from "framer-motion";
import type { Education, SiteSettings } from "@/types/content";

const ICONS: Record<string, typeof GraduationCap> = {
  GraduationCap,
  Award,
  Book,
};

export default function HomeAboutSection({
  education,
  settings,
}: {
  education: Education[];
  settings: SiteSettings | null;
}) {
  const bioParagraphs = (settings?.about_bio || "").split("\n\n").filter(Boolean);
  const github = settings?.github_url || "https://github.com/kaiumallimon";
  const linkedin = settings?.linkedin_url || "https://linkedin.com/in/kaiumallimon";
  const email = settings?.email || "kalimon291@gmail.com";

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="py-24 px-6 relative"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Engineering beyond the framework.</h2>
          <div className="text-sm md:text-base space-y-4 text-slate-400 leading-relaxed">
            {bioParagraphs.length > 0 ? (
              bioParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))
            ) : (
              <p>
                I am a Software Engineer focused on building clean, scalable software across mobile and web.
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <a href={github} target="_blank" rel="noopener noreferrer" className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
              <FaGithub size={20} className="text-slate-300" />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
              <FaLinkedin size={20} className="text-slate-300" />
            </a>
            <a href={`mailto:${email}`} className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
              <MdEmail size={20} className="text-slate-300" />
            </a>
          </div>
        </div>

        <div className="border border-muted/75 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl transition-all"></div>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white">Education</h3>
              <p className="text-sm text-slate-500 mt-1">Academic Foundation</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Book size={16} className="text-indigo-400" />
            </div>
          </div>

          <div className="space-y-0 relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-linear-to-b from-indigo-500 via-indigo-500/50 to-slate-500/50"></div>

            {education.map((edu) => {
              const IconComponent = ICONS[edu.status === "current" ? "GraduationCap" : "Award"] || GraduationCap;
              const isCurrent = edu.status === "current";

              return (
                <div key={edu.id} className="relative pl-16 py-6">
                  <div className={`absolute left-0 top-7 w-7 h-7 rounded-full ring-4 ring-slate-900/90 flex items-center justify-center transition-all ${isCurrent ? "bg-indigo-500" : "bg-slate-500"}`}>
                    <IconComponent size={14} className="text-white" />
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-white font-semibold text-sm">{edu.degree}</h4>
                      {isCurrent && <span className="text-xs px-2 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-full">Current</span>}
                    </div>
                    <p className={`text-xs font-medium ${isCurrent ? "text-indigo-300" : "text-slate-400"}`}>{edu.institution}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{edu.period}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{edu.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
