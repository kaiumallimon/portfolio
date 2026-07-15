import Link from "next/link";
import { getActivities } from "@/lib/data";
import { deleteActivity } from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/fields";
import { ResourceTable } from "@/components/admin/resource-table";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const activities = await getActivities();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Activities</h1>
          <p className="text-sm text-slate-400">Co-curricular activities and journey timeline.</p>
        </div>
        <Link href="/admin/activities/new" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
          + Add Activity
        </Link>
      </div>
      <AdminCard title={`${activities.length} activities`}>
        <ResourceTable
          columns={[
            { key: "title", label: "Title" },
            { key: "organization", label: "Organization" },
            { key: "order", label: "Order" },
          ]}
          rows={activities as unknown as Record<string, unknown>[]}
          editBase="/admin/activities"
          deleteAction={deleteActivity}
        />
      </AdminCard>
    </div>
  );
}
