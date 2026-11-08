"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
import { ISiteSettings } from "@/lib/models";

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
  const [timeString, setTimeString] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: settings.timezone || "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now);
        setTimeString(formatted);
      } catch {
        setTimeString(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.timezone]);

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
          <CadIsometricCover />
        </div>

        {/* Right Column, Row 2: Name & Designation — plain solid background */}
        <div className="flex flex-col justify-end bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
          {/* Upper line: Name + verified badge + sound chime */}
          <div className="px-4 py-2.5 sm:py-3 flex items-center gap-2">
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

          {/* Lower line: Designation */}
          <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800">
            <p className="font-mono text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Full-Stack Software Engineer.
            </p>
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
            <span className="text-zinc-700 dark:text-zinc-300 tabular-nums">
              {timeString || "06:12 PM"} <span className="text-zinc-400">// Dhaka (GMT+6)</span>
            </span>
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
