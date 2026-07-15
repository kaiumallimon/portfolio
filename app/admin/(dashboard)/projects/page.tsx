import { getProjects, getProjectsPaginated } from "@/lib/data";
import ProjectsAdmin from "@/components/admin/projects-admin";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(first(sp.page) || "1", 10) || 1);
  const sizeRaw = parseInt(first(sp.size) || "15", 10);
  const size = [15, 30, 50].includes(sizeRaw) ? sizeRaw : 15;
  const q = first(sp.q);
  const client = first(sp.client) || "all";

  const [all, { projects, total }] = await Promise.all([
    getProjects(),
    getProjectsPaginated({ page, size, q, client }),
  ]);

  return (
    <ProjectsAdmin
      all={all}
      projects={projects}
      total={total}
      page={page}
      size={size}
      q={q}
      client={client}
    />
  );
}
