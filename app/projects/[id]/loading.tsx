import { Skeleton } from "@/components/admin/loading-skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased">
      <div className="relative">
        <div className="max-w-5xl mx-auto px-6 py-32">
          <Skeleton className="h-4 w-28" />

          <div className="mt-8 space-y-6 border border-white/10 bg-slate-900/30 backdrop-blur-md rounded-3xl p-8 md:p-10">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
            <Skeleton className="h-56 w-full rounded-2xl" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
