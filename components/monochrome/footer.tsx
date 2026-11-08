"use client";

import { ArrowUp } from "lucide-react";
import {
  RiTwitterXLine,
  RiGithubLine,
  RiLinkedinLine,
} from "@remixicon/react";
import { ISiteSettings } from "@/lib/models";

function FooterBotanicalFlowers() {
  return (
    <svg
      viewBox="0 0 460 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[280px] sm:w-[380px] md:w-[460px] h-auto text-zinc-400/80 dark:text-zinc-500/80 overflow-visible select-none"
      aria-hidden="true"
    >
      {/* Stem 1 - Left cluster with 5-petal flower and side bud */}
      <path d="M 52 96 Q 50 62 55 36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 52 68 Q 42 64 40 70 Q 48 74 52 70" fill="currentColor" opacity="0.85" />
      <path d="M 53 54 Q 63 50 65 56 Q 57 60 53 56" fill="currentColor" opacity="0.85" />
      <g transform="translate(55, 34)">
        <circle cx="0" cy="0" r="3.6" fill="currentColor" />
        <circle cx="0" cy="-6.2" r="3.2" fill="currentColor" opacity="0.95" />
        <circle cx="5.9" cy="-1.9" r="3.2" fill="currentColor" opacity="0.95" />
        <circle cx="3.6" cy="5.1" r="3.2" fill="currentColor" opacity="0.95" />
        <circle cx="-3.6" cy="5.1" r="3.2" fill="currentColor" opacity="0.95" />
        <circle cx="-5.9" cy="-1.9" r="3.2" fill="currentColor" opacity="0.95" />
        <circle cx="0" cy="0" r="1.8" className="fill-zinc-100 dark:fill-zinc-950" />
      </g>
      <path d="M 52 64 Q 68 60 72 48" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="72" cy="46" r="3.2" fill="currentColor" />
      <circle cx="76" cy="50" r="2.2" fill="currentColor" opacity="0.8" />

      {/* Stem 2 - Left-center tulip / bud sprout */}
      <path d="M 115 96 Q 118 64 112 44" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 116 74 Q 106 70 104 76 Q 113 80 116 76" fill="currentColor" opacity="0.85" />
      <path d="M 114 58 Q 124 54 126 60 Q 117 64 114 60" fill="currentColor" opacity="0.85" />
      <g transform="translate(112, 40)">
        <ellipse cx="-4" cy="-2" rx="3.2" ry="4.5" transform="rotate(-18 -4 -2)" fill="currentColor" />
        <ellipse cx="4" cy="-2" rx="3.2" ry="4.5" transform="rotate(18 4 -2)" fill="currentColor" />
        <ellipse cx="0" cy="-5" rx="3.5" ry="5" fill="currentColor" />
      </g>

      {/* Stem 3 - Center tall daisy with multi-tiered leaves */}
      <path d="M 195 96 Q 192 52 195 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 194 76 Q 182 70 180 78 Q 191 82 194 78" fill="currentColor" opacity="0.9" />
      <path d="M 195 60 Q 208 54 210 62 Q 200 66 195 62" fill="currentColor" opacity="0.9" />
      <path d="M 195 42 Q 184 36 182 44 Q 192 48 195 44" fill="currentColor" opacity="0.9" />
      <g transform="translate(195, 17)">
        <circle cx="0" cy="-7.8" r="4" fill="currentColor" />
        <circle cx="7.4" cy="-2.4" r="4" fill="currentColor" />
        <circle cx="4.6" cy="6.3" r="4" fill="currentColor" />
        <circle cx="-4.6" cy="6.3" r="4" fill="currentColor" />
        <circle cx="-7.4" cy="-2.4" r="4" fill="currentColor" />
        <circle cx="0" cy="0" r="4.6" fill="currentColor" />
        <circle cx="0" cy="0" r="2.2" className="fill-zinc-100 dark:fill-zinc-950" />
      </g>

      {/* Stem 4 - Center-right triple cluster */}
      <path d="M 255 96 Q 258 68 252 48" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 256 78 Q 266 74 268 80 Q 259 84 256 80" fill="currentColor" opacity="0.85" />
      <g transform="translate(252, 44)">
        <circle cx="0" cy="0" r="3.4" fill="currentColor" />
        <circle cx="-5.5" cy="-3.5" r="3" fill="currentColor" />
        <circle cx="5.5" cy="-3.5" r="3" fill="currentColor" />
        <circle cx="0" cy="-6.5" r="3" fill="currentColor" />
        <circle cx="0" cy="0" r="1.6" className="fill-zinc-100 dark:fill-zinc-950" />
      </g>
      <path d="M 255 64 Q 242 58 238 50" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="237" cy="48" r="2.8" fill="currentColor" />

      {/* Stem 5 - Right bell sprout */}
      <path d="M 310 96 Q 306 68 312 42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 308 76 Q 298 72 296 78 Q 305 82 308 78" fill="currentColor" opacity="0.85" />
      <path d="M 310 60 Q 320 56 322 62 Q 313 66 310 62" fill="currentColor" opacity="0.85" />
      <g transform="translate(312, 38)">
        <ellipse cx="-4" cy="-2" rx="3" ry="4.5" transform="rotate(-15 -4 -2)" fill="currentColor" />
        <ellipse cx="4" cy="-2" rx="3.2" ry="4.5" transform="rotate(15 4 -2)" fill="currentColor" />
        <ellipse cx="0" cy="-4.5" rx="3.2" ry="5" fill="currentColor" />
      </g>

      {/* Stem 6 - Right 5-petal daisy */}
      <path d="M 375 96 Q 378 64 373 35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 376 72 Q 386 68 388 74 Q 379 78 376 74" fill="currentColor" opacity="0.85" />
      <path d="M 374 54 Q 364 50 362 56 Q 371 60 374 56" fill="currentColor" opacity="0.85" />
      <g transform="translate(373, 32)">
        <circle cx="0" cy="-6.2" r="3.2" fill="currentColor" />
        <circle cx="5.9" cy="-1.9" r="3.2" fill="currentColor" />
        <circle cx="3.6" cy="5.1" r="3.2" fill="currentColor" />
        <circle cx="-3.6" cy="5.1" r="3.2" fill="currentColor" />
        <circle cx="-5.9" cy="-1.9" r="3.2" fill="currentColor" />
        <circle cx="0" cy="0" r="3.5" fill="currentColor" />
        <circle cx="0" cy="0" r="1.8" className="fill-zinc-100 dark:fill-zinc-950" />
      </g>

      {/* Stem 7 - Far-right graceful budding sprig */}
      <path d="M 418 96 Q 415 70 420 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 417 76 Q 407 72 405 78 Q 414 82 417 78" fill="currentColor" opacity="0.85" />
      <circle cx="420" cy="44" r="3.4" fill="currentColor" />
      <circle cx="425" cy="49" r="2.4" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

export function MonochromeFooter({ settings }: { settings: ISiteSettings }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 pt-16 sm:pt-24 pb-0 overflow-hidden">
      <div className="w-full">
        {/* Sprouting Botanical Flowers Crest */}
        <div className="relative h-16 sm:h-20 flex justify-center">
          {/* Botanical Flowers blooming out from behind the card rim */}
          <div className="absolute left-1/2 -bottom-[1px] -translate-x-1/2 z-0 pointer-events-none">
            <FooterBotanicalFlowers />
          </div>
        </div>

        {/* The Main Rounded Card with monochrome website colors */}
        <div className="relative z-10 rounded-t-[32px] sm:rounded-t-[44px] lg:rounded-t-[54px] border-t border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-100 via-zinc-100/90 to-zinc-200/50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black overflow-hidden pt-12 sm:pt-16 pb-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          {/* Halftone / Stipple Dot Matrix Texture Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12] dark:opacity-[0.16] text-zinc-950 dark:text-white"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
            aria-hidden="true"
          />

          {/* Social Links Row with elevated icon background badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 px-4 sm:px-8 font-mono text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            <a
              href={settings.linkedinUrl || "https://linkedin.com/in/kaiumallimon"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 hover:text-zinc-950 dark:hover:text-white transition-colors py-1"
            >
              <div className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 shadow-sm group-hover:border-zinc-400 dark:group-hover:border-zinc-700 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 group-hover:text-zinc-950 dark:group-hover:text-white transition-all">
                <RiLinkedinLine className="size-3.5 sm:size-4" />
              </div>
              <span className="hover:underline underline-offset-4">linkedin.com/in/kaiumallimon</span>
            </a>

            <a
              href={settings.githubUrl || "https://github.com/kaiumallimon"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 hover:text-zinc-950 dark:hover:text-white transition-colors py-1"
            >
              <div className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 shadow-sm group-hover:border-zinc-400 dark:group-hover:border-zinc-700 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 group-hover:text-zinc-950 dark:group-hover:text-white transition-all">
                <RiGithubLine className="size-3.5 sm:size-4" />
              </div>
              <span className="hover:underline underline-offset-4">github.com/kaiumallimon</span>
            </a>

            <a
              href={settings.twitterUrl || "https://x.com/kaiumallimon"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 hover:text-zinc-950 dark:hover:text-white transition-colors py-1"
            >
              <div className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 shadow-sm group-hover:border-zinc-400 dark:group-hover:border-zinc-700 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 group-hover:text-zinc-950 dark:group-hover:text-white transition-all">
                <RiTwitterXLine className="size-3.5 sm:size-4" />
              </div>
              <span className="hover:underline underline-offset-4">x.com/kaiumallimon</span>
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2.5 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer py-1"
            >
              <div className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 shadow-sm group-hover:border-zinc-400 dark:group-hover:border-zinc-700 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 group-hover:text-zinc-950 dark:group-hover:text-white transition-all">
                <ArrowUp className="size-3.5 sm:size-4 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="hover:underline underline-offset-4">Back to top</span>
            </button>
          </div>

          {/* Copyright Notice */}
          <div className="relative z-10 flex items-center justify-center mt-6 text-[10px] sm:text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
            <span>© {new Date().getFullYear()} Kaium Al Limon</span>
          </div>

          {/* Massive Faded Half-Visible Name in Tiny5 Font */}
          <div className="relative z-10 w-full overflow-hidden flex items-center justify-center text-center pointer-events-none select-none mt-2 sm:mt-4">
            <span className="font-tiny5 text-[72px] sm:text-[120px] md:text-[170px] lg:text-[220px] xl:text-[270px] font-normal leading-[0.72] tracking-normal text-center text-zinc-900/[0.08] dark:text-zinc-100/[0.08] uppercase whitespace-nowrap translate-y-[33%] transition-all">
              LIMON
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
