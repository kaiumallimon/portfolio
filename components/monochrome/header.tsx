"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { RiSearchLine, RiGithubLine } from "@remixicon/react";
import { useEffect, useState } from "react";

interface HeaderProps {
  onOpenCommand?: () => void;
  starsCount?: number;
  coverRef?: React.RefObject<HTMLDivElement | null>;
}

export function MonochromeHeader({
  onOpenCommand,
  starsCount = 147,
  coverRef,
}: HeaderProps) {
  const pathname = usePathname();
  // Hero cover only exists on the home page
  const isHomePage = pathname === "/";

  // On other pages (without hero cover), KAL is always visible (1)
  // On home page (with hero cover), KAL starts hidden (0) until scrolled past the cover
  const [progress, setProgress] = useState(isHomePage ? 0 : 1);

  useEffect(() => {
    // If not on home page or coverRef is not passed, no scroll tracking needed
    if (!isHomePage || !coverRef) {
      return;
    }

    const updateProgress = () => {
      const el = coverRef.current;
      if (!el) {
        setProgress(window.scrollY > 40 ? 1 : 0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const headerH = 48; // h-12 = 48px
      // Begin transition when cover bottom reaches 1.5× header height from top
      // Complete transition when cover bottom reaches 0.25× header height
      const start = headerH * 1.5;
      const end = headerH * 0.25;
      if (rect.bottom >= start) {
        setProgress(0);
      } else if (rect.bottom <= end) {
        setProgress(1);
      } else {
        setProgress(1 - (rect.bottom - end) / (start - end));
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [coverRef, isHomePage]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Left: KAL monogram — hidden only on hero cover, always visible on all other pages */}
        <div className="overflow-hidden h-8 flex items-center">
          <Link
            href="/"
            prefetch={false}
            aria-label="Home"
            style={{
              opacity: isHomePage ? progress : 1,
              transform: isHomePage
                ? `translateY(${(1 - progress) * 16}px)`
                : "none",
              willChange: isHomePage ? "opacity, transform" : "auto",
            }}
            className="font-tiny5 text-xl tracking-[0.2em] pl-[0.2em] text-zinc-950 dark:text-zinc-50 select-none transition-[opacity,transform] duration-75 ease-out"
          >
            KAL
          </Link>
        </div>

        {/* Right Navigation */}
        <nav className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/"
            prefetch={false}
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            Home
          </Link>
          <a
            href={isHomePage ? "#projects" : "/#projects"}
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            UI
          </a>
          <a
            href={isHomePage ? "#tools" : "/#tools"}
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            Tools
          </a>

          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
              title="Command Palette (Cmd+K)"
            >
              <RiSearchLine className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] tabular-nums">⌘K</span>
            </button>
          )}

          <a
            href="https://github.com/kaiumallimon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors px-1.5 py-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <RiGithubLine className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] tabular-nums">
              {starsCount >= 1000 ? `${(starsCount / 1000).toFixed(1)}k` : `${starsCount}`}
            </span>
          </a>

          <div className="flex items-center pl-1 border-l border-zinc-200 dark:border-zinc-800">
            <ThemeToggle appearance="segmented" size="small" />
          </div>
        </nav>
      </div>
    </header>
  );
}
