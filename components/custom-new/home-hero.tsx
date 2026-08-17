"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { ArrowDown, ArrowUpRight, Download, Loader2, Sparkles, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  SiFlutter,
  SiDart,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiGo,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiSupabase,
  SiFirebase,
  SiDocker,
  SiGit,
  SiGithub,
  SiGraphql,
  SiTailwindcss,
  SiFigma,
  SiCplusplus,
  SiSwift,
  SiKotlin,
} from "react-icons/si";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GradientWaves from "@/components/reactbits/GradientWaves";
import type { SiteSettings, SkillCategory } from "@/types/content";
import { springs, useMagnetic } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TECH_ICONS: Record<string, { icon: ComponentType<{ size?: number; className?: string }>; color: string }> = {
  flutter: { icon: SiFlutter, color: "text-cyan-400" },
  dart: { icon: SiDart, color: "text-blue-400" },
  typescript: { icon: SiTypescript, color: "text-sky-400" },
  javascript: { icon: SiJavascript, color: "text-amber-400" },
  react: { icon: SiReact, color: "text-cyan-400" },
  "next.js": { icon: SiNextdotjs, color: "text-white" },
  "node.js": { icon: SiNodedotjs, color: "text-emerald-400" },
  go: { icon: SiGo, color: "text-cyan-400" },
  python: { icon: SiPython, color: "text-yellow-400" },
  postgresql: { icon: SiPostgresql, color: "text-indigo-400" },
  mongodb: { icon: SiMongodb, color: "text-emerald-400" },
  supabase: { icon: SiSupabase, color: "text-emerald-400" },
  firebase: { icon: SiFirebase, color: "text-amber-400" },
  docker: { icon: SiDocker, color: "text-blue-400" },
  git: { icon: SiGit, color: "text-orange-400" },
  github: { icon: SiGithub, color: "text-white" },
  graphql: { icon: SiGraphql, color: "text-pink-400" },
  "tailwind css": { icon: SiTailwindcss, color: "text-cyan-400" },
  figma: { icon: SiFigma, color: "text-purple-400" },
  "c++": { icon: SiCplusplus, color: "text-blue-400" },
  swift: { icon: SiSwift, color: "text-orange-400" },
  kotlin: { icon: SiKotlin, color: "text-purple-400" },
};

const DEFAULT_SKILLS = [
  "Flutter",
  "Dart",
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "Go",
  "PostgreSQL",
  "Supabase",
  "Firebase",
  "Docker",
  "GraphQL",
  "Git",
  "Tailwind CSS",
  "Python",
];

function getSkillMeta(name: string) {
  const normalized = name.toLowerCase().trim();
  const matched = TECH_ICONS[normalized];
  if (matched) return matched;

  for (const [key, meta] of Object.entries(TECH_ICONS)) {
    if (normalized.includes(key)) {
      return meta;
    }
  }

  return { icon: Code2, color: "text-indigo-400" };
}

/**
 * Site-Consistent Skills Marquee (Aligned with bento chips across portfolio)
 */
function SiteConsistentSkillsMarquee({ skillNames }: { skillNames: string[] }) {
  const list = [...skillNames, ...skillNames, ...skillNames];

  return (
    <div className="w-full max-w-4xl overflow-hidden relative py-1 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{ animationPlayState: "paused" }}
        className="flex items-center gap-2.5 w-max select-none"
      >
        {list.map((skill, idx) => {
          const { icon: Icon, color } = getSkillMeta(skill);

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -1 }}
              transition={springs.snappy}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 text-xs text-slate-300 hover:text-white backdrop-blur-xl transition-all shrink-0 cursor-pointer shadow-md"
            >
              <Icon size={14} className={color} />
              <span className="font-medium tracking-tight">{skill}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function HomeHero({
  settings,
  resumeUrl,
  skills,
}: {
  settings: SiteSettings | null;
  resumeUrl: string | null;
  skills?: SkillCategory[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const downloadMagnetic = useMagnetic(0.25);
  const workMagnetic = useMagnetic(0.25);

  const allSkillNames = skills && skills.length > 0
    ? Array.from(new Set(skills.flatMap((cat) => cat.skills.map((s) => s.name))))
    : DEFAULT_SKILLS;

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
    "Specializing in fluid Flutter mobile applications, modern Next.js web platforms, and resilient, high-speed backends built with FastAPI and Node.js + Express.";
  const available = settings?.available_status ?? true;

  // GSAP Kinetic Entrance Timeline (Sequenced after Preloader & Header complete entrance)
  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const runHeroTimeline = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          delay: 0.65,
          defaults: { ease: "power4.out" },
        });

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

        // 6. Marquee Fade In
        if (marqueeRef.current) {
          tl.fromTo(
            marqueeRef.current,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            "-=0.4"
          );
        }

        // 7. Parallax scrub on scroll
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
    };

    const isPreloaderActive = typeof window !== "undefined" && (window as any).__PRELOADER_ACTIVE__;

    if (isPreloaderActive) {
      window.addEventListener("preloader-exit", runHeroTimeline, { once: true });
      return () => {
        window.removeEventListener("preloader-exit", runHeroTimeline);
        ctx?.revert();
      };
    } else {
      runHeroTimeline();
      return () => ctx?.revert();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden min-h-screen md:h-screen md:max-h-screen md:min-h-[660px] flex items-center justify-center bg-[#070712]"
    >
      {/* ReactBits GradientWaves WebGL Background - Exact Site Primary Brand Palette */}
      <GradientWaves
        horizonColor="#06060c"
        waveColor="#4f46e5"
        crestColor="#818cf8"
        speed={0.32}
        amplitude={2.5}
        waveScale={0.62}
        waveRatio={0.9}
        swell={30}
        turbulence={18}
        tilt={1.12}
        height={5.2}
        fogDepth={18}
        brightness={1.2}
        opacity={0.85}
        mouseInteraction={true}
        parallaxStrength={0.45}
        grain={true}
        grainIntensity={0.03}
        className="opacity-100"
      />

      {/* Ambient Radial Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#070712]/35 to-[#070712]/85 pointer-events-none" />

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
        className="relative z-10 pt-12 sm:pt-14 md:pt-20 pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6 max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-screen md:min-h-0 md:h-full will-change-transform"
      >
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 md:space-y-6 w-full my-auto">
          
          {/* Avatar & Status Header */}
          <div className="flex flex-col items-center gap-3">
            {/* Holographic Avatar with Glowing Indigo Halo Ring */}
            <div
              ref={avatarRef}
              className="relative p-[2.5px] rounded-full bg-gradient-to-b from-indigo-400 via-indigo-600 to-violet-700/40 shadow-[0_0_28px_rgba(99,102,241,0.45)] hover:shadow-[0_0_38px_rgba(99,102,241,0.7)] transition-all duration-500 cursor-pointer shrink-0"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={springs.snappy}
                className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden border border-indigo-400/30 bg-slate-950"
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

            {/* Status Capsule (Consistent with Site Eyebrow Badges) */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium tracking-wide backdrop-blur-xl shadow-lg hover:border-indigo-500/40 transition-colors"
            >
              <span className="text-white font-semibold">Kaium Al Limon</span>
              <span className="text-white/20">|</span>
              <span className="text-indigo-400 flex items-center gap-1">
                <Sparkles size={13} />
                {available ? "Open for Work" : "Busy"}
              </span>
            </div>
          </div>

          {/* Kinetic Headline with Highlight Badge */}
          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto px-2 sm:px-0">
            <h1
              ref={headlineRef}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.3rem] font-bold tracking-tight text-white leading-[1.14] perspective-1000 text-center"
            >
              {settings?.hero_headline ? (
                <span className="inline-block overflow-hidden">
                  <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400">
                    {settings.hero_headline}
                  </span>
                </span>
              ) : (
                <>
                  {/* Mobile View: Multi-line Impactful Stack */}
                  <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:hidden">
                    <span className="inline-block overflow-hidden">
                      <span className="gsap-word inline-block text-white font-bold">Building</span>
                    </span>
                    <span className="inline-block overflow-hidden">
                      <span className="gsap-word inline-block text-white font-bold">high-performance</span>
                    </span>
                    <span className="inline-block overflow-hidden">
                      <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 font-bold">
                        mobile & web
                      </span>
                    </span>
                    <span className="inline-block overflow-hidden">
                      <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 font-bold">
                        experiences
                      </span>
                    </span>
                    <span className="inline-block overflow-hidden">
                      <span className="gsap-word inline-block text-white font-bold">engineered</span>
                    </span>
                    <div className="flex items-center justify-center">
                      <span className="inline-block overflow-hidden mr-1.5">
                        <span className="gsap-word inline-block text-white font-bold">to</span>
                      </span>
                      <span className="inline-block overflow-hidden">
                        <span className="gsap-word inline-block text-white font-bold">
                          scale<span className="text-indigo-400">.</span>
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Desktop View: Symmetrical 3-Line Widescreen */}
                  <div className="hidden md:flex flex-col items-center gap-1.5">
                    {/* Line 1 */}
                    <div className="flex flex-wrap items-center justify-center">
                      <span className="inline-block overflow-hidden mr-2.5">
                        <span className="gsap-word inline-block text-white">Building</span>
                      </span>
                      <span className="inline-block overflow-hidden">
                        <span className="gsap-word inline-block text-white">high-performance</span>
                      </span>
                    </div>

                    {/* Line 2 */}
                    <div className="flex flex-wrap items-center justify-center">
                      <span className="inline-block overflow-hidden">
                        <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300">
                          mobile & web experiences
                        </span>
                      </span>
                    </div>

                    {/* Line 3 */}
                    <div className="flex flex-wrap items-center justify-center">
                      <span className="inline-block overflow-hidden mr-2.5">
                        <span className="gsap-word inline-block text-white">engineered</span>
                      </span>
                      <span className="inline-block overflow-hidden mr-2.5">
                        <span className="gsap-word inline-block text-white">to</span>
                      </span>
                      <span className="inline-block overflow-hidden">
                        <span className="gsap-word inline-block text-white">
                          scale<span className="text-indigo-400">.</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </h1>

            {/* Subheadline */}
            <p
              ref={subheadlineRef}
              className="text-xs sm:text-sm md:text-[0.98rem] text-slate-300/90 max-w-sm sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed font-normal text-center px-2 sm:px-0"
            >
              {subheadline}
            </p>
          </div>

          {/* CTA Action Buttons (Vertical on Mobile, Horizontal on Desktop) */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full sm:w-auto items-center justify-center max-w-[210px] sm:max-w-none px-2 sm:px-0"
          >
            {/* Primary Action: Download CV */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              onClick={handleDownload}
              disabled={downloading || !resumeUrl}
              className="cursor-target group relative inline-flex items-center justify-center h-12 w-full sm:w-auto sm:min-w-[180px] overflow-hidden rounded-full p-1 ps-5 pe-12 text-xs sm:text-sm font-semibold text-white transition-all duration-500 hover:ps-12 hover:pe-5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 shadow-xl shadow-indigo-600/30 select-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 transition-all duration-500 leading-none whitespace-nowrap">
                {downloading ? "Downloading..." : "Download CV"}
              </span>
              <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-700 shadow-md transition-all duration-500 group-hover:right-[calc(100%-44px)] shrink-0">
                {downloading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Download size={15} className="transition-transform duration-500" />
                )}
              </div>
            </motion.button>

            {/* Secondary Action: Explore Selected Work */}
            <motion.a
              whileTap={{ scale: 0.97 }}
              transition={springs.snappy}
              href="#projects"
              className="cursor-target group relative inline-flex items-center justify-center h-12 w-full sm:w-auto sm:min-w-[180px] rounded-full ps-5 pe-12 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all duration-300 bg-transparent hover:bg-white/[0.05] border border-white/15 hover:border-indigo-500/50 backdrop-blur-md select-none shadow-sm"
            >
              <span className="relative z-10 leading-none whitespace-nowrap">Explore Work</span>
              <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-400/50 group-hover:text-white text-slate-300 shadow-sm transition-all duration-300 shrink-0">
                <ArrowUpRight size={15} />
              </div>
            </motion.a>
          </div>

          {/* Skills Marquee (Site-Consistent Bento Chips) */}
          <div ref={marqueeRef} className="w-full pt-4 sm:pt-6 md:pt-6">
            <SiteConsistentSkillsMarquee skillNames={allSkillNames} />
          </div>

        </div>
      </main>
    </div>
  );
}
