import { notFound } from "next/navigation";
import { getEducation } from "@/lib/data";
import { EducationForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const education = await getEducation();
  const entry = education.find((e) => e.id === id);
  if (!entry) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Edit Education</h1>
      <AdminCard title="Education details">
        <EducationForm education={entry} />
      </AdminCard>
    </div>
  );
}
