import { notFound } from "next/navigation";
import { getAchievements } from "@/lib/data";
import { AchievementForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const achievements = await getAchievements();
  const achievement = achievements.find((a) => a.id === id);
  if (!achievement) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">Edit Achievement</h1>
      <AdminCard title="Achievement details">
        <AchievementForm achievement={achievement} />
      </AdminCard>
    </div>
  );
}
