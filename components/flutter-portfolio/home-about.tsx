'use client';

import { Book, GraduationCap, Award } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";

const education = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "United International University",
    period: "2022 — Present",
    description: "Specializing in mobile development, software architecture, and cross-platform engineering.",
    icon: GraduationCap,
    status: "current"
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Safiuddin Sarkar Academy & College",
    period: "2018 — 2020",
    description: "GPA: 5.00 — (Science Group)",
    icon: Award,
    status: "completed"
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institution: "Daudpur Putina High School",
    period: "2013 — 2018",
    description: "GPA: 5.00 — (Science Group)",
    icon: Book,
    status: "completed"
  },
];

export default function FlutterHomeAboutSection() {
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
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Crafting mobile experiences in Flutter.</h2>
          <div className="text-sm md:text-base space-y-4 text-slate-400 leading-relaxed">
            <p>
              I am a B.Sc. Computer Science & Engineering student at <strong className="text-slate-200 font-medium">United International University</strong> (2022–Present) with a deep passion for mobile development. While academics build the foundation, my expertise grows with every Flutter widget I ship.
            </p>
            <p>
              Over the past 3 years, I&apos;ve evolved into a dedicated <strong className="text-slate-200 font-medium">Flutter Developer</strong> — building polished cross-platform apps with <strong className="text-slate-200 font-medium">BLoC</strong>, <strong className="text-slate-200 font-medium">Provider</strong>, and clean architecture. From custom animations and responsive layouts to Firebase integration and REST API consumption, I focus on delivering smooth 60fps experiences that feel native on both iOS and Android.
            </p>
            <p>
              My goal is to keep pushing the boundaries of what Flutter can do — building scalable mobile products, refining UI/UX craft, and solving real-world problems one release at a time.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <a href="https://github.com/kaiumallimon" target="_blank" className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
              <FaGithub size={20} className="text-slate-300" />
            </a>
            <a href="https://linkedin.com/in/kaiumallimon" target="_blank" className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
              <FaLinkedin size={20} className="text-slate-300" />
            </a>
            <a href="mailto:kalimon291@gmail.com" className="cursor-target p-3 border rounded-full hover:bg-white/10 hover:scale-110 transition-all">
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

            {education.map((edu, index) => {
              const IconComponent = edu.icon;
              const isCurrent = edu.status === "current";

              return (
                <div key={index} className="relative pl-16 py-6">
                  <div className={`absolute left-0 top-7 w-7 h-7 rounded-full ring-4 ring-slate-900/90 flex items-center justify-center transition-all ${isCurrent
                    ? 'bg-indigo-500'
                    : 'bg-slate-500'
                    }`}>
                    <IconComponent size={14} className="text-white" />
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-white font-semibold text-sm">{edu.degree}</h4>
                      {isCurrent && <span className="text-xs px-2 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-full">Current</span>}
                    </div>
                    <p className={`text-xs font-medium ${isCurrent ? 'text-indigo-300' : 'text-slate-400'}`}>{edu.institution}</p>
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
