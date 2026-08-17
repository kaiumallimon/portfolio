"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Download, Loader2, Sparkles, Terminal, Activity, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SiFlutter, SiNextdotjs, SiTypescript, SiDart, SiPostgresql, SiDocker, SiGo } from "react-icons/si";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteSettings } from "@/types/content";
import { springs, useMagnetic } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INTERACTIVE_SKILLS = [
  { name: "Flutter", icon: SiFlutter, color: "text-cyan-400", border: "hover:border-cyan-500/50", glow: "rgba(6, 182, 212, 0.25)", tag: "Mobile Engine" },
  { name: "Dart", icon: SiDart, color: "text-blue-400", border: "hover:border-blue-500/50", glow: "rgba(59, 130, 246, 0.25)", tag: "Language" },
  { name: "TypeScript", icon: SiTypescript, color: "text-sky-400", border: "hover:border-sky-500/50", glow: "rgba(56, 189, 248, 0.25)", tag: "Core Stack" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white", border: "hover:border-white/50", glow: "rgba(255, 255, 255, 0.2)", tag: "Full-Stack" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-indigo-400", border: "hover:border-indigo-500/50", glow: "rgba(99, 102, 241, 0.25)", tag: "Database" },
  { name: "Docker", icon: SiDocker, color: "text-blue-400", border: "hover:border-blue-500/50", glow: "rgba(59, 130, 246, 0.25)", tag: "DevOps" },
];

export default function HomeHero({
  settings,
  resumeUrl,
}: {
  settings: SiteSettings | null;
  resumeUrl: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  // Mouse coordinate tracker for living stage lighting
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const spotlightBg = useTransform(
    [smoothMouseX, smoothMouseY],
    ([x, y]) => `radial-gradient(650px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.04) 40%, transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const downloadMagnetic = useMagnetic(0.25);
  const workMagnetic = useMagnetic(0.25);

  const handleDownload = async () => {
    if (!resumeUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "CV-Kaium-Al-Limon.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const profileImage = settings?.profile_image || "/bordered.png";
  const subheadline =
    settings?.hero_subheadline ||
    "Software Engineer specialized in building production-grade mobile applications and resilient full-stack systems with 60–120 FPS fluid physics.";
  const available = settings?.available_status ?? true;

  // GSAP Kinetic Entrance Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Status Capsule
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: -16, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }
        );
      }

      // 2. Kinetic Word-by-Word Title Reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".gsap-word");
        tl.fromTo(
          words,
          {
            yPercent: 120,
            opacity: 0,
            rotateX: 35,
            transformOrigin: "0% 50% -30",
          },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.035,
            duration: 0.85,
            ease: "power4.out",
          },
          "-=0.5"
        );
      }

      // 3. Subheadline
      if (subheadlineRef.current) {
        tl.fromTo(
          subheadlineRef.current,
          { y: 16, opacity: 0, filter: "blur(4px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out" },
          "-=0.5"
        );
      }

      // 4. CTA Buttons
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { y: 18, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.75, ease: "back.out(1.5)" },
          "-=0.45"
        );
      }

      // 5. Telemetry Live Dock
      if (telemetryRef.current) {
        tl.fromTo(
          telemetryRef.current,
          { y: 20, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.45"
        );
      }

      // 6. Interactive Skill Nodes
      if (skillsRef.current) {
        tl.fromTo(
          skillsRef.current.children,
          { y: 16, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.4"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden h-screen max-h-screen min-h-[660px] flex items-center justify-center"
    >
      {/* Living Interactive Mouse Spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ background: spotlightBg }}
      />

      {/* Geometric Matrix Lines */}
      <div
        className={cn(
          "absolute inset-0 z-[1]",
          "bg-size-[44px_44px]",
          "bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]",
          "opacity-50 pointer-events-none"
        )}
      />

      {/* Top Specular Horizon Beam */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />

      {/* Hero Foreground Stage */}
      <main className="relative z-10 pt-20 md:pt-24 pb-6 px-6 max-w-5xl mx-auto w-full flex flex-col items-center justify-center h-full will-change-transform">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-5 w-full my-auto">
          
          {/* Avatar & Realtime Telemetry Header - Vertically Aligned */}
          <div className="flex flex-col items-center gap-3">
            {/* 3D Holographic Avatar */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              transition={springs.snappy}
              className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 shadow-xl shadow-indigo-500/25 cursor-pointer shrink-0"
            >
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900">
                <Image
                  src={profileImage}
                  alt="Kaium Al Limon"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950" />
              </span>
            </motion.div>

            {/* Status Capsule */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-medium tracking-wide backdrop-blur-xl shadow-sm hover:border-indigo-500/40 transition-colors"
            >
              <span className="text-white font-semibold">Kaium Al Limon</span>
              <span className="text-white/20">|</span>
              <span className="text-indigo-400 flex items-center gap-1">
                <Sparkles size={13} />
                {available ? "Available for Projects" : "Busy"}
              </span>
            </div>
          </div>

          {/* Grand Headline with Split-Word Kinetic Reveal & Glowing Highlight */}
          <h1
            ref={headlineRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white max-w-4xl leading-[1.08] perspective-1000"
          >
            <span className="inline-block overflow-hidden mr-2">
              <span className="gsap-word inline-block">Building</span>
            </span>
            <span className="inline-block overflow-hidden mr-2">
              <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                high-velocity
              </span>
            </span>
            <span className="inline-block overflow-hidden mr-2">
              <span className="gsap-word inline-block text-white">
                software
              </span>
            </span>
            <br className="hidden sm:block" />
            <span className="inline-block overflow-hidden mr-2">
              <span className="gsap-word inline-block">with</span>
            </span>
            <span className="inline-block overflow-hidden mr-2">
              <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400">
                precision & fluidity.
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-xs sm:text-sm md:text-[0.95rem] text-slate-300/90 max-w-2xl leading-relaxed font-normal"
          >
            {subheadline}
          </p>

          {/* Living CTA Action Deck */}
          <div
            ref={ctaRef}
            className="flex flex-row gap-3 pt-1 w-full sm:w-auto items-center justify-center"
          >
            <div
              ref={downloadMagnetic.ref}
              onMouseMove={downloadMagnetic.handleMouseMove}
              onMouseLeave={downloadMagnetic.handleMouseLeave}
              className="inline-block"
            >
              <motion.button
                style={{ x: downloadMagnetic.x, y: downloadMagnetic.y }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={springs.snappy}
                onClick={handleDownload}
                disabled={downloading || !resumeUrl}
                className="px-6 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group cursor-target transition-all text-xs sm:text-sm"
              >
                {downloading ? (
                  <>
                    <span>Downloading...</span>
                    <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Download CV</span>
                    <Download size={16} className="transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>

            <div
              ref={workMagnetic.ref}
              onMouseMove={workMagnetic.handleMouseMove}
              onMouseLeave={workMagnetic.handleMouseLeave}
              className="inline-block"
            >
              <motion.a
                style={{ x: workMagnetic.x, y: workMagnetic.y }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={springs.snappy}
                href="#projects"
                className="px-6 sm:px-7 py-2.5 sm:py-3 border border-white/12 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium backdrop-blur-xl flex items-center justify-center gap-2 group cursor-target transition-all shadow-md text-xs sm:text-sm"
              >
                <span>Explore Selected Work</span>
                <ArrowDown size={16} className="transform group-hover:translate-y-0.5 transition-transform" />
              </motion.a>
            </div>
          </div>

          {/* Living Interactive Telemetry Dock */}
          <div
            ref={telemetryRef}
            className="w-full max-w-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-xl shadow-black/20"
          >
            <div className="grid grid-cols-3 gap-2 divide-x divide-white/8 text-center">
              <div className="px-2">
                <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Flutter & Dart
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Mobile Specialist</p>
              </div>

              <div className="px-2">
                <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Next.js & TS
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Full-Stack Architect</p>
              </div>

              <div className="px-2">
                <p className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  60–120 FPS
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Physics Animations</p>
              </div>
            </div>
          </div>

          {/* Interactive Living Stack Nodes with Hover Tooltips */}
          <div
            ref={skillsRef}
            className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-xl"
          >
            {INTERACTIVE_SKILLS.map((skill) => {
              const Icon = skill.icon;
              const isHovered = activeSkill === skill.name;

              return (
                <motion.div
                  key={skill.name}
                  onMouseEnter={() => setActiveSkill(skill.name)}
                  onMouseLeave={() => setActiveSkill(null)}
                  whileHover={{ scale: 1.08, y: -2 }}
                  transition={springs.snappy}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8 bg-white/4 backdrop-blur-md cursor-pointer transition-all ${skill.border}`}
                  style={{
                    boxShadow: isHovered ? `0 0 16px ${skill.glow}` : undefined,
                  }}
                >
                  <Icon size={14} className={skill.color} />
                  <span className="text-xs font-medium text-slate-300">{skill.name}</span>
                </motion.div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
