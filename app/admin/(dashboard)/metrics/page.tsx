import Link from "next/link";
import { getMetrics } from "@/lib/data";
import { deleteMetric } from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/fields";
import { ResourceTable } from "@/components/admin/resource-table";

export const dynamic = "force-dynamic";

export default async function AdminMetricsPage() {
  const metrics = await getMetrics();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Impact Metrics</h1>
          <p className="text-sm text-slate-400">Stat cards in the Impact at a Glance section. (GitHub Stars are fetched live.)</p>
        </div>
        <Link href="/admin/metrics/new" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
          + Add Metric
        </Link>
      </div>
      <AdminCard title={`${metrics.length} metrics`}>
        <ResourceTable
          columns={[
            { key: "label", label: "Label" },
            { key: "value", label: "Value" },
            { key: "order", label: "Order" },
          ]}
          rows={metrics as unknown as Record<string, unknown>[]}
          editBase="/admin/metrics"
          deleteAction={deleteMetric}
        />
      </AdminCard>
    </div>
  );
}
