import Link from "next/link";
import { getProjects } from "@/lib/data";
import { deleteProject } from "@/app/admin/actions";
import { AdminCard, AdminCard as Card } from "@/components/admin/fields";
import { ResourceTable } from "@/components/admin/resource-table";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-slate-400">Manage portfolio projects shown on the home and /projects pages.</p>
        </div>
        <Link href="/admin/projects/new" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
          + Add Project
        </Link>
      </div>
      <Card title={`${projects.length} projects`}>
        <ResourceTable
          columns={[
            { key: "name", label: "Name" },
            { key: "client", label: "Type" },
            { key: "order", label: "Order" },
          ]}
          rows={projects as unknown as Record<string, unknown>[]}
          editBase="/admin/projects"
          deleteAction={deleteProject}
        />
      </Card>
    </div>
  );
}
