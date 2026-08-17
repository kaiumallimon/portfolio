"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, Loader2, Sparkles, Terminal, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SiFlutter, SiNextdotjs, SiTypescript, SiPostgresql } from "react-icons/si";
import { IoServer } from "react-icons/io5";
import { FiSmartphone } from "react-icons/fi";
import { GiElectric } from "react-icons/gi";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ColorBends from "@/components/ColorBends";
import type { SiteSettings } from "@/types/content";
import { springs, useMagnetic } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const techCardsRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] = useState(false);
  const downloadMagnetic = useMagnetic(0.3);
  const talkMagnetic = useMagnetic(0.3);

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
    "Flutter Specialist & Full-Stack Software Engineer crafting high-performance cross-platform mobile apps and resilient cloud architectures.";
  const available = settings?.available_status ?? true;

  // GSAP Kinetic Triggered Typography & Entrance Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Avatar Pop with Back Easing
      if (avatarRef.current) {
        tl.fromTo(
          avatarRef.current,
          { scale: 0.6, opacity: 0, y: 30, rotation: -8 },
          { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 1.1, ease: "back.out(1.8)" }
        );
      }

      // 2. Status Capsule Slide Down
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: -20, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.7"
        );
      }

      // 3. Kinetic Word-by-Word Headline Reveal from Masked Overflow
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".gsap-word");
        tl.fromTo(
          words,
          {
            yPercent: 120,
            opacity: 0,
            rotateX: 40,
            transformOrigin: "0% 50% -50",
          },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.045,
            duration: 0.95,
            ease: "power4.out",
          },
          "-=0.6"
        );
      }

      // 4. Subheadline Blur-Up Reveal
      if (subheadlineRef.current) {
        tl.fromTo(
          subheadlineRef.current,
          { y: 24, opacity: 0, filter: "blur(6px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.85, ease: "power3.out" },
          "-=0.5"
        );
      }

      // 5. Magnetic CTA Buttons
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { y: 24, opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: "back.out(1.6)" },
          "-=0.5"
        );
      }

      // 6. Technology Strip Cards
      if (techCardsRef.current) {
        tl.fromTo(
          techCardsRef.current.children,
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.85, ease: "power3.out" },
          "-=0.5"
        );
      }

      // 7. GSAP Scroll Parallax Scrub as user scrolls past Hero
      if (contentRef.current && containerRef.current) {
        gsap.to(contentRef.current, {
          y: 90,
          opacity: 0.2,
          scale: 0.97,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden min-h-screen flex items-center justify-center"
    >
      {/* Background WebGL Shader */}
      <div className="absolute inset-0 z-0 opacity-60">
        <ColorBends
          colors={["#06060c", "#6366f1", "#4f46e5"]}
          speed={0.18}
          scale={1}
          transparent={true}
          autoRotate={0.0}
          rotation={45}
          frequency={1.0}
          mouseInfluence={0.8}
          warpStrength={0.9}
          parallax={0.4}
          noise={0.02}
        />
      </div>

      {/* Ambient Grid overlay */}
      <div
        className={cn(
          "absolute inset-0 z-[1]",
          "bg-size-[44px_44px]",
          "bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]",
          "opacity-40 pointer-events-none"
        )}
      />

      {/* Foreground Interactive Content */}
      <main
        ref={contentRef}
        className="relative z-10 pt-36 md:pt-44 pb-20 md:pb-28 px-6 max-w-5xl mx-auto w-full will-change-transform"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Avatar with Specular Aura Ring */}
          <div
            ref={avatarRef}
            className="relative p-1.5 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 shadow-2xl shadow-indigo-500/25 cursor-pointer group"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={springs.snappy}
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900"
            >
              <Image
                src={profileImage}
                alt="Kaium Al Limon"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
            {/* Pulsing online indicator */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
            </span>
          </div>

          {/* Status Capsule */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium tracking-wide backdrop-blur-xl shadow-lg shadow-indigo-500/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span>{available ? "Available for new opportunities" : "Currently occupied"}</span>
            <span className="text-white/20">|</span>
            <span className="text-indigo-400/90 font-mono text-[11px]">Full-Stack & Mobile</span>
          </div>

          {/* GSAP Kinetic Split-Word Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08] perspective-1000"
          >
            {settings?.hero_headline ? (
              <span className="inline-block overflow-hidden">
                <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400">
                  {settings.hero_headline}
                </span>
              </span>
            ) : (
              <>
                <span className="inline-block overflow-hidden mr-3">
                  <span className="gsap-word inline-block">Crafting</span>
                </span>
                <span className="inline-block overflow-hidden mr-3">
                  <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                    scalable,
                  </span>
                </span>
                <span className="inline-block overflow-hidden mr-3">
                  <span className="gsap-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                    high-performance
                  </span>
                </span>
                <br className="hidden sm:block" />
                <span className="inline-block overflow-hidden mr-3">
                  <span className="gsap-word inline-block">applications</span>
                </span>
                <span className="inline-block overflow-hidden mr-3">
                  <span className="gsap-word inline-block">across</span>
                </span>
                <span className="inline-block overflow-hidden">
                  <span className="gsap-word inline-block bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white px-3.5 py-0.5 rounded-2xl -skew-x-3 shadow-xl shadow-indigo-500/30 border border-indigo-400/30">
                    platforms
                  </span>
                </span>
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed"
          >
            {subheadline}
          </p>

          {/* Magnetic CTA Action Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto items-center justify-center"
          >
            <div
              ref={downloadMagnetic.ref}
              onMouseMove={downloadMagnetic.handleMouseMove}
              onMouseLeave={downloadMagnetic.handleMouseLeave}
              className="inline-block w-full sm:w-auto"
            >
              <motion.button
                style={{ x: downloadMagnetic.x, y: downloadMagnetic.y }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={springs.snappy}
                onClick={handleDownload}
                disabled={downloading || !resumeUrl}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group cursor-target transition-all"
              >
                {downloading ? (
                  <>
                    <span>Downloading...</span>
                    <Loader2 size={18} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Download CV</span>
                    <Download size={18} className="transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>

            <div
              ref={talkMagnetic.ref}
              onMouseMove={talkMagnetic.handleMouseMove}
              onMouseLeave={talkMagnetic.handleMouseLeave}
              className="inline-block w-full sm:w-auto"
            >
              <motion.a
                style={{ x: talkMagnetic.x, y: talkMagnetic.y }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={springs.snappy}
                href="#contact"
                className="w-full sm:w-auto px-8 py-3.5 border border-white/12 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium backdrop-blur-xl flex items-center justify-center gap-2 group cursor-target transition-all shadow-lg shadow-black/20"
              >
                <span>Let&apos;s Talk</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </div>

          {/* Floating Technology Feature Strip */}
          <div
            ref={techCardsRef}
            className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 w-full max-w-4xl"
          >
            {[
              { icon: SiFlutter, label: "Flutter & Dart", detail: "Multiplatform UI", color: "text-cyan-400", border: "hover:border-cyan-500/40" },
              { icon: IoServer, label: "Backend Systems", detail: "Node, Go & APIs", color: "text-emerald-400", border: "hover:border-emerald-500/40" },
              { icon: FiSmartphone, label: "iOS & Android", detail: "Native Performance", color: "text-pink-400", border: "hover:border-pink-500/40" },
              { icon: GiElectric, label: "Next.js Web", detail: "Server Components", color: "text-amber-400", border: "hover:border-amber-500/40" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={springs.snappy}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl border border-white/8 bg-slate-900/40 backdrop-blur-xl ${item.border} transition-all cursor-target shadow-lg shadow-black/20`}
                >
                  <div className={`p-2.5 rounded-xl bg-white/5 ${item.color} shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs md:text-sm font-semibold text-white truncate">{item.label}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
