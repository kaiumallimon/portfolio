"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const KINETIC_WORDS = [
  "INITIALIZING",
  "FLUTTER & NEXT.JS",
  "CLEAN ARCHITECTURE",
  "HIGH PERFORMANCE",
  "KAIUM AL LIMON",
];

export default function Preloader() {
  const [complete, setComplete] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);

  // Synchronous session check on mount
  useEffect(() => {
    const hasShown =
      typeof window !== "undefined" &&
      (sessionStorage.getItem("preloaderShown") === "true" ||
        document.documentElement.classList.contains("preloader-done"));

    if (hasShown) {
      if (typeof window !== "undefined") {
        (window as any).__PRELOADER_ACTIVE__ = false;
      }
      return;
    }

    if (typeof window !== "undefined") {
      (window as any).__PRELOADER_ACTIVE__ = true;
    }
    setComplete(false);
  }, []);

  // GSAP Animation Timeline
  useEffect(() => {
    if (complete) return;

    const container = containerRef.current;
    const counter = counterRef.current;
    const progressBar = progressBarRef.current;
    const word = wordRef.current;
    const topBar = topBarRef.current;
    const bottomBar = bottomBarRef.current;
    const ambientGlow = ambientGlowRef.current;

    if (!container || !counter || !progressBar || !word) return;

    const ctx = gsap.context(() => {
      const counterObj = { value: 0 };
      const masterTl = gsap.timeline({
        onComplete: () => {
          setComplete(true);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("preloader-complete"));
          }
        },
      });

      // Initial state
      gsap.set(container, { yPercent: 0, opacity: 1 });
      gsap.set([topBar, bottomBar], { opacity: 0, y: 10 });
      gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(word, { opacity: 0, y: 20 });
      gsap.set(ambientGlow, { scale: 0.8, opacity: 0.4 });

      // Ambient glow gentle pulse
      gsap.to(ambientGlow, {
        scale: 1.25,
        opacity: 0.85,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Master Entrance & Loading Sequence
      masterTl
        // Fade in top/bottom chrome
        .to([topBar, bottomBar], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
        })
        // Reveal first word
        .to(
          word,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3"
        )
        // Numerical count up & progress bar fill
        .to(
          counterObj,
          {
            value: 100,
            duration: 2.2,
            ease: "power2.inOut",
            onUpdate: () => {
              const currentVal = Math.round(counterObj.value);
              if (counter) {
                counter.innerText =
                  currentVal < 10 ? `0${currentVal}%` : `${currentVal}%`;
              }
              // Cycle kinetic words based on percentage
              if (word) {
                const wordIndex = Math.min(
                  Math.floor((currentVal / 100) * KINETIC_WORDS.length),
                  KINETIC_WORDS.length - 1
                );
                if (word.innerText !== KINETIC_WORDS[wordIndex]) {
                  gsap.fromTo(
                    word,
                    { opacity: 0.3, y: 8 },
                    { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
                  );
                  word.innerText = KINETIC_WORDS[wordIndex];
                }
              }
            },
          },
          "-=0.4"
        )
        .to(
          progressBar,
          {
            scaleX: 1,
            duration: 2.2,
            ease: "power2.inOut",
          },
          "<"
        )
        // Brief cinematic pause at 100%
        .to({}, { duration: 0.25 })
        // Exit Curtain Wipe (Synchronized with Header & Hero)
        .add(() => {
          if (typeof window !== "undefined") {
            (window as any).__PRELOADER_ACTIVE__ = false;
            sessionStorage.setItem("preloaderShown", "true");
            // Trigger Hero & Header GSAP timelines exactly as curtain starts lifting
            window.dispatchEvent(new CustomEvent("preloader-exit"));
          }
        })
        .to([topBar, word, counter, bottomBar, progressBar], {
          opacity: 0,
          y: -25,
          duration: 0.45,
          stagger: 0.05,
          ease: "power3.in",
        })
        .to(
          container,
          {
            yPercent: -100,
            duration: 0.9,
            ease: "expo.inOut",
          },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
  }, [complete]);

  if (complete) return null;

  return (
    <div
      ref={containerRef}
      className="preloader-root fixed inset-0 z-[9999] bg-[#05050e] text-white flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden will-change-transform font-sans"
    >
      {/* Background Matrix & Ambient Specular Glow */}
      <div
        ref={ambientGlowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-cyan-500/15 rounded-full blur-3xl pointer-events-none"
      />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      {/* Top Header Bar */}
      <div
        ref={topBarRef}
        className="relative z-10 flex items-center justify-between text-xs sm:text-sm font-mono tracking-widest text-slate-400 uppercase"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span className="font-semibold text-slate-200">Kaium Al Limon</span>
        </div>
        <span className="text-slate-500 hidden sm:inline">Portfolio · 2026</span>
      </div>

      {/* Center Kinetic Typography & Numerical Progress */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto w-full">
        {/* Kinetic Phase Label */}
        <div
          ref={wordRef}
          className="text-xs sm:text-sm md:text-base font-mono tracking-[0.25em] text-indigo-300/90 uppercase font-semibold h-7 flex items-center justify-center"
        >
          INITIALIZING
        </div>

        {/* Large Cinematic Percentage Display */}
        <div className="relative overflow-hidden py-1">
          <span
            ref={counterRef}
            className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 font-sans tabular-nums select-none drop-shadow-2xl"
          >
            00%
          </span>
        </div>

        {/* Specular Progress Bar */}
        <div className="w-full max-w-xs sm:max-w-md h-[3px] rounded-full bg-white/10 overflow-hidden relative shadow-inner">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.8)]"
          />
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div
        ref={bottomBarRef}
        className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-500 tracking-wider uppercase"
      >
        <span>Full-Stack & Mobile</span>
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Ready to launch
        </span>
      </div>
    </div>
  );
}
