"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { RiSearchLine } from "@remixicon/react";

interface HeaderProps {
  onOpenCommand?: () => void;
  starsCount?: number;
  coverRef?: React.RefObject<HTMLDivElement | null>;
}

export function MonochromeHeader({ onOpenCommand }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isContactPage = pathname === "/contact";

  const handleOpenSearch = () => {
    if (onOpenCommand) {
      onOpenCommand();
    } else {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        })
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Left: KAL monogram — always visible */}
        <div className="flex items-center">
          <Link
            href="/"
            prefetch={false}
            aria-label="Home"
            className="font-tiny5 text-xl tracking-[0.2em] pl-[0.2em] text-zinc-950 dark:text-zinc-50 select-none hover:opacity-80 transition-opacity"
          >
            KAL
          </Link>
        </div>

        {/* Right Navigation & Controls */}
        <div className="flex items-center">
          {/* Homepage section nav URLs & Contact page */}
          <nav className="flex items-center gap-3 sm:gap-4.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 mr-2 sm:mr-3">
            <a
              href={isHomePage ? "#about" : "/#about"}
              className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            >
              About
            </a>
            <a
              href={isHomePage ? "#projects" : "/#projects"}
              className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            >
              Projects
            </a>
            <a
              href={isHomePage ? "#experience" : "/#experience"}
              className="hidden sm:inline-block hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            >
              Experience
            </a>
            <a
              href={isHomePage ? "#stack" : "/#stack"}
              className="hidden md:inline-block hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
            >
              Stack
            </a>
            <Link
              href="/contact"
              prefetch={false}
              className={`hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors ${
                isContactPage
                  ? "text-zinc-950 dark:text-zinc-100 font-semibold"
                  : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Search trigger with hairline border & soft background */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/90 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-all cursor-pointer shadow-2xs select-none"
            title="Search / Command Palette (⌘K)"
            aria-label="Search or open command palette"
          >
            <RiSearchLine className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span className="hidden md:inline font-mono text-[11px] text-zinc-500 dark:text-zinc-400">Search</span>
            <kbd className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/80 px-1 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60 leading-none">
              ⌘K
            </kbd>
          </button>

          {/* Vertical Separator: equal margin from left and right */}
          <div
            className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-2.5 sm:mx-3 shrink-0"
            aria-hidden="true"
          />

          {/* Dark Theme Switcher */}
          <div className="flex items-center shrink-0">
            <ThemeToggle appearance="segmented" size="small" />
          </div>
        </div>
      </div>
    </header>
  );
}
