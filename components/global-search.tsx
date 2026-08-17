"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Activity,
  GraduationCap,
  Code2,
  Gamepad2,
  BarChart3,
  Settings,
  Mail,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

interface NavSearchItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

const SEARCH_NAV: { label: string; items: NavSearchItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, external: false },
      { href: "/admin/system-activity", label: "System Activity", icon: ShieldAlert, external: false },
    ],
  },
  {
    label: "Content Management",
    items: [
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/achievements", label: "Achievements", icon: Award },
      { href: "/admin/activities", label: "Activities", icon: Activity },
      { href: "/admin/education", label: "Education", icon: GraduationCap },
      { href: "/admin/skills", label: "Skills", icon: Code2 },
      { href: "/admin/hobbies", label: "Hobbies", icon: Gamepad2 },
      { href: "/admin/metrics", label: "Metrics", icon: BarChart3 },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/messages", label: "Messages", icon: Mail },
      { href: "/", label: "View Site", icon: ExternalLink, external: true },
    ],
  },
];

interface GlobalSearchProps {
  trigger?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export default function GlobalSearch({
  trigger,
  placeholder = "Search anything...",
  className,
}: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (item: NavSearchItem) => {
    setOpen(false);
    setQuery("");
    if (item.external) {
      window.open(item.href, "_blank", "noreferrer");
    } else {
      router.push(item.href);
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      className={cn(
        "relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64",
        className
      )}
      onClick={() => setOpen(true)}
    >
      <Search className="mr-2 h-4 w-4" />
      <span className="hidden lg:inline-flex">Search anything...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );

  const triggerElement = trigger ? (
    <div onClick={() => setOpen(true)}>{trigger}</div>
  ) : (
    defaultTrigger
  );

  return (
    <>
      {triggerElement}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={placeholder} value={query} onValueChange={setQuery} />
        <CommandList>
          {!query && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <Search className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="font-medium">Start typing to search</p>
              <p className="text-xs text-muted-foreground/80">
                Search across your admin pages and navigation
              </p>
            </div>
          )}
          <CommandEmpty>No results found.</CommandEmpty>
          {SEARCH_NAV.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={`${group.label}-${item.href}`}
                    value={`${item.label} ${group.label}`}
                    onSelect={() => handleSelect(item)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
