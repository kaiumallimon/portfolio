import { getMetrics, getMetricsPaginated } from "@/lib/data";
import MetricsAdmin from "@/components/admin/metrics-admin";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminMetricsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(first(sp.page) || "1", 10) || 1);
  const sizeRaw = parseInt(first(sp.size) || "15", 10);
  const size = [15, 30, 50].includes(sizeRaw) ? sizeRaw : 15;
  const q = first(sp.q);
  const featured = first(sp.featured) || "all";

  const [all, { metrics, total }] = await Promise.all([
    getMetrics(),
    getMetricsPaginated({ page, size, q, featured }),
  ]);

  return (
    <MetricsAdmin
      all={all}
      metrics={metrics}
      total={total}
      page={page}
      size={size}
      q={q}
      featured={featured}
    />
  );
}
