"use client";

import { GraduationCap, Award, Book, Zap, Cpu, Server, ShieldCheck, MapPin, Globe, Sparkles, Mail, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import type { Education, SiteSettings } from "@/types/content";
import { springs, use3DTilt, useMagnetic } from "@/lib/motion";
import { ScrollRevealSection, GSAPSectionHeader } from "@/components/shared/scroll-reveal";

const ICONS: Record<string, typeof GraduationCap> = {
  GraduationCap,
  Award,
  Book,
};

const CORE_PILLARS = [
  {
    icon: Zap,
    title: "Fluid Motion & 120 FPS",
    desc: "Buttery-smooth gestures & physics-driven micro-animations.",
    color: "text-amber-400",
    border: "hover:border-amber-500/40",
    bg: "bg-amber-500/10",
  },
  {
    icon: Cpu,
    title: "Clean Architecture",
    desc: "Decoupled domain models, Bloc / Provider state flow, and testable code.",
    color: "text-cyan-400",
    border: "hover:border-cyan-500/40",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Server,
    title: "Scalable Backends",
    desc: "High-throughput APIs with FastAPI, Node.js + Express, and PostgreSQL.",
    color: "text-indigo-400",
    border: "hover:border-indigo-500/40",
    bg: "bg-indigo-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Full-Stack Reliability",
    desc: "Robust Supabase / Firebase integrations, CI/CD, and Dockerized deploys.",
    color: "text-emerald-400",
    border: "hover:border-emerald-500/40",
    bg: "bg-emerald-500/10",
  },
];

function MagneticSocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
}) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(0.35);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.a
        style={{ x, y }}
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.92 }}
        transition={springs.snappy}
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        aria-label={label}
        className="cursor-target flex items-center justify-center w-10 h-10 md:w-11 md:h-11 border border-white/10 rounded-full bg-slate-900/60 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all shadow-md backdrop-blur-xl group"
      >
        <Icon size={18} className="group-hover:scale-110 transition-transform" />
      </motion.a>
    </div>
  );
}

export default function HomeAboutSection({
  education,
  settings,
}: {
  education: Education[];
  settings: SiteSettings | null;
  resumeUrl?: string | null;
}) {
  const bioParagraphs = (settings?.about_bio || "").split("\n\n").filter(Boolean);
  const github = settings?.github_url || "https://github.com/kaiumallimon";
  const linkedin = settings?.linkedin_url || "https://linkedin.com/in/kaiumallimon";
  const email = settings?.email || "kalimon291@gmail.com";
  const facebook = settings?.facebook_url || "https://facebook.com/kaiumallimon";
  const location = settings?.location || "Dhaka, Bangladesh";
  const available = settings?.available_status ?? true;

  const bioTilt = use3DTilt({ maxTilt: 4, scale: 1.005 });
  const eduTilt = use3DTilt({ maxTilt: 5, scale: 1.01 });
  const locTilt = use3DTilt({ maxTilt: 5, scale: 1.01 });

  return (
    <ScrollRevealSection
      id="about"
      className="py-24 px-6 max-w-6xl mx-auto relative z-10"
    >
      {/* Section Header with Sequential GSAP Kinetic Entrance */}
      <GSAPSectionHeader
        eyebrow="About Me"
        title="Engineering beyond the framework."
        subtitle="Bridging thoughtful mobile design with scalable backend systems."
        className="mb-12 md:mb-16"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (7 cols): Editorial Narrative & Core Engineering Pillars */}
        <div
          data-gsap-card
          ref={bioTilt.ref}
          onMouseMove={bioTilt.handleMouseMove}
          onMouseLeave={bioTilt.handleMouseLeave}
          className="lg:col-span-7 flex flex-col justify-between perspective-1000"
        >
          <motion.div
            style={bioTilt.style}
            className="h-full border border-white/10 bg-slate-900/40 backdrop-blur-xl p-7 md:p-9 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/40 group hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            {/* Ambient Corner Glow & Specular Line */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Narrative Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                <Sparkles size={14} />
                <span>The Story & Philosophy</span>
              </div>

              {/* Bio Narrative Text */}
              <div className="text-sm md:text-[0.95rem] space-y-4 text-slate-300/90 leading-relaxed font-normal">
                {bioParagraphs.length > 0 ? (
                  bioParagraphs.map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  <>
                    <p>
                      I am a Software Engineer focused on crafting high-performance, cross-platform mobile applications and modern full-stack systems. My work centers on clean architecture, fluid 60–120 FPS interaction models, and resilient backend pipelines.
                    </p>
                    <p>
                      Whether optimizing complex rendering trees in Flutter or architecting scalable asynchronous microservices with FastAPI and Node.js, I build software that delivers measurable speed and exceptional user delight.
                    </p>
                  </>
                )}
              </div>

              {/* 4 Core Pillars Grid */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Core Engineering Strengths
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CORE_PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <motion.div
                        key={pillar.title}
                        whileHover={{ y: -2 }}
                        transition={springs.snappy}
                        className={`p-3.5 rounded-2xl border border-white/8 bg-slate-950/40 backdrop-blur-md transition-all ${pillar.border}`}
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className={`p-1.5 rounded-xl ${pillar.bg} ${pillar.color}`}>
                            <Icon size={15} />
                          </span>
                          <span className="text-xs font-bold text-white tracking-tight">
                            {pillar.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {pillar.desc}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Social & Connect Strip */}
            <div className="pt-8 mt-6 border-t border-white/8 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div>
                <p className="text-xs font-medium text-white tracking-tight">Let's build something exceptional</p>
                <p className="text-[11px] text-slate-400">Open for opportunities & collaborations</p>
              </div>

              <div className="flex items-center gap-2.5">
                <MagneticSocialLink href={github} icon={FaGithub} label="GitHub" />
                <MagneticSocialLink href={linkedin} icon={FaLinkedin} label="LinkedIn" />
                <MagneticSocialLink href={`mailto:${email}`} icon={MdEmail} label="Email" />
                <MagneticSocialLink href={facebook} icon={FaFacebook} label="Facebook" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column (5 cols): Academic Pedigree & Location Telemetry */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          
          {/* Education Glass Card */}
          <div
            data-gsap-card
            ref={eduTilt.ref}
            onMouseMove={eduTilt.handleMouseMove}
            onMouseLeave={eduTilt.handleMouseLeave}
            className="perspective-1000 flex-1"
          >
            <motion.div
              style={eduTilt.style}
              className="h-full border border-white/10 bg-slate-900/40 backdrop-blur-xl p-7 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/40 group hover:border-indigo-500/30 transition-all flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <GraduationCap className="text-indigo-400" size={20} />
                    <span>Education & Pedigree</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Academic Foundation & Continuous Learning</p>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 relative z-10 my-auto">
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-500/40 to-transparent" />

                {education.map((edu) => {
                  const IconComponent = ICONS[edu.status === "current" ? "GraduationCap" : "Award"] || GraduationCap;
                  const isCurrent = edu.status === "current";

                  return (
                    <div key={edu.id} className="relative pl-11 py-1 group/item">
                      <div
                        className={`absolute left-0 top-3.5 w-7 h-7 rounded-full ring-4 ring-slate-950 flex items-center justify-center transition-all ${
                          isCurrent
                            ? "bg-indigo-500 shadow-md shadow-indigo-500/50"
                            : "bg-slate-800 border border-slate-700"
                        }`}
                      >
                        <IconComponent size={13} className="text-white" />
                      </div>

                      <div className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:bg-white/8 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-white font-semibold text-sm leading-snug">{edu.degree}</h4>
                          {isCurrent && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 rounded-full shrink-0">
                              Current
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-medium ${isCurrent ? "text-indigo-300" : "text-slate-400"}`}>
                          {edu.institution}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{edu.period}</p>
                        {edu.description && (
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Location & Status Telemetry Card */}
          <div
            data-gsap-card
            ref={locTilt.ref}
            onMouseMove={locTilt.handleMouseMove}
            onMouseLeave={locTilt.handleMouseLeave}
            className="perspective-1000"
          >
            <motion.div
              style={locTilt.style}
              className="border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 md:p-6 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/40 group hover:border-indigo-500/30 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white tracking-tight">{location}</p>
                    <span className="text-xs text-slate-500 font-mono">UTC+6</span>
                  </div>
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{available ? "Available for Projects & Full-Time" : "Currently Engaged"}</span>
                  </p>
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={springs.snappy}
                href="#contact"
                className="px-4 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 hover:bg-indigo-500/25 text-indigo-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Get in Touch</span>
                <ArrowUpRight size={14} />
              </motion.a>
            </motion.div>
          </div>

        </div>

      </div>
    </ScrollRevealSection>
  );
}
