"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { RiSearchLine, RiGithubLine } from "@remixicon/react";

interface HeaderProps {
  onOpenCommand?: () => void;
  starsCount?: number;
}

export function MonochromeHeader({ onOpenCommand, starsCount = 140 }: HeaderProps) {
  return (
    <header className="w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between">
        {/* Left: subtle home indicator */}
        <Link
          href="/"
          className="text-xs font-mono font-bold tracking-wider text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity"
        >
          kaium.dev
        </Link>

        {/* Right Nav Row matching chanhdai.com */}
        <nav className="flex items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Home
          </Link>
          <a
            href="#projects"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            UI
          </a>
          <a
            href="#tools"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Tools
          </a>

          {/* Search / Command Palette shortcut (Q ⌘ K) */}
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="Command Palette (Cmd+K)"
            >
              <RiSearchLine className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">⌘ K</span>
            </button>
          )}

          {/* GitHub Star Badge */}
          <a
            href="https://github.com/kaiumallimon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            title="GitHub profile & stars"
          >
            <RiGithubLine className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] tabular-nums">
              {starsCount >= 1000 ? `${(starsCount / 1000).toFixed(1)}k` : `${starsCount}+`}
            </span>
          </a>

          {/* BoardUI Theme Toggle (Sun / Moon) */}
          <div className="flex items-center">
            <ThemeToggle appearance="segmented" size="small" />
          </div>
        </nav>
      </div>
    </header>
  );
}
