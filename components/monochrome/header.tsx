"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
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

  // Smooth scroll to target section with sticky header offset
  const handleSectionScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 52;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  // Smooth scroll back to top when clicking KAL logo on homepage
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      window.history.pushState(null, "", "/");
    }
  };

  // If navigating to homepage with hash from another page, smooth scroll on arrival
  useEffect(() => {
    if (isHomePage && typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 52;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isHomePage]);

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
        {/* Left: KAL monogram — always visible, smooth scroll to top on homepage */}
        <div className="flex items-center">
          <Link
            href="/"
            onClick={handleLogoClick}
            prefetch={false}
            aria-label="Home"
            className="font-tiny5 text-xl tracking-[0.2em] pl-[0.2em] text-zinc-950 dark:text-zinc-50 select-none hover:opacity-80 transition-opacity cursor-pointer"
          >
            KAL
          </Link>
        </div>

        {/* Right Navigation & Controls */}
        <div className="flex items-center">
          {/* Homepage section nav URLs sequentially arranged according to available sections */}
          <nav className="flex items-center gap-3 sm:gap-4.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 mr-2 sm:mr-3">
            <a
              href={isHomePage ? "#about" : "/#about"}
              onClick={(e) => handleSectionScroll(e, "about")}
              className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              About
            </a>
            <a
              href={isHomePage ? "#stack" : "/#stack"}
              onClick={(e) => handleSectionScroll(e, "stack")}
              className="hidden sm:inline-block hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Stack
            </a>
            <a
              href={isHomePage ? "#experience" : "/#experience"}
              onClick={(e) => handleSectionScroll(e, "experience")}
              className="hidden md:inline-block hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Experience
            </a>
            <a
              href={isHomePage ? "#projects" : "/#projects"}
              onClick={(e) => handleSectionScroll(e, "projects")}
              className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Projects
            </a>
            <a
              href={isHomePage ? "#recognition" : "/#recognition"}
              onClick={(e) => handleSectionScroll(e, "recognition")}
              className="hidden lg:inline-block hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Recognition
            </a>
            <a
              href={isHomePage ? "#contact" : "/#contact"}
              onClick={(e) => handleSectionScroll(e, "contact")}
              className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Contact
            </a>
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
