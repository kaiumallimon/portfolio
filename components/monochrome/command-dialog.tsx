"use client";

import { useEffect } from "react";
import { Command } from "cmdk";
import {
  RiSearchLine,
  RiMoonLine,
  RiSunLine,
  RiGithubLine,
  RiLinkedinLine,
  RiMailLine,
  RiFileTextLine,
  RiTerminalBoxLine,
} from "@remixicon/react";
import { toast } from "sonner";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY } from "@/components/application/theme/theme-toggle";

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MonochromeCommandDialog({ open, onOpenChange }: CommandDialogProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  const runAction = (fn: () => void) => {
    fn();
    onOpenChange(false);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT));
    toast.success(`Theme switched to ${next} mode`);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("kaiumallimon@gmail.com");
    toast.success("Email copied to clipboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/50 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange(false)}
      />
      <div
        data-lenis-prevent
        className="relative w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden z-10 font-sans"
      >
        <Command className="w-full">
          <div className="flex items-center px-3 border-b border-zinc-200 dark:border-zinc-800">
            <RiSearchLine className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search..."
              className="w-full py-3 text-xs font-mono bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              ESC
            </kbd>
          </div>

          <Command.List data-lenis-prevent className="max-h-72 overflow-y-auto p-2 text-xs font-mono space-y-1">
            <Command.Empty className="py-6 text-center text-zinc-500 text-xs font-mono">
              No matching commands.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-[10px] uppercase text-zinc-400 px-2 py-1 font-semibold">
              <Command.Item
                onSelect={() => runAction(() => { window.location.hash = "overview"; })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <span>Overview</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.location.hash = "projects"; })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <span>Selected Works</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.location.hash = "tools"; })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <span>Interactive Showcase</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.location.hash = "experience"; })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <span>Experience Timeline</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.location.hash = "contact"; })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <span>Get in touch</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Tools & Utilities" className="text-[10px] uppercase text-zinc-400 px-2 py-1 font-semibold pt-2">
              <Command.Item
                onSelect={() => runAction(() => { window.location.href = "/tools/uiu-exam-routine"; })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <RiTerminalBoxLine className="w-3.5 h-3.5 text-zinc-400" />
                <span>Launch UIU Routine Finder</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.location.href = "/tools/github-unwrapped"; })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <RiTerminalBoxLine className="w-3.5 h-3.5 text-zinc-400" />
                <span>Launch GitHub Unwrapped</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.location.href = "/tools/uiu-cgpa-calculator"; })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <RiTerminalBoxLine className="w-3.5 h-3.5 text-zinc-400" />
                <span>Launch CGPA Calculator</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Preferences & Actions" className="text-[10px] uppercase text-zinc-400 px-2 py-1 font-semibold pt-2">
              <Command.Item
                onSelect={() => runAction(toggleTheme)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <RiSunLine className="w-3.5 h-3.5 text-zinc-400 dark:hidden" />
                <RiMoonLine className="w-3.5 h-3.5 text-zinc-400 hidden dark:inline" />
                <span>Toggle Light / Dark Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(copyEmail)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <RiMailLine className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Email (kaiumallimon@gmail.com)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.open("/resume.pdf", "_blank"); })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <RiFileTextLine className="w-3.5 h-3.5 text-zinc-400" />
                <span>View Resume / CV</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.open("https://github.com/kaiumallimon", "_blank"); })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <RiGithubLine className="w-3.5 h-3.5 text-zinc-400" />
                <span>Open GitHub Profile</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runAction(() => { window.open("https://linkedin.com/in/kaiumallimon", "_blank"); })}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                <RiLinkedinLine className="w-3.5 h-3.5 text-zinc-400" />
                <span>Open LinkedIn Profile</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
