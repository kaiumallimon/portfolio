import Link from "next/link";
import { getHobbies } from "@/lib/data";
import { deleteHobby } from "@/app/admin/actions";
import { AdminCard } from "@/components/admin/fields";
import { ResourceTable } from "@/components/admin/resource-table";

export const dynamic = "force-dynamic";

export default async function AdminHobbiesPage() {
  const hobbies = await getHobbies();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Hobbies</h1>
          <p className="text-sm text-slate-400">Personal interests shown on the home page.</p>
        </div>
        <Link href="/admin/hobbies/new" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
          + Add Hobby
        </Link>
      </div>
      <AdminCard title={`${hobbies.length} hobbies`}>
        <ResourceTable
          columns={[
            { key: "title", label: "Title" },
            { key: "icon", label: "Icon" },
            { key: "order", label: "Order" },
          ]}
          rows={hobbies as unknown as Record<string, unknown>[]}
          editBase="/admin/hobbies"
          deleteAction={deleteHobby}
        />
      </AdminCard>
    </div>
  );
}
