"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Volume2, Copy, CheckCheck } from "lucide-react";
import {
  RiTwitterXLine,
  RiGithubLine,
  RiLinkedinLine,
  RiGraduationCapLine,
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

// Client-only dynamic import to guarantee zero hydration mismatch on the realtime clock
const RealtimeCounterClock = dynamic(
  () =>
    import("./realtime-counter-clock").then((mod) => mod.RealtimeCounterClock),
  {
    ssr: false,
    loading: () => (
      <span
        suppressHydrationWarning
        className="text-zinc-700 dark:text-zinc-300 tabular-nums font-mono text-xs sm:text-sm"
      >
        --:--:-- --{" "}
        <span className="text-zinc-400 dark:text-zinc-500 ml-1">
          {"//"} Dhaka (GMT+6)
        </span>
      </span>
    ),
  }
);

export function MonochromeHero({
  settings,
  coverRef,
}: {
  settings: ISiteSettings;
  coverRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [coverGameMode, setCoverGameMode] = useState<GameMode>("idle");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const pronunciationAudioRef = useRef<HTMLAudioElement | null>(null);

  // Play real human name pronunciation recorded in public/audio/
  const playNamePronunciation = () => {
    try {
      if (!pronunciationAudioRef.current) {
        pronunciationAudioRef.current = new Audio("/audio/name-pronunciation.mp3");
        pronunciationAudioRef.current.onended = () => setIsPlayingAudio(false);
        pronunciationAudioRef.current.onerror = () => {
          // Fallback to original raw filename if needed
          const fallback = new Audio(
            "/audio/ElevenLabs_2026-11-08T13_53_53_Adam%20-%20Dominant,%20Firm_pre_s50_sim75_v4.mp3"
          );
          fallback.onended = () => setIsPlayingAudio(false);
          fallback.play().catch(() => {});
          setIsPlayingAudio(true);
        };
      }
      pronunciationAudioRef.current.currentTime = 0;
      setIsPlayingAudio(true);
      pronunciationAudioRef.current
        .play()
        .then(() => {
          toast.success("Playing name pronunciation: Kaium Al Limon");
        })
        .catch((err) => {
          console.warn("Audio playback error:", err);
          setIsPlayingAudio(false);
        });
    } catch (err) {
      console.warn("Audio error:", err);
      setIsPlayingAudio(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(settings.email);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(settings.phone || "+880 1738 439 423");
    setCopiedPhone(true);
    toast.success("Phone number copied to clipboard");
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section className="w-full bg-white dark:bg-zinc-950">
      {/* 
        Hero Layout matching Chanh Dai:
        - On mobile & sm screens (< md):
          Row 1: Cover artwork spans full width (col-span-2)
          Row 2: Compact Avatar on left (col-start-1), Name + Snug Tagline on right (col-start-2)
        - On desktop (md: and up):
          Col 1: Avatar spans both rows (md:col-start-1 md:row-start-1 md:row-span-2)
          Col 2: Row 1 is Cover (md:col-start-2 md:row-start-1), Row 2 is Name & Tagline (md:col-start-2 md:row-start-2)
      */}
      <div className="relative grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr] md:grid-rows-[1fr_auto] border-b border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Cover Artwork: Full width at top on mobile (< md), Top-Right on desktop (md:) */}
        <div
          ref={coverRef}
          className="col-span-2 row-start-1 md:col-span-1 md:col-start-2 md:row-start-1 relative cover-grid-bg overflow-hidden flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800 h-[210px] sm:h-[230px] md:h-full"
        >
          <CadIsometricCover onGameModeChange={setCoverGameMode} />
        </div>

        {/* Circular Avatar: Bottom-Left beneath cover on mobile (< md), Left column spanning 2 rows on desktop (md:) */}
        <div className="col-start-1 row-start-2 md:col-start-1 md:row-start-1 md:row-span-2 flex items-center justify-center border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-[105px] sm:h-[115px] md:h-full">
          <div className="flex items-center justify-center p-3 sm:p-4 md:p-6 w-full h-full">
            <div className="relative size-16 sm:size-20 md:size-40 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700 ring-2 ring-zinc-100 dark:ring-zinc-900 bg-zinc-100 dark:bg-zinc-900 shrink-0">
              <Image
                src="/bordered.png"
                alt={settings.name}
                fill
                sizes="(max-width: 768px) 80px, 160px"
                className="object-cover select-none"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Name & Tagline: Bottom-Right beneath cover on mobile (< md), Bottom-Right beneath cover on desktop (md:) */}
        <div className="col-start-2 row-start-2 md:col-start-2 md:row-start-2 flex flex-col justify-end bg-white dark:bg-zinc-950 min-w-0 h-[105px] sm:h-[115px] md:h-auto">
          {/* Upper row: Name + sound chime + Tech Humor Game Hint (desktop md:) */}
          <div className="px-3.5 pt-2 pb-0.5 sm:px-4 sm:pt-2 sm:pb-0.5 md:px-4 md:py-2 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
                {settings.name}
              </h1>

              {/* Audio Pronunciation Button */}
              <button
                type="button"
                onClick={playNamePronunciation}
                className={`p-1 transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? "text-blue-500 dark:text-blue-400 animate-pulse"
                    : "text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100"
                }`}
                title="Pronounce my name (audio recording)"
                aria-label="Pronounce my name"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Tech humor runner game instruction (desktop view md:) */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("kal:start-runner"));
                }
              }}
              className="hidden md:inline-flex items-center gap-1.5 sm:gap-2 text-left group select-none cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
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

          {/* Lower row: Rotating Tagline / Sentences */}
          {/* On mobile (< md): Sits snugly right underneath the name without split border or giant void */}
          {/* On desktop (md:): Padded in lower bar with top border */}
          <div className="px-3.5 pb-2.5 pt-0 sm:px-4 sm:pb-3 sm:pt-0 md:px-4 md:py-2 md:border-t md:border-zinc-200 md:dark:border-zinc-800 flex items-start h-[38px] sm:h-[40px] md:h-[42px] overflow-hidden">
            <RotatingText
              layout={false}
              texts={[
                "Building high-performance mobile & web apps.",
                "Turning complex problems into practical software.",
                "Crafting fluid apps with Flutter & Next.js.",
                "Full-stack engineer building resilient systems.",
              ]}
              mainClassName="font-mono text-xs sm:text-[13px] md:text-sm text-zinc-600 dark:text-zinc-400 leading-snug line-clamp-2"
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

      {/* Stripe Divider matching Chanh Dai */}
      <div className="stripe-divider h-6 sm:h-8 border-b border-zinc-200 dark:border-zinc-800 w-full" />

      {/* 
        Contacts: Arranged to stack sequentially on mobile in exact order matching Chanh Dai:
        1. Designation
        2. Location
        3. Realtime Clock
        4. Email (with copy)
        5. Phone (with copy)
        6. Availability status
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-mono">
        {/* Left Column (Desktop) / Items 1-3 (Mobile) */}
        <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {/* 1. Education */}
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiGraduationCapLine className="w-3.5 h-3.5" />
            </div>
            <a
              href="#education"
              className="text-zinc-700 dark:text-zinc-300 hover:underline"
              title="View education details"
            >
              Computer Science Graduate <span className="text-zinc-400">@</span>UIU
            </a>
          </div>

          {/* 2. Location */}
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

          {/* 3. Live Clock */}
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiTimeLine className="w-3.5 h-3.5" />
            </div>
            <RealtimeCounterClock timezone={settings.timezone || "Asia/Dhaka"} />
          </div>
        </div>

        {/* Right Column (Desktop) / Items 4-6 (Mobile) */}
        <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {/* 4. Email */}
          <div className="px-4 py-2.5 flex items-center justify-between group">
            <div className="flex items-center gap-3 min-w-0">
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
              className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 p-1 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0 ml-2"
              title="Copy email address"
            >
              {copiedEmail ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 5. Phone */}
          <div className="px-4 py-2.5 flex items-center justify-between group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <RiPhoneLine className="w-3.5 h-3.5" />
              </div>
              <a
                href={`tel:${(settings.phone || "+880 1738 439 423").replace(/\s+/g, "")}`}
                className="text-zinc-700 dark:text-zinc-300 hover:underline truncate"
              >
                {settings.phone || "+880 1738 439 423"}
              </a>
            </div>
            <button
              onClick={copyPhone}
              className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 p-1 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0 ml-2"
              title="Copy phone number"
            >
              {copiedPhone ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* 6. Availability Status */}
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <span className="text-zinc-700 dark:text-zinc-300 font-mono text-xs sm:text-sm">
              Available <span className="text-zinc-400 dark:text-zinc-500">{"//"} Open to work</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Social Links Row with "follow me" Annotation */}
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
