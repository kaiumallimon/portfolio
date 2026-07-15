"use client";

import { useEffect, useState } from "react";
import { browserSupabase } from "@/lib/supabase/browser";
import { markThreadRead } from "@/app/admin/actions";
import { MessageThreadList, type ThreadItem } from "@/components/admin/message-thread-list";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, CheckCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  name: string | null;
  email: string;
  message: string | null;
  read: boolean;
  created_at: string;
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

function sortByLatest(threads: ThreadItem[]) {
  return [...threads].sort(
    (a, b) => new Date(b.lastCreatedAt).getTime() - new Date(a.lastCreatedAt).getTime()
  );
}

// Recompute derived thread fields from its (possibly updated) messages.
function recompute(t: ThreadItem): ThreadItem {
  const messages = [...t.messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const last = messages[messages.length - 1];
  return {
    ...t,
    messages,
    lastCreatedAt: last?.created_at ?? t.lastCreatedAt,
    preview: (last?.message ?? "").slice(0, 80),
    unread: messages.filter((m) => !m.read).length,
  };
}

export function MessagesInbox({
  initialThreads,
  initialActiveEmail,
}: {
  initialThreads: ThreadItem[];
  initialActiveEmail?: string;
}) {
  const [threads, setThreads] = useState<ThreadItem[]>(initialThreads);
  const [activeEmail, setActiveEmail] = useState<string | undefined>(initialActiveEmail);
  const [live, setLive] = useState(false);

  // Real-time sync: one channel, no polling, no reload.
  useEffect(() => {
    const channel = browserSupabase
      .channel("contact_messages_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const row = payload.new as Row;
            setThreads((prev) => {
              const idx = prev.findIndex((t) => t.email === row.email);
              const item = { id: row.id, message: row.message, created_at: row.created_at, read: row.read };
              if (idx === -1) {
                const t: ThreadItem = {
                  email: row.email,
                  name: row.name,
                  unread: row.read ? 0 : 1,
                  preview: (row.message ?? "").slice(0, 80),
                  lastCreatedAt: row.created_at,
                  messages: [item],
                };
                return sortByLatest([...prev, t]);
              }
              const existing = prev[idx];
              if (existing.messages.some((m) => m.id === row.id)) return prev;
              const merged = { ...existing, messages: [...existing.messages, item] };
              const copy = [...prev];
              copy[idx] = recompute(merged);
              return sortByLatest(copy);
            });
          } else if (payload.eventType === "UPDATE") {
            const row = payload.new as Row;
            setThreads((prev) =>
              prev.map((t) => {
                if (t.email !== row.email) return t;
                const messages = t.messages.map((m) =>
                  m.id === row.id ? { ...m, message: row.message, read: row.read } : m
                );
                return recompute({ ...t, messages });
              })
            );
          } else if (payload.eventType === "DELETE") {
            const row = payload.old as { id: string; email: string };
            setThreads((prev) => {
              const next = prev
                .map((t) =>
                  t.email === row.email
                    ? recompute({ ...t, messages: t.messages.filter((m) => m.id !== row.id) })
                    : t
                )
                .filter((t) => t.messages.length > 0);
              return sortByLatest(next);
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setLive(true);
      });

    return () => {
      browserSupabase.removeChannel(channel);
    };
  }, []);

  const totalAll = threads.reduce((s, t) => s + t.messages.length, 0);
  const unreadAll = threads.reduce((s, t) => s + t.unread, 0);

  const activeThread = threads.find((t) => t.email === activeEmail) ?? null;
  const threadMessages = activeThread
    ? [...activeThread.messages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    : [];

  // Mark read: optimistic local update + server action (realtime UPDATE
  // events will also reconcile, so state stays correct even if out of sync).
  async function handleMarkRead(email: string) {
    setThreads((prev) =>
      prev.map((t) =>
        t.email === email
          ? { ...t, unread: 0, messages: t.messages.map((m) => ({ ...m, read: true })) }
          : t
      )
    );
    const fd = new FormData();
    fd.set("email", email);
    await markThreadRead(fd);
  }

  return (
    <div className="space-y-6">
      {/* Stats (realtime) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={MessageSquare} title="Conversations" value={threads.length} />
        <StatsCard icon={Mail} title="Total Messages" value={totalAll} />
        <StatsCard
          icon={Mail}
          title="Unread"
          value={unreadAll}
          className={unreadAll > 0 ? "ring-1 ring-primary/40" : undefined}
        />
      </div>

      {/* Inbox */}
      <div className="rounded-xl border border-border/60 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Messages
          </h2>
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs text-muted-foreground",
              live && "text-green-600 dark:text-green-400"
            )}
            title={live ? "Realtime connected" : "Connecting…"}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                live ? "bg-green-500" : "bg-muted-foreground/40 animate-pulse"
              )}
            />
            {live ? "Live" : "Connecting…"}
          </span>
        </div>

        <div className="border border-border/60 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-[60vh]">
          {/* Thread list */}
          <MessageThreadList threads={threads} activeEmail={activeEmail} onSelect={setActiveEmail} />

          {/* Conversation */}
          <div className="flex flex-col min-h-[60vh]">
            {!activeThread ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No conversation selected</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a conversation from the left to view the thread.
                </p>
              </div>
            ) : (
              <>
                {/* Thread header */}
                <div className="flex items-center justify-between gap-3 p-4 border-b border-border shrink-0">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{activeThread.name || "Anonymous"}</p>
                    <a
                      href={`mailto:${activeThread.email}`}
                      className="text-sm text-primary hover:underline truncate block"
                    >
                      {activeThread.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {activeThread.unread > 0 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => handleMarkRead(activeThread.email)}>
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Mark read
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveEmail(undefined)}
                      aria-label="Close conversation"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages — messenger style */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[55vh] bg-muted/20">
                  {threadMessages.map((m) => (
                    <div key={m.id} className="flex flex-col items-start">
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl rounded-tl-md px-4 py-2 text-sm",
                          m.read ? "bg-muted text-foreground" : "bg-primary/10 text-foreground"
                        )}
                      >
                        <p className="whitespace-pre-wrap">{m.message}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-1 ml-1">{fmt(m.created_at)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
