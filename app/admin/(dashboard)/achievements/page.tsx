import Link from "next/link";
import { getAchievements } from "@/lib/data";
import { deleteAchievement } from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/fields";
import { ResourceTable } from "@/components/admin/resource-table";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Achievements</h1>
          <p className="text-sm text-slate-400">Awards and recognition from project showcases.</p>
        </div>
        <Link href="/admin/achievements/new" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
          + Add Achievement
        </Link>
      </div>
      <AdminCard title={`${achievements.length} achievements`}>
        <ResourceTable
          columns={[
            { key: "title", label: "Title" },
            { key: "award", label: "Award" },
            { key: "order", label: "Order" },
          ]}
          rows={achievements as unknown as Record<string, unknown>[]}
          editBase="/admin/achievements"
          deleteAction={deleteAchievement}
        />
      </AdminCard>
    </div>
  );
}
