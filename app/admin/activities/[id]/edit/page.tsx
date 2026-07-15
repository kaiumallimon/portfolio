import { notFound } from "next/navigation";
import { getActivities } from "@/lib/data";
import { ActivityForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activities = await getActivities();
  const activity = activities.find((a) => a.id === id);
  if (!activity) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Edit Activity</h1>
      <AdminCard title="Activity details">
        <ActivityForm activity={activity} />
      </AdminCard>
    </div>
  );
}
