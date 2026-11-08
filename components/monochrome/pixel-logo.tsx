"use client";

export function PixelLogo({ size = 48 }: { size?: number }) {
  // 5x5 pixel block representation of "KL" (Kaium Al Limon)
  // Matching the iconic CD monogram from chanhdai.com
  const p = 10; // each pixel block size

  return (
    <div className="flex items-center justify-center select-none py-2" aria-label="KL pixel logo">
      <svg
        width={size * 2.4}
        height={size}
        viewBox="0 0 120 50"
        fill="currentColor"
        className="text-zinc-950 dark:text-zinc-50 transition-colors"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* K: Col 0 (full vertical stem) */}
        <rect x={0 * p} y={0 * p} width={p} height={p} />
        <rect x={0 * p} y={1 * p} width={p} height={p} />
        <rect x={0 * p} y={2 * p} width={p} height={p} />
        <rect x={0 * p} y={3 * p} width={p} height={p} />
        <rect x={0 * p} y={4 * p} width={p} height={p} />

        {/* K: Center connectors */}
        <rect x={1 * p} y={2 * p} width={p} height={p} />
        <rect x={2 * p} y={2 * p} width={p} height={p} />

        {/* K: Upper diagonal */}
        <rect x={3 * p} y={1 * p} width={p} height={p} />
        <rect x={4 * p} y={0 * p} width={p} height={p} />

        {/* K: Lower diagonal */}
        <rect x={3 * p} y={3 * p} width={p} height={p} />
        <rect x={4 * p} y={4 * p} width={p} height={p} />

        {/* Gap: x = 50 to 70 */}

        {/* L: Col 7 (full vertical stem) */}
        <rect x={7 * p} y={0 * p} width={p} height={p} />
        <rect x={7 * p} y={1 * p} width={p} height={p} />
        <rect x={7 * p} y={2 * p} width={p} height={p} />
        <rect x={7 * p} y={3 * p} width={p} height={p} />
        <rect x={7 * p} y={4 * p} width={p} height={p} />

        {/* L: Bottom base */}
        <rect x={8 * p} y={4 * p} width={p} height={p} />
        <rect x={9 * p} y={4 * p} width={p} height={p} />
        <rect x={10 * p} y={4 * p} width={p} height={p} />
        <rect x={11 * p} y={4 * p} width={p} height={p} />
      </svg>
    </div>
  );
}
