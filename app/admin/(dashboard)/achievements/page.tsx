import { getAchievements, getAchievementsPaginated } from "@/lib/data";
import AchievementsAdmin from "@/components/admin/achievements-admin";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminAchievementsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(first(sp.page) || "1", 10) || 1);
  const sizeRaw = parseInt(first(sp.size) || "15", 10);
  const size = [15, 30, 50].includes(sizeRaw) ? sizeRaw : 15;
  const q = first(sp.q);
  const awardRank = first(sp.award_rank) || "all";

  const [all, { achievements, total }] = await Promise.all([
    getAchievements(),
    getAchievementsPaginated({ page, size, q, awardRank }),
  ]);

  return (
    <AchievementsAdmin
      all={all}
      achievements={achievements}
      total={total}
      page={page}
      size={size}
      q={q}
      awardRank={awardRank}
    />
  );
}
