import { AchievementForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default function NewAchievementPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">New Achievement</h1>
      <AdminCard title="Achievement details">
        <AchievementForm />
      </AdminCard>
    </div>
  );
}
