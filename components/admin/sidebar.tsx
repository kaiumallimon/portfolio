"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { browserSupabase } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Trophy,
  Activity,
  GraduationCap,
  Wrench,
  Gamepad2,
  BarChart3,
  Settings,
  Mail,
  ShieldAlert,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/system-activity", label: "System Activity", icon: ShieldAlert },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/activities", label: "Activities", icon: Activity },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/hobbies", label: "Hobbies", icon: Gamepad2 },
  { href: "/admin/metrics", label: "Metrics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await browserSupabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside data-lenis-prevent="true" className="w-60 shrink-0 border-r border-white/10 bg-slate-900/40 backdrop-blur-md h-screen sticky top-0 flex flex-col overscroll-contain">
      <div className="p-5 border-b border-white/10">
        <p className="text-sm font-semibold text-white">Portfolio Admin</p>
        <p className="text-xs text-slate-500 truncate mt-1">{email}</p>
      </div>

      <nav data-lenis-prevent="true" className="flex-1 p-3 space-y-1 overflow-y-auto overscroll-contain">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 w-full transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
