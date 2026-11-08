"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { RiSearchLine, RiGithubLine } from "@remixicon/react";

interface HeaderProps {
  onOpenCommand?: () => void;
  starsCount?: number;
}

export function MonochromeHeader({ onOpenCommand, starsCount = 147 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Left: subtle brand mark */}
        <Link
          href="/"
          className="text-xs font-mono font-medium tracking-tight text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity flex items-center gap-2"
        >
          <span className="font-semibold">kaium.dev</span>
        </Link>

        {/* Right Navigation matching chanhdai.com */}
        <nav className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            Home
          </Link>
          <a
            href="#projects"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            UI
          </a>
          <a
            href="#tools"
            className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            Tools
          </a>

          {/* Quick Search Shortcut (Q ⌘K) */}
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

          {/* GitHub Star / Repo Count */}
          <a
            href="https://github.com/kaiumallimon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors px-1.5 py-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
            title="GitHub profile & repository metrics"
          >
            <RiGithubLine className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] tabular-nums">
              {starsCount >= 1000 ? `${(starsCount / 1000).toFixed(1)}k` : `${starsCount}`}
            </span>
          </a>

          {/* Theme Switcher */}
          <div className="flex items-center pl-1 border-l border-zinc-200 dark:border-zinc-800">
            <ThemeToggle appearance="segmented" size="small" />
          </div>
        </nav>
      </div>
    </header>
  );
}
