import { notFound } from "next/navigation";
import { getMetrics } from "@/lib/data";
import { MetricForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function EditMetricPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const metrics = await getMetrics();
  const metric = metrics.find((m) => m.id === id);
  if (!metric) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Edit Metric</h1>
      <AdminCard title="Metric details">
        <MetricForm metric={metric} />
      </AdminCard>
    </div>
  );
}
