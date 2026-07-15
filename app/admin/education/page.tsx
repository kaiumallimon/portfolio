import Link from "next/link";
import { getEducation } from "@/lib/data";
import { deleteEducation } from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/fields";
import { ResourceTable } from "@/components/admin/resource-table";

export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const education = await getEducation();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Education</h1>
          <p className="text-sm text-slate-400">Academic background shown in the About section.</p>
        </div>
        <Link href="/admin/education/new" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
          + Add Education
        </Link>
      </div>
      <AdminCard title={`${education.length} entries`}>
        <ResourceTable
          columns={[
            { key: "degree", label: "Degree" },
            { key: "institution", label: "Institution" },
            { key: "order", label: "Order" },
          ]}
          rows={education as unknown as Record<string, unknown>[]}
          editBase="/admin/education"
          deleteAction={deleteEducation}
        />
      </AdminCard>
    </div>
  );
}
