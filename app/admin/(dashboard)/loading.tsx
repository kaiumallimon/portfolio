import { Skeleton } from "@/components/admin/loading-skeletons";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Skeleton className="h-4 w-40" />

      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border/40 bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border/40 bg-card p-6 lg:col-span-2">
          <Skeleton className="h-5 w-40" />
          <div className="mt-6 flex items-end gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-t-md" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border/40 bg-card p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mx-auto mt-8 h-40 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
