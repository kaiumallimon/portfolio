import { getContactMessages } from "@/lib/data";
import { markThreadRead } from "@/app/admin/actions";
import { MessageThreadList } from "@/components/admin/message-thread-list";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Mail, MessageSquare, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/types/content";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

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

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const activeEmail = first(sp.email);

  const messages = await getContactMessages();

  // Group into threads by email.
  const map = new Map<string, ContactMessage[]>();
  for (const m of messages) {
    const key = m.email ?? "unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }

  const threads = [...map.entries()].map(([email, msgs]) => {
    const sorted = [...msgs].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const unread = msgs.filter((m) => !m.read).length;
    return {
      email,
      name: sorted[0].name,
      messages: sorted,
      last: sorted[0],
      unread,
      preview: (sorted[0].message ?? "").slice(0, 80),
    };
  });

  // Most recent thread first (descending by latest message time).
  threads.sort(
    (a, b) => new Date(b.last.created_at).getTime() - new Date(a.last.created_at).getTime()
  );

  // Serializable data passed to the (client) thread list for instant search.
  const threadData = threads.map((t) => ({
    email: t.email,
    name: t.name,
    unread: t.unread,
    preview: t.preview,
    lastCreatedAt: t.last.created_at,
    messages: t.messages.map((m) => ({
      id: m.id,
      message: m.message,
      created_at: m.created_at,
      read: m.read,
    })),
  }));

  const totalAll = messages.length;
  const unreadAll = messages.filter((m) => !m.read).length;

  const activeThread = threads.find((t) => t.email === activeEmail) ?? null;
  const threadMessages = activeThread
    ? [...activeThread.messages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    : [];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Messages</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard icon={MessageSquare} title="Conversations" value={threads.length} />
        <StatsCard icon={Mail} title="Total Messages" value={totalAll} />
        <StatsCard icon={Mail} title="Unread" value={unreadAll} />
      </div>

      {/* Inbox */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Messages
          </CardTitle>
          <CardDescription>Contact form submissions, grouped by sender.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="border border-border/60 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-[340px_1fr] min-h-[60vh]">
            {/* Thread list (client: instant local search) */}
            <MessageThreadList threads={threadData} activeEmail={activeEmail} />

            {/* Conversation / empty state */}
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
                    {activeThread.unread > 0 && (
                      <form action={markThreadRead} className="shrink-0">
                        <input type="hidden" name="email" value={activeThread.email} />
                        <Button type="submit" variant="outline" size="sm">
                          <CheckCheck className="h-4 w-4 mr-2" />
                          Mark read
                        </Button>
                      </form>
                    )}
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
                        <span className="text-[11px] text-muted-foreground mt-1 ml-1">
                          {fmt(m.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
