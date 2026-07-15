import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
      {...props}
    />
  );
}

export function AdminBreadcrumbSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function AdminStatsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border/40 bg-card p-4"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-12" />
        </div>
      ))}
    </div>
  );
}

export function AdminToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-9 w-full sm:max-w-xs" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden">
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="ml-auto h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Shared skeleton for the list/table admin pages (projects, skills, etc.).
export function AdminListSkeleton({
  stats = 3,
  rows = 8,
}: {
  stats?: number;
  rows?: number;
}) {
  return (
    <>
      <AdminBreadcrumbSkeleton />
      <AdminStatsSkeleton count={stats} />
      <div className="mt-5 rounded-lg border border-border/40 bg-card">
        <div className="border-b border-border/40 p-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-3 w-64" />
        </div>
        <AdminToolbarSkeleton />
        <AdminTableSkeleton rows={rows} />
      </div>
    </>
  );
}

export function AdminFormSkeleton({
  cards = 1,
  rows = 5,
}: {
  cards?: number;
  rows?: number;
}) {
  return (
    <div className="space-y-6">
      {Array.from({ length: cards }).map((_, c) => (
        <div
          key={c}
          className="rounded-lg border border-border/40 bg-card"
        >
          <div className="border-b border-border/40 p-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-3 w-60" />
          </div>
          <div className="space-y-4 p-4">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={r}>
                <Skeleton className="mb-2 h-3 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminMessagesSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-border/40 bg-card lg:col-span-1">
        <div className="relative border-b border-border p-3">
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2 p-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-border/40 p-3"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border/40 bg-card p-4 lg:col-span-2">
        <Skeleton className="h-4 w-40" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
