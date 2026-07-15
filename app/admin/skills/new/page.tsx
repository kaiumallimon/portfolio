import { SkillForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default function NewSkillPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">New Skill Category</h1>
      <AdminCard title="Category details">
        <SkillForm />
      </AdminCard>
    </div>
  );
}
