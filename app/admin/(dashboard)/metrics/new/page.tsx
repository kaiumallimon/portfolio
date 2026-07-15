import { MetricForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default function NewMetricPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">New Metric</h1>
      <AdminCard title="Metric details">
        <MetricForm />
      </AdminCard>
    </div>
  );
}
