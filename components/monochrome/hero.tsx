"use client";

import Image from "next/image";
import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, Copy, CheckCheck } from "lucide-react";
import {
  RiTwitterXLine,
  RiGithubLine,
  RiLinkedinLine,
  RiCodeSSlashLine,
  RiMapPinLine,
  RiTimeLine,
  RiMailLine,
  RiPhoneLine,
} from "@remixicon/react";
import { toast } from "sonner";
import { CadIsometricCover } from "./cad-isometric-cover";
import RotatingText from "@/components/RotatingText";
import { ISiteSettings } from "@/lib/models";
import { GameMode } from "@/components/cover/use-pixel-runner";
import { cn } from "@/lib/utils";

interface TimeParts {
  h: string;
  m: string;
  s: string;
  p: string;
}

function getDhakaTimeParts(timezone: string = "Asia/Dhaka"): TimeParts {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const parts = formatter.formatToParts(new Date());
    let h = "12",
      m = "00",
      s = "00",
      p = "AM";
    for (const part of parts) {
      if (part.type === "hour") h = part.value;
      else if (part.type === "minute") m = part.value;
      else if (part.type === "second") s = part.value;
      else if (part.type === "dayPeriod") p = part.value.toUpperCase();
    }
    return {
      h: h.padStart(2, "0"),
      m: m.padStart(2, "0"),
      s: s.padStart(2, "0"),
      p: p || "AM",
    };
  } catch {
    const d = new Date();
    let hours = d.getHours();
    const p = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return {
      h: String(hours).padStart(2, "0"),
      m: String(d.getMinutes()).padStart(2, "0"),
      s: String(d.getSeconds()).padStart(2, "0"),
      p,
    };
  }
}

function CounterDigit({
  digit,
  className,
}: {
  digit: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-[1.35em] w-[0.62em] overflow-hidden items-center justify-center tabular-nums font-mono leading-none",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="absolute inset-0 flex items-center justify-center tabular-nums font-mono leading-none"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CounterPeriod({ period }: { period: string }) {
  return (
    <span className="relative inline-flex h-[1.35em] w-[1.7em] overflow-hidden items-center justify-center tabular-nums font-mono leading-none text-zinc-500 dark:text-zinc-400 text-xs sm:text-[13px] ml-1">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={period}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="absolute inset-0 flex items-center justify-center font-mono font-medium leading-none"
        >
          {period}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ColonSeparator() {
  return (
    <span className="text-zinc-400 dark:text-zinc-500 font-mono select-none px-[1px] leading-none">
      :
    </span>
  );
}

export function RealtimeCounterClock({ timezone = "Asia/Dhaka" }: { timezone?: string }) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [time, setTime] = useState<TimeParts>(() => getDhakaTimeParts(timezone));

  useEffect(() => {
    const update = () => {
      setTime(getDhakaTimeParts(timezone));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  if (!isMounted) {
    return (
      <span className="text-zinc-700 dark:text-zinc-300 tabular-nums font-mono text-xs sm:text-sm">
        {time.h}:{time.m}:{time.s} {time.p}{" "}
        <span className="text-zinc-400 dark:text-zinc-500 ml-1">{"//"} Dhaka (GMT+6)</span>
      </span>
    );
  }

  return (
    <div className="inline-flex items-center text-zinc-700 dark:text-zinc-300 font-mono text-xs sm:text-sm tabular-nums leading-none select-none">
      {/* Hours in 12-hour format */}
      <CounterDigit digit={time.h[0]} />
      <CounterDigit digit={time.h[1]} />

      <ColonSeparator />

      {/* Minutes */}
      <CounterDigit digit={time.m[0]} />
      <CounterDigit digit={time.m[1]} />

      <ColonSeparator />

      {/* Seconds with live counter animation */}
      <CounterDigit
        digit={time.s[0]}
        className="text-zinc-950 dark:text-zinc-100 font-medium"
      />
      <CounterDigit
        digit={time.s[1]}
        className="text-zinc-950 dark:text-zinc-100 font-medium"
      />

      {/* AM / PM */}
      <CounterPeriod period={time.p} />

      {/* Timezone Label */}
      <span className="text-zinc-400 dark:text-zinc-500 ml-2 font-mono text-xs sm:text-sm">
        {"//"} Dhaka (GMT+6)
      </span>
    </div>
  );
}

// Synthesized name pronunciation chime
function playAudioChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch {}
}

export function MonochromeHero({
  settings,
  coverRef,
}: {
  settings: ISiteSettings;
  coverRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [coverGameMode, setCoverGameMode] = useState<GameMode>("idle");

  const copyEmail = () => {
    navigator.clipboard.writeText(settings.email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className="w-full bg-white dark:bg-zinc-950">
      {/* Hero: single grid — avatar spans 2 rows on left, cover+name on right with cover-grid-bg */}
      <div className="relative grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:grid-rows-[1fr_auto] border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">

        {/* Left Column: avatar spans both rows, no top border cutting across */}
        <div className="sm:row-span-2 sm:row-start-1 flex flex-col border-b sm:border-b-0 sm:border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="relative size-28 min-[24rem]:size-32 sm:size-40 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700 ring-2 ring-zinc-100 dark:ring-zinc-900 bg-zinc-100 dark:bg-zinc-900 shrink-0">
              <Image
                src="/bordered.png"
                alt={settings.name}
                fill
                sizes="160px"
                className="object-cover select-none"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Column, Row 1: KAL cover with cover-grid-bg */}
        <div ref={coverRef} className="relative cover-grid-bg overflow-hidden flex items-center justify-center">
          <CadIsometricCover onGameModeChange={setCoverGameMode} />
        </div>

        {/* Right Column, Row 2: Name & Designation — plain solid background */}
        <div className="flex flex-col justify-end bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
          {/* Upper line: Name + verified badge + sound chime + Tech Humor Game Hint */}
          <div className="px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
                {settings.name}
              </h1>

              {/* Verified Badge */}
              <span
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center shrink-0"
                title="Verified Engineer"
              >
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              </span>

              {/* Audio Pronunciation Button */}
              <button
                onClick={() => {
                  playAudioChime();
                  toast.success("Name pronunciation chime played");
                }}
                className="p-1 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                title="Pronounce my name"
                aria-label="Pronounce my name"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Tech humor instruction outside cover indicating it is an endless runner game */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("kal:start-runner"));
                }
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 text-left group select-none cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Click or press Space to play Chrome-dino developer runner"
            >
              {/* Sketched / doodle curved arrow pointing up-left towards cover character */}
              <svg
                width="34"
                height="32"
                viewBox="0 0 34 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-zinc-400 dark:stroke-zinc-500 group-hover:stroke-blue-500 dark:group-hover:stroke-blue-400 transition-colors shrink-0 -mt-1"
              >
                <path
                  d="M29 27 C 24 14, 15 8, 7 7"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M13 3 L6 7 L11 14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {coverGameMode === "running" ? (
                <div className="flex flex-col leading-tight">
                  <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>deploying in prod</span>
                    <kbd className="text-[9px] px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono">
                      Space
                    </kbd>
                    <span className="text-[9px] text-zinc-500">jump</span>
                    <kbd className="text-[9px] px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono">
                      ↓
                    </kbd>
                    <span className="text-[9px] text-zinc-500">duck</span>
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                    dodge bugs &amp; merge conflicts!
                  </span>
                </div>
              ) : coverGameMode === "gameover" ? (
                <div className="flex flex-col leading-tight">
                  <span className="font-mono text-[11px] font-semibold text-red-500 dark:text-red-400 flex items-center gap-1.5">
                    <span>✖ build failed</span>
                    <kbd className="text-[9px] px-1 py-0.5 rounded bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 font-mono">
                      Space
                    </kbd>
                    <span className="text-[9px]">revert</span>
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                    click or tap to git revert
                  </span>
                </div>
              ) : (
                <div className="flex flex-col leading-tight">
                  <span className="font-mono text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    <span>{"//"} yes, he&apos;s playable!</span>
                    <kbd className="text-[9px] px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 font-mono shadow-xs text-zinc-600 dark:text-zinc-400">
                      Space
                    </kbd>
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    click or press space to run!
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Lower line: Rotating Tagline / Sentences */}
          <div className="px-4 py-2 sm:py-2.5 border-t border-zinc-200 dark:border-zinc-800 min-h-[2.75rem] sm:min-h-[2.25rem] flex items-center">
            <RotatingText
              texts={[
                "Building high-performance mobile & web experiences engineered to scale.",
                "Turning ideas and complex problems into practical, well-engineered software.",
                "Specializing in Flutter cross-platform apps, Next.js, and backend engineering.",
                "Full-Stack Software Engineer crafting resilient, production-ready products.",
              ]}
              mainClassName="font-mono text-xs sm:text-sm text-zinc-600 dark:text-zinc-400"
              staggerDuration={0.03}
              staggerFrom="first"
              splitBy="words"
              rotationInterval={3600}
              auto={true}
              loop={true}
              pauseOnHover={true}
            />
          </div>
        </div>
      </div>

      {/* Stripe Divider */}
      <div className="stripe-divider h-8 border-b border-zinc-200 dark:border-zinc-800 w-full" />

      {/* 4. Contacts: 2-Column Hairline Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-mono">
        {/* Left Column */}
        <div className="flex flex-col">
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiCodeSSlashLine className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-700 dark:text-zinc-300">
              Full-Stack Software Engineer <span className="text-zinc-400">@</span>UIU
            </span>
          </div>

          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiMapPinLine className="w-3.5 h-3.5" />
            </div>
            <a
              href="https://maps.google.com/?q=Dhaka,Bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              Dhaka, Bangladesh
            </a>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <RiMailLine className="w-3.5 h-3.5" />
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="text-zinc-700 dark:text-zinc-300 hover:underline truncate"
              >
                {settings.email}
              </a>
            </div>
            <button
              onClick={copyEmail}
              className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 p-1 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Copy email address"
            >
              {copiedEmail ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiTimeLine className="w-3.5 h-3.5" />
            </div>
            <RealtimeCounterClock timezone={settings.timezone || "Asia/Dhaka"} />
          </div>

          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiPhoneLine className="w-3.5 h-3.5" />
            </div>
            <a
              href="tel:+8801888387500"
              className="text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              +880 1888 387 500
            </a>
          </div>

          {/* Spacer row for visual balance */}
          <div className="hidden sm:flex px-4 py-2.5 items-center gap-3 text-transparent select-none">
            <div className="size-6" />
            <span>—</span>
          </div>
        </div>
      </div>

      {/* 5. Social Links Row with "follow me" Handwritten Annotation */}
      <div className="relative px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
        {/* Handwritten note on the left */}
        <div
          className="pointer-events-none hidden sm:flex items-center gap-1.5 font-serif italic text-xs text-zinc-500 dark:text-zinc-400 select-none mr-2"
          aria-hidden="true"
        >
          <span>follow me</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-zinc-400 dark:text-zinc-600 -rotate-12"
          >
            <path
              d="M 4 8 Q 12 12 18 16 M 14 16 L 18 16 L 18 12"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Social Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={settings.twitterUrl || "https://x.com/kaiumallimon"}
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white transition-colors"
            title="X (Twitter)"
          >
            <RiTwitterXLine className="w-4 h-4" />
          </a>

          <a
            href={settings.githubUrl || "https://github.com/kaiumallimon"}
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white transition-colors"
            title="GitHub"
          >
            <RiGithubLine className="w-4 h-4" />
          </a>

          <a
            href={settings.linkedinUrl || "https://linkedin.com/in/kaiumallimon"}
            target="_blank"
            rel="noopener noreferrer"
            className="size-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-white transition-colors"
            title="LinkedIn"
          >
            <RiLinkedinLine className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
