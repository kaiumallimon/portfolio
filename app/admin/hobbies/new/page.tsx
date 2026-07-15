import { HobbyForm } from "@/components/admin/forms";
import { AdminCard } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default function NewHobbyPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">New Hobby</h1>
      <AdminCard title="Hobby details">
        <HobbyForm />
      </AdminCard>
    </div>
  );
}
