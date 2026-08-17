"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Download, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SiFlutter, SiNextdotjs, SiTypescript, SiDart, SiPostgresql, SiDocker } from "react-icons/si";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GradientWaves from "@/components/reactbits/GradientWaves";
import type { SiteSettings } from "@/types/content";
import { springs, useMagnetic } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TECH_PILLS = [
  { name: "Flutter", icon: SiFlutter, color: "text-cyan-400", border: "hover:border-cyan-500/50" },
  { name: "Dart", icon: SiDart, color: "text-blue-400", border: "hover:border-blue-500/50" },
  { name: "TypeScript", icon: SiTypescript, color: "text-sky-400", border: "hover:border-sky-500/50" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white", border: "hover:border-white/50" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-indigo-400", border: "hover:border-indigo-500/50" },
  { name: "Docker", icon: SiDocker, color: "text-blue-400", border: "hover:border-blue-500/50" },
];

export default function HomeHero({
  settings,
  resumeUrl,
}: {
  settings: SiteSettings | null;
  resumeUrl: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const techPillsRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
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
    "Flutter Specialist & Full-Stack Software Engineer crafting high-performance mobile apps, web platforms, and scalable backends.";
  const available = settings?.available_status ?? true;

  // GSAP Kinetic Entrance Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Avatar Pop
      if (avatarRef.current) {
        tl.fromTo(
          avatarRef.current,
          { scale: 0.65, opacity: 0, y: 18 },
          { scale: 1, opacity: 1, y: 0, duration: 0.95, ease: "back.out(1.6)" }
        );
      }

      // 2. Status Capsule
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: -14, opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" },
          "-=0.65"
        );
      }

      // 3. Kinetic Word-by-Word Title Reveal
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
          "-=0.55"
        );
      }

      // 4. Subheadline
      if (subheadlineRef.current) {
        tl.fromTo(
          subheadlineRef.current,
          { y: 16, opacity: 0, filter: "blur(4px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out" },
          "-=0.5"
        );
      }

      // 5. CTA Buttons
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { y: 18, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.75, ease: "back.out(1.5)" },
          "-=0.45"
        );
      }

      // 6. Telemetry Dock
      if (telemetryRef.current) {
        tl.fromTo(
          telemetryRef.current,
          { y: 20, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        );
      }

      // 7. Tech Pills
      if (techPillsRef.current) {
        tl.fromTo(
          techPillsRef.current.children,
          { y: 16, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.04, duration: 0.65, ease: "back.out(1.4)" },
          "-=0.35"
        );
      }

      // 8. Parallax scrub on scroll
      if (contentRef.current && containerRef.current) {
        gsap.to(contentRef.current, {
          y: 70,
          opacity: 0.2,
          scale: 0.98,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden h-screen max-h-screen min-h-[660px] flex items-center justify-center bg-[#070712]"
    >
      {/* ReactBits GradientWaves WebGL Raymarched Background - Vivid & High Visibility */}
      <GradientWaves
        horizonColor="#312e81"
        waveColor="#6366f1"
        crestColor="#38bdf8"
        speed={0.35}
        amplitude={2.6}
        waveScale={0.6}
        waveRatio={0.9}
        swell={32}
        turbulence={18}
        tilt={1.12}
        height={5.0}
        fogDepth={18}
        brightness={1.25}
        opacity={0.85}
        mouseInteraction={true}
        parallaxStrength={0.45}
        grain={true}
        grainIntensity={0.03}
        className="opacity-100"
      />

      {/* Ambient Vignette for text contrast */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#070712]/40 to-[#070712]/90 pointer-events-none" />

      {/* Subtle Matrix Lines */}
      <div
        className={cn(
          "absolute inset-0 z-[1]",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]",
          "opacity-30 pointer-events-none"
        )}
      />

      {/* Top Specular Horizon Beam */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      {/* Foreground Hero Content Centered & Scaled for 100% Screen Fit */}
      <main
        ref={contentRef}
        className="relative z-10 pt-20 md:pt-24 pb-6 px-6 max-w-5xl mx-auto w-full flex flex-col items-center justify-center h-full will-change-transform"
      >
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-5 w-full my-auto">
          
          {/* Avatar & Status Header (Vertically Stacked) */}
          <div className="flex flex-col items-center gap-2.5">
            {/* 3D Holographic Avatar */}
            <div
              ref={avatarRef}
              className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 shadow-2xl shadow-indigo-500/30 cursor-pointer shrink-0"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={springs.snappy}
                className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900"
              >
                <Image
                  src={profileImage}
                  alt="Kaium Al Limon"
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>
              <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950" />
              </span>
            </div>

            {/* Status Capsule */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-medium tracking-wide backdrop-blur-xl shadow-xl hover:border-indigo-500/50 transition-colors"
            >
              <span className="text-white font-semibold">Kaium Al Limon</span>
              <span className="text-white/20">|</span>
              <span className="text-indigo-400 flex items-center gap-1">
                <Sparkles size={13} />
                {available ? "Available for Projects" : "Busy"}
              </span>
            </div>
          </div>

          {/* Kinetic Headline with Masked Word Reveals */}
          <h1
            ref={headlineRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-white max-w-4xl leading-[1.1] perspective-1000"
          >
            {settings?.hero_headline ? (
              <span className="inline-block overflow-hidden">
                <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400">
                  {settings.hero_headline}
                </span>
              </span>
            ) : (
              <>
                <span className="inline-block overflow-hidden mr-2 md:mr-2.5">
                  <span className="gsap-word inline-block">Crafting</span>
                </span>
                <span className="inline-block overflow-hidden mr-2 md:mr-2.5">
                  <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300">
                    scalable,
                  </span>
                </span>
                <span className="inline-block overflow-hidden mr-2 md:mr-2.5">
                  <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300">
                    high-performance
                  </span>
                </span>
                <br className="hidden sm:block" />
                <span className="inline-block overflow-hidden mr-2 md:mr-2.5">
                  <span className="gsap-word inline-block">apps</span>
                </span>
                <span className="inline-block overflow-hidden mr-2 md:mr-2.5">
                  <span className="gsap-word inline-block">across</span>
                </span>
                <span className="inline-block overflow-hidden">
                  <span className="gsap-word inline-block bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white px-3.5 py-0.5 rounded-xl -skew-x-3 shadow-xl shadow-indigo-500/35 border border-indigo-400/40">
                    platforms
                  </span>
                </span>
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-xs sm:text-sm md:text-[0.95rem] text-slate-200/90 max-w-xl leading-relaxed font-normal"
          >
            {subheadline}
          </p>

          {/* Magnetic CTA Action Buttons */}
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
                className="px-6 sm:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 group cursor-target transition-all text-xs sm:text-sm"
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
                className="px-6 sm:px-7 py-2.5 sm:py-3 border border-white/15 bg-slate-950/60 hover:bg-slate-900/80 text-white rounded-full font-medium backdrop-blur-xl flex items-center justify-center gap-2 group cursor-target transition-all shadow-md text-xs sm:text-sm"
              >
                <span>Explore Selected Work</span>
                <ArrowDown size={16} className="transform group-hover:translate-y-0.5 transition-transform" />
              </motion.a>
            </div>
          </div>

          {/* 3-Panel Telemetry Dock */}
          <div
            ref={telemetryRef}
            className="w-full max-w-2xl border border-white/12 bg-slate-950/60 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/30"
          >
            <div className="grid grid-cols-3 gap-2 divide-x divide-white/10 text-center">
              <div className="px-2">
                <p className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Flutter & Dart
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Mobile Specialist</p>
              </div>

              <div className="px-2">
                <p className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Next.js & TS
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Full-Stack Architect</p>
              </div>

              <div className="px-2">
                <p className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  60–120 FPS
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Physics Animations</p>
              </div>
            </div>
          </div>

          {/* Interactive Stack Badges */}
          <div
            ref={techPillsRef}
            className="flex flex-wrap items-center justify-center gap-2 pt-1 max-w-xl"
          >
            {TECH_PILLS.map((skill) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  whileHover={{ scale: 1.08, y: -2 }}
                  transition={springs.snappy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-950/50 backdrop-blur-md cursor-pointer transition-all ${skill.border}`}
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
