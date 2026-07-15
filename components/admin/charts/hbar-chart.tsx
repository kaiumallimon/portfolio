import { cn } from "@/lib/utils";

export interface HBarDatum {
  label: string;
  value: number;
  color?: string;
}

export function HBarChart({
  data,
  unit = "",
  className,
}: {
  data: HBarDatum[];
  unit?: string;
  className?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((d) => (
        <div
          key={d.label}
          className="grid grid-cols-[120px_1fr_auto] items-center gap-3 sm:grid-cols-[150px_1fr_auto]"
        >
          <span
            className="truncate text-sm text-muted-foreground"
            title={d.label}
          >
            {d.label}
          </span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: d.color || "#6366f1",
              }}
            />
          </div>
          <span className="text-sm font-medium tabular-nums text-foreground">
            {d.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}
