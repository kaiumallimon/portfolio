import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import { ProjectForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Edit Project</h1>
      <AdminCard title="Project details">
        <ProjectForm project={project} />
      </AdminCard>
    </div>
  );
}
