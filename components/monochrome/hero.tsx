"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowUpRight, Volume2, Check, Copy, CheckCheck } from "lucide-react";
import {
  RiTwitterXLine,
  RiGithubLine,
  RiLinkedinLine,
  RiDiscordLine,
  RiYoutubeLine,
  RiCodeSSlashLine,
  RiLightbulbLine,
  RiMapPinLine,
  RiTimeLine,
  RiMailLine,
  RiGlobalLine,
  RiPhoneLine,
  RiUserSmileLine,
  RiArticleLine,
} from "@remixicon/react";
import { toast } from "sonner";
import { PixelLogo } from "./pixel-logo";
import { ISiteSettings } from "@/lib/models";

// Synthesized name chime matching chanhdai's signature sound
function playAudioChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch {}
}

export function MonochromeHero({ settings }: { settings: ISiteSettings }) {
  const [timeString, setTimeString] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: settings.timezone || "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now);
        setTimeString(formatted);
      } catch {
        setTimeString(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
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

  const copyUrl = () => {
    navigator.clipboard.writeText("https://kaiumallimon.tech");
    setCopiedUrl(true);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const socialRow1 = [
    {
      name: "X",
      icon: <RiTwitterXLine className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />,
      url: settings.twitterUrl || "https://x.com/kaiumallimon",
    },
    {
      name: "GitHub",
      icon: <RiGithubLine className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />,
      url: settings.githubUrl || "https://github.com/kaiumallimon",
    },
    {
      name: "LinkedIn",
      icon: <RiLinkedinLine className="w-4 h-4 text-[#0077b5]" />,
      url: settings.linkedinUrl || "https://linkedin.com/in/kaiumallimon",
    },
  ];

  const socialRow2 = [
    {
      name: "daily.dev",
      icon: <RiArticleLine className="w-4 h-4 text-[#9055ff]" />,
      url: "https://daily.dev",
    },
    {
      name: "Discord",
      icon: <RiDiscordLine className="w-4 h-4 text-[#5865f2]" />,
      url: "https://discord.com",
    },
    {
      name: "YouTube",
      icon: <RiYoutubeLine className="w-4 h-4 text-[#ff0000]" />,
      url: "https://youtube.com",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-zinc-950">
      {/* 1. Dimension indicator at top of canvas (1024 width marker) */}
      <div className="hidden sm:flex items-center px-4 h-8 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 select-none">
        <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-px" />
        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 px-3 tabular-nums">
          1024
        </span>
        <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 h-px" />
      </div>

      {/* 2. Large Pixel Monogram [KL] Centered */}
      <div className="py-8 sm:py-10 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
        <PixelLogo size={44} />
      </div>

      {/* 3. Profile Avatar & Name Block matching chanhdai.com */}
      <div className="p-4 sm:p-6 flex items-start sm:items-center gap-4 sm:gap-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 border border-zinc-300 dark:border-zinc-700 ring-2 ring-zinc-100 dark:ring-zinc-900 bg-zinc-100 dark:bg-zinc-900">
          <Image
            src="/bordered.png"
            alt={settings.name}
            fill
            sizes="120px"
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-1">
          {/* Quirky Monospace Tailwind class annotation from chanhdai */}
          <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 select-none">
            text-3xl text-zinc-950 font-medium
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
              {settings.name}
            </h1>

            {/* Blue Verified Badge */}
            <span
              className="w-4.5 h-4.5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs"
              title="Verified Design & Systems Engineer"
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </span>

            {/* Audio Chime Button */}
            <button
              onClick={() => {
                playAudioChime();
                toast.success("Name chime played");
              }}
              className="p-1 text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Pronounce name"
              aria-label="Pronounce name"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="font-mono text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Open Source Contributor & Design Engineer
          </p>
        </div>
      </div>

      {/* 4. Signature 2-Column Hairline Metadata Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-zinc-200 dark:border-zinc-800 sm:divide-x divide-zinc-200 dark:divide-zinc-800 text-xs sm:text-sm font-mono">
        {/* Left Column */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiCodeSSlashLine className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-700 dark:text-zinc-300">
              Design Engineer <span className="text-zinc-400">@</span>UIU
            </span>
          </div>

          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiLightbulbLine className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-700 dark:text-zinc-300">
              Founder <span className="text-zinc-400">@</span>Routine Finder
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

          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiPhoneLine className="w-3.5 h-3.5" />
            </div>
            <a
              href="tel:+8801839520929"
              className="text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              +880 183 952 0929
            </a>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <RiGlobalLine className="w-3.5 h-3.5" />
              </div>
              <a
                href="https://kaiumallimon.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-700 dark:text-zinc-300 hover:underline"
              >
                kaiumallimon.tech
              </a>
            </div>
            <button
              onClick={copyUrl}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-1 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
              title="Copy URL"
            >
              {copiedUrl ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-t sm:border-t-0 border-zinc-200 dark:border-zinc-800">
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiTimeLine className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-700 dark:text-zinc-300 tabular-nums">
              {timeString || "17:05"} <span className="text-zinc-400">// Dhaka (GMT+6)</span>
            </span>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                <RiMailLine className="w-3.5 h-3.5" />
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="text-zinc-700 dark:text-zinc-300 hover:underline truncate max-w-[180px] sm:max-w-none"
              >
                {settings.email}
              </a>
            </div>
            <button
              onClick={copyEmail}
              className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-1 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
              title="Copy email address"
            >
              {copiedEmail ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
              <RiUserSmileLine className="w-3.5 h-3.5" />
            </div>
            <span className="text-zinc-700 dark:text-zinc-300">
              he/him
            </span>
          </div>

          {/* Empty spacer rows to align table height seamlessly */}
          <div className="hidden sm:flex px-4 py-2.5 items-center gap-3 text-transparent select-none">
            <div className="size-6" />
            <span>—</span>
          </div>
          <div className="hidden sm:flex px-4 py-2.5 items-center gap-3 text-transparent select-none">
            <div className="size-6" />
            <span>—</span>
          </div>
        </div>
      </div>

      {/* 5. 6-Card Social Links Grid (3 columns x 2 rows) matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
        {socialRow1.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.name}
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
        {socialRow2.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.name}
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>
    </section>
  );
}
