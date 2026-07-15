import Link from "next/link";
import { getSkills } from "@/lib/data";
import { deleteSkill } from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/fields";
import { ResourceTable } from "@/components/admin/resource-table";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Skills</h1>
          <p className="text-sm text-slate-400">Tech stack categories shown in the Engineering Toolkit section.</p>
        </div>
        <Link href="/admin/skills/new" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
          + Add Category
        </Link>
      </div>
      <AdminCard title={`${skills.length} categories`}>
        <ResourceTable
          columns={[
            { key: "category", label: "Category" },
            { key: "icon", label: "Icon" },
            { key: "order", label: "Order" },
          ]}
          rows={skills as unknown as Record<string, unknown>[]}
          editBase="/admin/skills"
          deleteAction={deleteSkill}
        />
      </AdminCard>
    </div>
  );
}
