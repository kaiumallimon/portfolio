"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/application/theme/theme-toggle";
import { RiSearchLine, RiMenuLine } from "@remixicon/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface HeaderProps {
  onOpenCommand?: () => void;
  starsCount?: number;
  coverRef?: React.RefObject<HTMLDivElement | null>;
}

const NAV_ITEMS = [
  { label: "About", href: "#about", id: "about" },
  { label: "Stack", href: "#stack", id: "stack" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Recognition", href: "#recognition", id: "recognition" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export function MonochromeHeader({ onOpenCommand }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Mobile navigation handler: closes sheet and smoothly scrolls to section
  const handleMobileNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    if (isHomePage) {
      e.preventDefault();
      setMobileMenuOpen(false);
      // Timeout allows Radix Sheet overlay and scroll-lock to dismiss smoothly
      setTimeout(() => {
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
      }, 150);
    } else {
      setMobileMenuOpen(false);
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
          {/* Desktop Navigation: sequentially arranged according to available sections */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-xs font-medium text-zinc-600 dark:text-zinc-400 mr-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={isHomePage ? item.href : `/${item.href}`}
                onClick={(e) => handleSectionScroll(e, item.id)}
                className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
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
            <span className="hidden sm:inline font-mono text-[11px] text-zinc-500 dark:text-zinc-400">Search</span>
            <kbd className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/80 px-1 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-700/60 leading-none">
              ⌘K
            </kbd>
          </button>

          {/* Vertical Separator: equal margin from left and right */}
          <div
            className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-2 sm:mx-2.5 shrink-0"
            aria-hidden="true"
          />

          {/* Dark Theme Switcher */}
          <div className="flex items-center shrink-0">
            <ThemeToggle appearance="segmented" size="small" />
          </div>

          {/* Mobile Sheet + Hamburger Menu (< md) */}
          <div className="flex md:hidden items-center ml-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center size-8 rounded-md border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/90 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-all cursor-pointer shadow-2xs select-none"
                  aria-label="Open navigation menu"
                >
                  <RiMenuLine className="size-4" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between"
              >
                <div>
                  <SheetHeader className="p-0 text-left border-b border-zinc-200 dark:border-zinc-800 pb-4 pr-8">
                    <Link
                      href="/"
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        handleLogoClick(e);
                      }}
                      prefetch={false}
                      className="font-tiny5 text-2xl tracking-[0.2em] pl-[0.2em] text-zinc-950 dark:text-zinc-50 select-none hover:opacity-80 transition-opacity"
                    >
                      KAL
                    </Link>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Sequential navigation links for portfolio sections
                    </SheetDescription>
                  </SheetHeader>

                  {/* Sequential section navigation links */}
                  <nav className="flex flex-col space-y-1.5 pt-6">
                    {NAV_ITEMS.map((item, index) => (
                      <a
                        key={item.id}
                        href={isHomePage ? item.href : `/${item.href}`}
                        onClick={(e) => handleMobileNavClick(e, item.id)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono">
                            0{index + 1}
                          </span>
                          <span className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50">
                            {item.label}
                          </span>
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 group-hover:translate-x-0.5 transition-all">
                          →
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Footer Info */}
                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-2 font-mono text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span className="text-zinc-700 dark:text-zinc-300 text-[11px]">Available for work</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    Kaium Al Limon // Full-Stack
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
