import { getHobbies, getHobbiesPaginated } from "@/lib/data";
import HobbiesAdmin from "@/components/admin/hobbies-admin";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminHobbiesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(first(sp.page) || "1", 10) || 1);
  const sizeRaw = parseInt(first(sp.size) || "15", 10);
  const size = [15, 30, 50].includes(sizeRaw) ? sizeRaw : 15;
  const q = first(sp.q);

  const [all, { hobbies, total }] = await Promise.all([
    getHobbies(),
    getHobbiesPaginated({ page, size, q }),
  ]);

  return (
    <HobbiesAdmin all={all} hobbies={hobbies} total={total} page={page} size={size} q={q} />
  );
}
