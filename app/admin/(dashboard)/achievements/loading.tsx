import { AdminListSkeleton } from "@/components/admin/loading-skeletons";

export default function Loading() {
  return (
    <div className="p-6">
      <AdminListSkeleton stats={3} />
    </div>
  );
}
