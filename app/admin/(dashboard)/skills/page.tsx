import { getSkills, getSkillsPaginated } from "@/lib/data";
import SkillsAdmin from "@/components/admin/skills-admin";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminSkillsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(first(sp.page) || "1", 10) || 1);
  const sizeRaw = parseInt(first(sp.size) || "15", 10);
  const size = [15, 30, 50].includes(sizeRaw) ? sizeRaw : 15;
  const q = first(sp.q);

  const [all, { skills, total }] = await Promise.all([
    getSkills(),
    getSkillsPaginated({ page, size, q }),
  ]);

  return (
    <SkillsAdmin all={all} skills={skills} total={total} page={page} size={size} q={q} />
  );
}
