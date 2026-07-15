import { getContactMessages } from "@/lib/data";
import { MessagesInbox } from "@/components/admin/messages-inbox";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import type { ContactMessage } from "@/types/content";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

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

  return (
    <div className="p-6 space-y-6">
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

      <MessagesInbox initialThreads={threadData} initialActiveEmail={activeEmail} />
    </div>
  );
}
