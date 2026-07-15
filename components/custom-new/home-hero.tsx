"use client";

import { ArrowRight, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SiFlutter } from "react-icons/si";
import { IoServer } from "react-icons/io5";
import { FiSmartphone } from "react-icons/fi";
import { GiElectric } from "react-icons/gi";
import { motion } from "framer-motion";
import { useState } from "react";
import ColorBends from "@/components/ColorBends";
import type { SiteSettings } from "@/types/content";


export default function HomeHero({
  settings,
  resumeUrl,
}: {
  settings: SiteSettings | null;
  resumeUrl: string | null;
}) {
  const [downloading, setDownloading] = useState(false);

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
    <div className="relative overflow-hidden bg-[#0a0a0a] min-h-screen">
      {/* Back: ColorBends (wrapped so it fills as a background, not a block) */}
      <div className="absolute inset-0 z-0 opacity-70">
        <ColorBends
          colors={["#000000", "#6366f1"]}
          speed={0.20}
          scale={1}
          transparent={true}
          autoRotate={0.0}
          rotation={45}
          frequency={1.0}
          mouseInfluence={1.0}
          warpStrength={1.0}
          parallax={.50}
          noise={0}
        />
      </div>
      {/* Middle: grid */}
      <div
        className={cn(
          "absolute inset-0 z-[1]",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          "opacity-20"
        )}
      />
      {/* Front: contents */}
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 py-38 px-6 max-w-6xl mx-auto"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          <Image
            src={profileImage}
            alt="profile-picture"
            width={75}
            height={75}
            className="rounded-full border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/30 hover:scale-120 transition-transform duration-500 cursor-pointer cursor-target"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {available ? "Available" : "Unavailable"}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.1]">
            {settings?.hero_headline ? (
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-violet-400 to-indigo-500">
                {settings.hero_headline}
              </span>
            ) : (
              <>
                Crafting <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-violet-400 to-indigo-500">
                  seamless, user‑focused experiences
                </span> across <span className="inline-block bg-indigo-500 px-3 -skew-x-6">
                  platforms
                </span>
              </>
            )}
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleDownload}
              disabled={downloading || !resumeUrl}
              className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group cursor-target"
            >
              {downloading ? (
                <>
                  Downloading...
                  <Loader2 size={18} className="animate-spin" />
                </>
              ) : (
                <>
                  Download CV
                  <Download size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
            <a href="#contact" className="px-8 py-2 border border-white/10 backdrop-blur-md hover:bg-white/5 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 cursor-target">
              Let's Talk
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 opacity-60 ">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
              <SiFlutter size={24} className="text-blue-400" />
              <span className="text-xs md:text-sm font-medium">Flutter Expert</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
              <IoServer size={24} className="text-green-400" />
              <span className="text-xs md:text-sm font-medium">Backend Arch</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
              <FiSmartphone size={24} className="text-pink-400" />
              <span className="text-xs md:text-sm font-medium">iOS & Android</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
              <GiElectric size={24} className="text-yellow-400" />
              <span className="text-xs md:text-sm font-medium">High Perf Web Apps</span>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
