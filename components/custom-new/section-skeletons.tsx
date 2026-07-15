import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="relative z-10 py-38 px-6 max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
      <Skeleton className="w-[75px] h-[75px] rounded-full bg-slate-700" />
      <Skeleton className="h-5 w-28 rounded-full bg-slate-700" />
      <Skeleton className="h-12 w-full max-w-3xl bg-slate-700" />
      <Skeleton className="h-4 w-full max-w-xl bg-slate-700" />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-10 w-36 rounded-full bg-slate-700" />
        <Skeleton className="h-10 w-32 rounded-full bg-slate-700" />
      </div>
    </div>
  );
}

export function AboutSkeleton() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 bg-slate-700" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-slate-700" />
            <Skeleton className="h-4 w-5/6 bg-slate-700" />
            <Skeleton className="h-4 w-4/6 bg-slate-700" />
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-3xl bg-slate-700" />
      </div>
    </div>
  );
}

export function SkillsSkeleton() {
  return (
    <div className="py-20 px-6 max-w-6xl mx-auto">
      <Skeleton className="h-9 w-72 mb-12 bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl bg-slate-700" />
        ))}
      </div>
    </div>
  );
}

export function ImpactSkeleton() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-9 w-72 mb-12 bg-slate-700" />
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-4">
          <Skeleton className="col-span-2 row-span-2 h-48 rounded-2xl bg-slate-700" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-3xl bg-slate-700" />
        ))}
      </div>
    </div>
  );
}

export function JourneySkeleton() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-9 w-72 mb-12 bg-slate-700" />
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AchievementsSkeleton() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-9 w-72 mb-12 bg-slate-700" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HobbiesSkeleton() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-9 w-72 mb-12 bg-slate-700" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl bg-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}
