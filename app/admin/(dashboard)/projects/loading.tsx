import { AdminListSkeleton } from "@/components/admin/loading-skeletons";

export default function Loading() {
  return (
    <div>
      <AdminListSkeleton stats={3} />
    </div>
  );
}
