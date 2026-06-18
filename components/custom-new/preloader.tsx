"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SiDart, SiFlutter } from "react-icons/si";
import { TbBrandAndroid, TbBrandApple } from "react-icons/tb";

const BOOT_LINES = [
  { at: 0, text: "$ flutter pub get" },
  { at: 18, text: "Resolving dependencies..." },
  { at: 36, text: "$ dart compile kernel lib/main.dart" },
  { at: 54, text: "Building widgets tree..." },
  { at: 72, text: "Deploying to Android & iOS..." },
  { at: 90, text: "Portfolio ready." },
];

const CODE_SNIPPET = `void main() {
  runApp(const PortfolioApp());
}`;

export default function Preloader() {
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("preloaderShown");
    if (hasShown) {
      setComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = 4 + Math.random() * 9;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typedChars >= CODE_SNIPPET.length) return;

    const typeTimer = setTimeout(() => {
      setTypedChars((prev) => Math.min(prev + 1, CODE_SNIPPET.length));
    }, 28);

    return () => clearTimeout(typeTimer);
  }, [typedChars]);

  useEffect(() => {
    if (progress !== 100) return;

    const exitTimer = setTimeout(() => {
      setComplete(true);
      sessionStorage.setItem("preloaderShown", "true");
    }, 700);

    return () => clearTimeout(exitTimer);
  }, [progress]);

  const visibleLines = useMemo(
    () => BOOT_LINES.filter((line) => progress >= line.at),
    [progress]
  );

  const statusLabel = useMemo(() => {
    if (progress < 20) return "initializing";
    if (progress < 45) return "compiling";
    if (progress < 70) return "building";
    if (progress < 95) return "deploying";
    return "launching";
  }, [progress]);

  if (complete) return null;

  const typedCode = CODE_SNIPPET.slice(0, typedChars);

  return (
    <AnimatePresence>
      <motion.div
        key="preloader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        animate={{ y: progress === 100 ? "-100%" : 0 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050510] text-slate-300 overflow-hidden cursor-wait"
      >
        {/* Grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-[min(92vw,560px)] px-4">
          {/* Top meta */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              Kaium Al Limon
            </span>
            <span>flutter · dart · mobile</span>
          </motion.div>

          {/* IDE window */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs text-slate-500">lib/main.dart</span>
              <div className="w-12" />
            </div>

            <div className="p-5 md:p-6 space-y-5">
              {/* Code editor */}
              <div className="rounded-xl border border-white/10 bg-[#0b0f1a] p-4 font-mono text-[13px] leading-relaxed min-h-[92px]">
                <div className="text-slate-600 mb-2 select-none">// booting portfolio app</div>
                <pre className="whitespace-pre-wrap break-all">
                  <span className="text-cyan-300">{typedCode}</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-[7px] h-[15px] ml-0.5 align-middle bg-indigo-400"
                  />
                </pre>
              </div>

              {/* Terminal output */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 min-h-[120px] font-mono text-xs space-y-1.5">
                <AnimatePresence mode="popLayout">
                  {visibleLines.map((line) => (
                    <motion.div
                      key={line.text}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                      className="text-slate-400"
                    >
                      <span className="text-indigo-400 mr-2">›</span>
                      {line.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-500 uppercase tracking-wider">{statusLabel}</span>
                  <span className="text-indigo-300 tabular-nums">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stack icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-8 flex items-center justify-center gap-6 text-slate-500"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-1.5 text-blue-400"
            >
              <SiFlutter size={18} />
              <span className="text-xs font-medium text-slate-400">Flutter</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="flex items-center gap-1.5 text-cyan-400"
            >
              <SiDart size={16} />
              <span className="text-xs font-medium text-slate-400">Dart</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="flex items-center gap-1 text-green-400"
            >
              <TbBrandAndroid size={17} />
              <TbBrandApple size={15} className="text-slate-300" />
              <span className="text-xs font-medium text-slate-400">Multiplatform</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
