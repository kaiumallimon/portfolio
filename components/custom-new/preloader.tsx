"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const BOOT_SEQUENCE = [
  { at: 0, tag: "init", text: "booting kaium.allimon.dev", tone: "text-slate-400" },
  { at: 12, tag: "load", text: 'import { Next, Flutter, Node } from "@stack"', tone: "text-cyan-300" },
  { at: 28, tag: "tsc", text: "compiling TypeScript — strict mode on", tone: "text-amber-300" },
  { at: 45, tag: "build", text: "bundling components & tree-shaking assets", tone: "text-indigo-300" },
  { at: 62, tag: "api", text: "syncing github stats & project index...", tone: "text-violet-300" },
  { at: 78, tag: "perf", text: "optimizing LCP, CLS & route transitions", tone: "text-sky-300" },
  { at: 90, tag: "deploy", text: "establishing secure session — TLS 1.3", tone: "text-emerald-300" },
  { at: 97, tag: "done", text: "portfolio ready — launching interface ✓", tone: "text-green-400" },
] as const;

const FLOATING_SNIPPETS = [
  "async () => {}",
  "useState<T>()",
  "</Portfolio>",
  "npm run build",
  "clean architecture",
  "=> deploy",
  "{ fullStack: true }",
  "git push origin",
];

function ProgressBar({ progress }: { progress: number }) {
  const filled = Math.round(progress / 5);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
        <span>build progress</span>
        <span className="tabular-nums text-indigo-300">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </div>
      <div className="flex gap-1 font-mono text-[10px] text-slate-600">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={i < filled ? "text-indigo-400" : "text-slate-700"}
          >
            █
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Preloader() {
  const [complete, setComplete] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasShown = typeof window !== "undefined" && sessionStorage.getItem("preloaderShown");
    if (hasShown) {
      setComplete(true);
      if (typeof window !== "undefined") {
        (window as any).__PRELOADER_ACTIVE__ = false;
      }
      return;
    }

    if (typeof window !== "undefined") {
      (window as any).__PRELOADER_ACTIVE__ = true;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = 2.5 + Math.random() * 6;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress !== 100) return;

    const exitTimer = setTimeout(() => {
      setExiting(true);
      if (typeof window !== "undefined") {
        (window as any).__PRELOADER_ACTIVE__ = false;
        sessionStorage.setItem("preloaderShown", "true");
        window.dispatchEvent(new CustomEvent("preloader-exit"));
      }
    }, 800);

    const completeTimer = setTimeout(() => {
      setComplete(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("preloader-complete"));
      }
    }, 1800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [progress]);

  const visibleLines = useMemo(
    () => BOOT_SEQUENCE.filter((line) => progress >= line.at),
    [progress]
  );

  if (complete) return null;

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? "-100%" : 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className={`fixed inset-0 z-[9999] overflow-hidden bg-slate-950 cursor-wait ${jetbrains.className}`}
        >
          {/* Ambient background */}
          <div className="absolute inset-0 mesh-gradient pointer-events-none" />
          <div className="absolute inset-0 preloader-grid opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-950/80 pointer-events-none" />

          {/* Floating code fragments */}
          {FLOATING_SNIPPETS.map((snippet, i) => (
            <motion.span
              key={snippet}
              className="absolute text-[11px] text-indigo-400/20 font-mono whitespace-nowrap select-none pointer-events-none"
              style={{
                left: `${8 + (i * 11) % 82}%`,
                top: `${10 + (i * 17) % 75}%`,
              }}
              animate={{
                y: [0, -18, 0],
                opacity: [0.12, 0.28, 0.12],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.35,
                ease: "easeInOut",
              }}
            >
              {snippet}
            </motion.span>
          ))}

          {/* Scanline */}
          <div className="absolute inset-0 preloader-scanline pointer-events-none opacity-[0.04]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  engineer@portfolio
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-600 tabular-nums">
                v2.0.26 · production
              </span>
            </motion.div>

            {/* Terminal */}
            <div className="flex flex-1 items-center justify-center py-8">
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl overflow-hidden"
              >
                {/* Window chrome */}
                <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    ~/portfolio — zsh — 80×24
                  </span>
                  <div className="w-12" />
                </div>

                <div className="space-y-6 p-5 md:p-7">
                  {/* Boot log */}
                  <div className="min-h-[180px] space-y-2 text-xs md:text-sm leading-relaxed">
                    {visibleLines.map((line, index) => {
                      const isLatest = index === visibleLines.length - 1 && progress < 100;

                      return (
                        <motion.div
                          key={line.tag}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35 }}
                          className="flex gap-3"
                        >
                          <span className="w-6 shrink-0 text-right text-slate-600 tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="shrink-0 text-indigo-400/80">[{line.tag}]</span>
                          <span className={line.tone}>
                            {line.text}
                            {isLatest && (
                              <span className="preloader-cursor ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-indigo-400" />
                            )}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  <ProgressBar progress={progress} />

                  {/* Identity row */}
                  <div className="flex items-center gap-4 border-t border-white/5 pt-5">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-indigo-500/30 bg-slate-800">
                      <Image
                        src="/bordered.png"
                        alt="Kaium Al Limon"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        Kaium Al Limon
                      </p>
                      <p className="text-xs text-slate-500">
                        Full-Stack Mobile & Web Software Engineer
                      </p>
                    </div>
                    <div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="rounded border border-white/10 bg-white/5 px-2 py-1">
                        Next.js
                      </span>
                      <span className="rounded border border-white/10 bg-white/5 px-2 py-1">
                        Flutter
                      </span>
                      <span className="rounded border border-white/10 bg-white/5 px-2 py-1">
                        TypeScript
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-end justify-between"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                initializing experience
              </p>
              <motion.p
                className="text-5xl md:text-7xl font-bold leading-none tracking-tighter text-white/10 tabular-nums"
                animate={{ opacity: [0.08, 0.16, 0.08] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {String(Math.round(progress)).padStart(3, "0")}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
