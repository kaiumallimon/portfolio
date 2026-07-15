import { ProjectForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">New Project</h1>
      <AdminCard title="Project details">
        <ProjectForm />
      </AdminCard>
    </div>
  );
}
