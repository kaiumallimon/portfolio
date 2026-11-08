"use client";

export function PixelLogo({ size = 56 }: { size?: number }) {
  // 12x12 grid pixel representation for "K L"
  // Each pixel is a crisp square matching chanhdai's iconic CD logo
  return (
    <div className="flex items-center justify-center py-6 select-none">
      <svg
        width={size * 2}
        height={size}
        viewBox="0 0 76 36"
        fill="currentColor"
        className="text-zinc-950 dark:text-zinc-50"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* Letter K */}
        {/* Vertical stem */}
        <rect x="2" y="4" width="6" height="28" />
        {/* K upper arm */}
        <rect x="8" y="16" width="6" height="6" />
        <rect x="14" y="10" width="6" height="6" />
        <rect x="20" y="4" width="6" height="6" />
        {/* K lower arm */}
        <rect x="14" y="22" width="6" height="6" />
        <rect x="20" y="26" width="6" height="6" />

        {/* Letter L */}
        {/* Vertical stem */}
        <rect x="42" y="4" width="6" height="28" />
        {/* Horizontal base */}
        <rect x="48" y="26" width="22" height="6" />
      </svg>
    </div>
  );
}
