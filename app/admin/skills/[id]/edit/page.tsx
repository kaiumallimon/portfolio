import { notFound } from "next/navigation";
import { getSkills } from "@/lib/data";
import { SkillForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skills = await getSkills();
  const skill = skills.find((s) => s.id === id);
  if (!skill) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Edit Skill Category</h1>
      <AdminCard title="Category details">
        <SkillForm skill={skill} />
      </AdminCard>
    </div>
  );
}
