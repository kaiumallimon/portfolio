import { getServerSupabase } from "@/lib/supabase/server";
import { AdminCard } from "@/components/admin/fields";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function count(table: string): Promise<number> {
  const supabase = getServerSupabase();
  const { count: c, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return c ?? 0;
}

export default async function AdminOverview() {
  const [
    projects,
    achievements,
    activities,
    education,
    skills,
    hobbies,
    metrics,
    messages,
  ] = await Promise.all([
    count("projects"),
    count("achievements"),
    count("activities"),
    count("education"),
    count("skills"),
    count("hobbies"),
    count("metrics"),
    count("contact_messages"),
  ]);

  const cards = [
    { label: "Projects", value: projects, href: "/admin/projects" },
    { label: "Achievements", value: achievements, href: "/admin/achievements" },
    { label: "Activities", value: activities, href: "/admin/activities" },
    { label: "Education", value: education, href: "/admin/education" },
    { label: "Skills", value: skills, href: "/admin/skills" },
    { label: "Hobbies", value: hobbies, href: "/admin/hobbies" },
    { label: "Metrics", value: metrics, href: "/admin/metrics" },
    { label: "Messages", value: messages, href: "/admin/messages" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-slate-400">Manage everything on your public portfolio.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <AdminCard title={c.label}>
              <p className="text-4xl font-bold text-white">{c.value}</p>
              <p className="text-xs text-slate-500 mt-1">Manage →</p>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
