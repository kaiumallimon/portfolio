"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ClientOnlyDialog } from "@/components/client-only-dialog";
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
  ExternalLink,
  LogOut,
  User,
  ChevronDown,
  Menu,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MobileMenuProvider } from "@/components/mobile-menu-context";
import { FrostedHeader } from "@/components/custom/frosted-header";
import { browserSupabase } from "@/lib/supabase/browser";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  external?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
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

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await browserSupabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const activeFor = (item: NavItem) => isActive(item.href, item.exact);

  const title = (() => {
    for (const g of NAV) {
      for (const it of g.items) {
        if (it.external) continue;
        if (isActive(it.href, it.exact)) return it.label;
      }
    }
    return "Dashboard";
  })();

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/40 p-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-md shrink-0">
            P
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold leading-none truncate">Portfolio</span>
            <span className="text-xs text-muted-foreground truncate">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Content - Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 scrollbar-hide">
        {NAV.map((group) => (
          <div key={group.label}>
            <div className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider px-2 mb-2 truncate">
              {group.label}
            </div>
            <div>
              {group.items.map((item, i) => {
                const Icon = item.icon;
                const active = activeFor(item);
                const base = `flex items-center gap-3 min-w-0 overflow-hidden rounded-md p-2 text-sm transition-all duration-200 hover:bg-primary/30 ${
                  active ? "bg-primary text-primary-foreground font-semibold" : ""
                }`;
                return (
                  <div className={i > 0 ? "mt-1" : ""} key={item.href}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className={base}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="font-medium truncate">{item.label}</span>
                      </a>
                    ) : (
                      <Link href={item.href} onClick={onLinkClick} className={base}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="font-medium truncate">{item.label}</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="my-4 h-px bg-border"></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 p-4 shrink-0 overflow-hidden">
        {/* Theme Toggle */}
        <div className="mb-3 overflow-hidden">
          <div className="flex items-center justify-between min-w-0">
            <span className="text-xs font-medium text-muted-foreground truncate">Theme</span>
            {mounted && (
              <div className="flex items-center rounded-md border p-1 shrink-0">
                <button
                  className={`h-6 w-6 p-0 shrink-0 rounded-sm flex items-center justify-center transition-colors ${
                    theme === "light" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setTheme("light")}
                  aria-label="Light theme"
                >
                  <Sun className="h-3 w-3" />
                </button>
                <button
                  className={`h-6 w-6 p-0 shrink-0 rounded-sm flex items-center justify-center transition-colors ${
                    theme === "dark" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setTheme("dark")}
                  aria-label="Dark theme"
                >
                  <Moon className="h-3 w-3" />
                </button>
                <button
                  className={`h-6 w-6 p-0 shrink-0 rounded-sm flex items-center justify-center transition-colors ${
                    theme === "system" ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setTheme("system")}
                  aria-label="System theme"
                >
                  <Monitor className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <ClientOnlyDialog
          trigger={
            <button className="w-full flex items-center justify-start gap-3 p-3 rounded-md hover:bg-primary/30 transition-colors overflow-hidden border-0 bg-transparent cursor-pointer">
              <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shrink-0 ring-2 ring-border">
                  {(email.charAt(0) || "A").toUpperCase()}
                </div>
                <div className="flex flex-col items-start min-w-0 overflow-hidden">
                  <span className="text-sm font-medium truncate max-w-full">{email}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-full">Admin</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </button>
          }
          title={
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Menu
            </div>
          }
          description="Manage your account settings and preferences."
        >
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="destructive" onClick={handleSignOut} className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </ClientOnlyDialog>
      </div>
    </div>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-screen bg-background overflow-hidden fixed inset-0">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-64 border-r border-border/40 bg-card overflow-hidden">
          <SidebarContent />
        </div>

        {/* Mobile Drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Main navigation menu for the application</SheetDescription>
            </SheetHeader>
            <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20">
            <FrostedHeader title={title} onMobileMenuToggle={() => setMobileMenuOpen(true)} />
            <MobileMenuProvider toggleMobileMenu={() => setMobileMenuOpen(true)}>
              {children}
            </MobileMenuProvider>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
