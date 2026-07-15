import { getActivities, getActivitiesPaginated } from "@/lib/data";
import ActivitiesAdmin from "@/components/admin/activities-admin";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(first(sp.page) || "1", 10) || 1);
  const sizeRaw = parseInt(first(sp.size) || "15", 10);
  const size = [15, 30, 50].includes(sizeRaw) ? sizeRaw : 15;
  const q = first(sp.q);
  const status = first(sp.status) || "all";

  const [all, { activities, total }] = await Promise.all([
    getActivities(),
    getActivitiesPaginated({ page, size, q, status }),
  ]);

  return (
    <ActivitiesAdmin
      all={all}
      activities={activities}
      total={total}
      page={page}
      size={size}
      q={q}
      status={status}
    />
  );
}
