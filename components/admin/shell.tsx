"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
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
  LogOut,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { browserSupabase } from "@/lib/supabase/browser";
import GlobalSearch from "@/components/global-search";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  external?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const SUBTITLES: Record<string, string> = {
  "/admin": "Overview of your portfolio content",
  "/admin/system-activity": "System telemetry, login attempts & audit logs",
  "/admin/projects": "Manage your showcased projects",
  "/admin/achievements": "Manage awards and competition results",
  "/admin/activities": "Manage co-curricular activities and roles",
  "/admin/education": "Manage your education history",
  "/admin/skills": "Manage skill categories and tools",
  "/admin/hobbies": "Manage personal hobbies",
  "/admin/metrics": "Manage impact metrics",
  "/admin/settings": "Manage site settings and profile",
  "/admin/messages": "Manage contact form messages",
};

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/system-activity", label: "System Activity", icon: ShieldAlert },
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

const HEADER_NAV = [
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Impact", href: "/#impact" },
  { name: "Projects", href: "/projects" },
  { name: "Open Source", href: "/#contributions" },
  { name: "Activities", href: "/#activities" },
  { name: "Achievements", href: "/#achievements" },
  { name: "Tools", href: "/tools" },
  { name: "Contact", href: "/#contact" },
];

export default function AdminShell({
  email,
  profileImage,
  children,
}: {
  email: string;
  profileImage?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleSignOut = async () => {
    setSignOutLoading(true);
    await browserSupabase.auth.signOut();
    setSignOutLoading(false);
    setSignOutOpen(false);
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const activeFor = (item: NavItem) => isActive(item.href, item.exact);

  const { title, subtitle } = (() => {
    for (const g of NAV) {
      for (const it of g.items) {
        if (it.external) continue;
        if (isActive(it.href, it.exact)) {
          return { title: it.label, subtitle: SUBTITLES[it.href] ?? "" };
        }
      }
    }
    return { title: "Dashboard", subtitle: "Overview of your portfolio content" };
  })();

  const initials = (email?.charAt(0) || "A").toUpperCase();

  const renderBrand = () => (
    <Link href="/admin" className="flex items-center gap-2">
      <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#6366f1]">
        {profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profileImage} alt="Logo" className="size-6 rounded-full object-cover" />
        ) : (
          <span className="text-[10px] font-bold text-white">{initials}</span>
        )}
      </div>
      <span className="font-bricolage text-base font-semibold">Portfolio</span>
    </Link>
  );

  const renderSidebar = ({ onNavigate }: { onNavigate?: () => void }) => (
    <aside data-lenis-prevent="true" className="flex h-full w-56 flex-col rounded-4xl border border-border bg-card overscroll-contain">
      <div className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileImage} alt="Admin" className="size-9 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-sm font-medium text-white">
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none truncate">Admin</p>
              <span className="shrink-0 rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Admin
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground truncate">{email}</p>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground/60">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav data-lenis-prevent="true" className="admin-sidebar-scroll flex-1 overflow-y-auto overscroll-contain px-3 py-2">
        {NAV.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-2 text-xs font-medium text-muted-foreground/80">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeFor(item);
                const base = cn(
                  "flex items-center gap-3 rounded-4xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#6366f1]/35 text-foreground dark:bg-[#6366f1]/10 dark:text-[#6366f1]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                );
                return item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={onNavigate}
                    className={base}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} onClick={onNavigate} className={base}>
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="my-4 h-px bg-border/50" />
          </div>
        ))}
      </nav>

      <div className="border-t border-border/50 p-3">
        <div className="mb-3">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-medium text-muted-foreground">Theme</span>
            {mounted && (
              <div className="flex items-center gap-1 rounded-4xl border border-border p-1">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-4xl transition-colors",
                    theme === "light"
                      ? "bg-[#6366f1] text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Light theme"
                >
                  <Sun className="size-3" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-4xl transition-colors",
                    theme === "dark"
                      ? "bg-[#6366f1] text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Dark theme"
                >
                  <Moon className="size-3" />
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-4xl transition-colors",
                    theme === "system"
                      ? "bg-[#6366f1] text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="System theme"
                >
                  <Monitor className="size-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setSignOutOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setSignOutOpen(true);
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-4xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen flex-col bg-background p-3">
      <header className="flex h-14 items-center justify-between rounded-4xl border border-border bg-card px-4">
        <div className="flex items-center gap-6">
          {renderBrand()}

          <nav className="hidden items-center gap-1 md:flex">
            {HEADER_NAV.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-4xl px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearch
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 rounded-4xl border border-border px-2.5 text-muted-foreground"
              >
                <Search className="size-4" />
                <span className="hidden md:inline">Search...</span>
                <kbd className="pointer-events-none hidden select-none rounded-4xl border border-border bg-muted px-1.5 text-[10px] font-medium md:inline">
                  ⌘K
                </kbd>
              </Button>
            }
          />
          <Button variant="ghost" size="icon" className="size-9 rounded-4xl" asChild>
            <Link href="/admin/messages" aria-label="Messages">
              <Bell className="size-4" />
            </Link>
          </Button>
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex size-9 items-center justify-center rounded-4xl border border-border text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 gap-3 overflow-hidden pt-3">
        <div className="hidden md:block">
          {renderSidebar({})}
        </div>

        <main className="admin-scroll flex-1 min-w-0 overflow-x-hidden overflow-y-auto rounded-4xl border border-border bg-card">
          <div className="px-6 py-8">
            <div className="-mx-6 border-b border-border pb-6">
              <div className="flex items-center justify-between gap-4 px-6">
                <div className="min-w-0">
                  <h1 className="font-bricolage text-2xl font-semibold tracking-tight">
                    {title}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                </div>
              </div>
            </div>
            <div className="pt-6">{children}</div>
          </div>
        </main>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileNavOpen ? "" : "pointer-events-none"
        )}
        aria-hidden={!mobileNavOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            mobileNavOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileNavOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 flex h-full w-60 flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300",
            mobileNavOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            {renderBrand()}
            <button
              onClick={() => setMobileNavOpen(false)}
              className="flex size-8 items-center justify-center rounded-4xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="min-h-0 flex-1 p-2">
            {renderSidebar({ onNavigate: () => setMobileNavOpen(false) })}
          </div>
        </div>
      </div>

      {signOutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-4xl bg-card p-6 shadow-md ring-1 ring-foreground/5">
            <h2 className="font-bricolage text-base font-medium text-card-foreground">
              Sign out
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Are you sure you want to sign out?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSignOutOpen(false)}
                className="inline-flex shrink-0 items-center justify-center rounded-4xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                disabled={signOutLoading}
                className="inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/20 disabled:pointer-events-none disabled:opacity-50"
              >
                {signOutLoading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
