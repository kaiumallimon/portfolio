import { notFound } from "next/navigation";
import { getHobbies } from "@/lib/data";
import { HobbyForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function EditHobbyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hobbies = await getHobbies();
  const hobby = hobbies.find((h) => h.id === id);
  if (!hobby) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Edit Hobby</h1>
      <AdminCard title="Hobby details">
        <HobbyForm hobby={hobby} />
      </AdminCard>
    </div>
  );
}
