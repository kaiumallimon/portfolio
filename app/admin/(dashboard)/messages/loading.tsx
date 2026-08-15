import {
  AdminBreadcrumbSkeleton,
  AdminMessagesSkeleton,
} from "@/components/admin/loading-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumbSkeleton />
      <AdminMessagesSkeleton />
    </div>
  );
}
