import { Skeleton } from "@/components/admin/loading-skeletons";

export default function Loading() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="absolute inset-0 z-[1] bg-size-[40px_40px] bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] opacity-20" />
      <div className="relative z-10 w-full max-w-md">
        <div className="relative border border-white/10 bg-slate-900/30 backdrop-blur-md rounded-3xl p-8 md:p-10 space-y-6 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="flex flex-col items-center gap-3 relative z-10">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-56" />
          </div>

          <div className="space-y-2 relative z-10">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2 relative z-10">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          <Skeleton className="h-11 w-full rounded-xl relative z-10" />
        </div>
      </div>
    </div>
  );
}
