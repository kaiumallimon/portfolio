"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ThreadItem = {
  email: string;
  name: string | null;
  unread: number;
  preview: string;
  lastCreatedAt: string;
  messages: { id: string; message: string | null; created_at: string; read: boolean }[];
};

function fmt(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function MessageThreadList({
  threads,
  activeEmail,
  onSelect,
}: {
  threads: ThreadItem[];
  activeEmail?: string;
  onSelect: (email: string) => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return threads;
    return threads.filter(
      (t) =>
        (t.name ?? "").toLowerCase().includes(ql) ||
        (t.email ?? "").toLowerCase().includes(ql) ||
        t.messages.some((m) => (m.message ?? "").toLowerCase().includes(ql))
    );
  }, [q, threads]);

  return (
    <div className="border-b md:border-b-0 md:border-r border-border flex flex-col min-h-0">
      {/* Search */}
      <div className="relative p-3 border-b border-border shrink-0">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search conversations..."
          className="pl-9 pr-9"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="overflow-y-auto max-h-[64vh] md:max-h-none flex-1">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            {q ? "No conversations match your search." : "No messages yet."}
          </p>
        ) : (
          filtered.map((t) => {
            const active = t.email === activeEmail;
            return (
              <button
                key={t.email}
                type="button"
                onClick={() => onSelect(t.email)}
                className={cn(
                  "w-full text-left flex items-start gap-3 p-4 border-b border-border transition-colors",
                  active ? "bg-primary/10" : "hover:bg-muted/40"
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                    t.unread > 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {(t.name || t.email || "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{t.name || "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{fmt(t.lastCreatedAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                  <p className="text-sm text-muted-foreground truncate mt-1">{t.preview}</p>
                </div>
                {t.unread > 0 && (
                  <span className="shrink-0 mt-1 h-2 w-2 rounded-full bg-primary" title={`${t.unread} unread`} />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
