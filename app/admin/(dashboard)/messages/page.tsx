import { getContactMessages } from "@/lib/data";
import { deleteMessage, toggleMessageRead } from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Messages</h1>
        <p className="text-sm text-slate-400">
          {messages.length} total · {unread} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <AdminCard title="Inbox">
          <p className="text-sm text-slate-500 text-center py-8">No messages yet.</p>
        </AdminCard>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`border rounded-2xl p-5 ${
                m.read ? "border-white/10 bg-slate-900/30" : "border-indigo-500/30 bg-indigo-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{m.name || "Anonymous"}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-indigo-400 hover:underline break-all">
                    {m.email}
                  </a>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={toggleMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={m.read ? "false" : "true"} />
                    <button className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors">
                      {m.read ? "Mark unread" : "Mark read"}
                    </button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="text-sm text-slate-300 mt-3 whitespace-pre-wrap">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
