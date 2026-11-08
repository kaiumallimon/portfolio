"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowUpRight, Volume2, Check } from "lucide-react";
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

// Gentle synthesized chime on audio button click (matching chanhdai's signature)
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
  const [copied, setCopied] = useState<boolean>(false);

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
    setCopied(true);
    toast.success("Email address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
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
    <section className="pt-8 pb-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        {/* 1. Large Pixel Logo [KL] matching chanhdai.com [CD] */}
        <PixelLogo size={42} />

        {/* 2. Profile Avatar + Verified Name Block */}
        <div className="flex items-center gap-4">
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shrink-0">
            <Image
              src="/bordered.png"
              alt={settings.name}
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
                {settings.name}
              </h1>

              {/* Blue Verified Badge */}
              <span
                className="w-4.5 h-4.5 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs"
                title="Verified Design & Software Engineer"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>

              {/* Audio Chime Button */}
              <button
                onClick={() => {
                  playAudioChime();
                  toast.success("Name chime played");
                }}
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                title="Pronounce / Audio Chime"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans">
              Full-Stack & Design Engineer · Open Source Contributor
            </p>
          </div>
        </div>

        {/* 3. The Signature 2-Column Info Table (matching Screenshot 1) */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden text-xs font-sans divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <RiCodeSSlashLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Full-Stack & Design Engineer @Freelance</span>
            </div>
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <RiLightbulbLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Founder @kaium.dev</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <RiLightbulbLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Student @United International University (UIU)</span>
            </div>
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <span className="text-zinc-400 font-mono text-[11px] shrink-0">B.Sc.</span>
              <span>Computer Science & Engineering</span>
            </div>
          </div>

          {/* Row 3: Location + Live Ticking Clock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <RiMapPinLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-mono">
              <RiTimeLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="tabular-nums font-medium">{timeString || "16:35"}</span>
              <span className="text-zinc-400 font-sans">// Local Time (GMT+6)</span>
            </div>
          </div>

          {/* Row 4: Contact & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-mono">
              <RiPhoneLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>+880 1700 000 000</span>
            </div>
            <button
              onClick={copyEmail}
              className="px-3.5 py-2.5 flex items-center justify-between text-zinc-700 dark:text-zinc-300 font-mono hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RiMailLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <span className="text-[10px] text-zinc-400 uppercase font-sans">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>

          {/* Row 5: Domain & Pronouns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-mono">
              <RiGlobalLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <a href="https://kaiumallimon.tech" target="_blank" rel="noopener noreferrer" className="hover:underline">
                kaiumallimon.tech
              </a>
            </div>
            <div className="px-3.5 py-2.5 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <RiUserSmileLine className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>he / him</span>
            </div>
          </div>
        </div>

        {/* 4. Social Links Grid (3 columns x 2 rows, matching Screenshot 1) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  {item.name}
                </span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
