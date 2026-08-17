"use client";

import { ArrowRight, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SiFlutter, SiNextdotjs, SiTypescript, SiPostgresql } from "react-icons/si";
import { IoServer } from "react-icons/io5";
import { FiSmartphone } from "react-icons/fi";
import { GiElectric } from "react-icons/gi";
import { motion } from "framer-motion";
import { useState } from "react";
import ColorBends from "@/components/ColorBends";
import type { SiteSettings } from "@/types/content";
import { springs, useMagnetic } from "@/lib/motion";

export default function HomeHero({
  settings,
  resumeUrl,
}: {
  settings: SiteSettings | null;
  resumeUrl: string | null;
}) {
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
    "Flutter Specialist & Full-Stack Engineer crafting high-performance mobile apps and scalable backends.";
  const available = settings?.available_status ?? true;

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
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

      {/* Grid overlay */}
      <div
        className={cn(
          "absolute inset-0 z-[1]",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]",
          "opacity-40 pointer-events-none"
        )}
      />

      {/* Front: contents */}
      <motion.main
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springs.gentle}
        className="relative z-10 pt-36 md:pt-44 pb-20 md:pb-28 px-6 max-w-5xl mx-auto w-full"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Avatar with Spring Floating & Glowing Ring */}
          <motion.div
            whileHover={{ scale: 1.12, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
            className="relative p-1 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-cyan-400 shadow-xl shadow-indigo-500/20 cursor-pointer"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900">
              <Image
                src={profileImage}
                alt="Kaium Al Limon"
                fill
                priority
                className="object-cover"
              />
            </div>
            {/* Pulsing online orb */}
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
            </span>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springs.bouncy, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium tracking-wide backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {available ? "Available for new opportunities" : "Currently occupied"}
          </motion.div>

          {/* Kinetic Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08]"
          >
            {settings?.hero_headline ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-400">
                {settings.hero_headline}
              </span>
            ) : (
              <>
                Crafting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
                  seamless, high-performance
                </span>{" "}
                applications across{" "}
                <span className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-0.5 rounded-xl -skew-x-3 shadow-lg shadow-indigo-500/30">
                  platforms
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.25 }}
            className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed"
          >
            {subheadline}
          </motion.p>

          {/* Magnetic CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto"
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
              className="inline-block"
            >
              <motion.a
                style={{ x: talkMagnetic.x, y: talkMagnetic.y }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={springs.snappy}
                href="#contact"
                className="w-full sm:w-auto px-8 py-3.5 border border-white/12 bg-white/5 hover:bg-white/10 text-white rounded-full font-medium backdrop-blur-md flex items-center justify-center gap-2 group cursor-target transition-all"
              >
                <span>Let&apos;s Talk</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>

          {/* Floating Technology Feature Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="pt-14 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl"
          >
            {[
              { icon: SiFlutter, label: "Flutter & Dart", color: "text-cyan-400", bg: "hover:border-cyan-500/30" },
              { icon: IoServer, label: "Backend Architecture", color: "text-emerald-400", bg: "hover:border-emerald-500/30" },
              { icon: FiSmartphone, label: "iOS & Android Apps", color: "text-pink-400", bg: "hover:border-pink-500/30" },
              { icon: GiElectric, label: "Next.js Web Systems", color: "text-amber-400", bg: "hover:border-amber-500/30" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={springs.snappy}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border border-white/8 bg-slate-900/30 backdrop-blur-md ${item.bg} transition-all cursor-target`}
                >
                  <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-slate-300 text-left">{item.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
