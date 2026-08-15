import {
  AdminBreadcrumbSkeleton,
  AdminFormSkeleton,
} from "@/components/admin/loading-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumbSkeleton />
      <AdminFormSkeleton cards={3} rows={5} />
    </div>
  );
}
