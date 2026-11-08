"use client";

export function MonochromeAbout() {
  return (
    <section className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="p-4 sm:p-6 space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
          About
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              Design Engineer & Full-Stack Developer with strong attention to craftsmanship, pixel-perfect execution, and resilient distributed systems.
            </span>
          </p>

          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              Skilled in Next.js, React, TypeScript, Flutter, Python, and modern front-end & mobile technologies; building high-quality, user-centric applications.
            </span>
          </p>

          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 select-none">•</span>
            <span>
              Passionate about exploring new technologies and turning ideas into reality through polished, thoughtfully crafted engineering utilities.
            </span>
          </p>

          {/* Project highlight 1 */}
          <div className="space-y-1.5 pt-1">
            <p className="flex items-start gap-2.5">
              <span className="text-zinc-400 select-none">•</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                Creator of <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">UIU Routine Finder</span> (2024): sub-millisecond exam & schedule parser
              </span>
            </p>
            <div className="pl-5 space-y-1 text-xs text-zinc-500 font-mono">
              <p>• 4,000+ active student users across faculties*</p>
              <p>• &lt; 50ms regex search latency &amp; conflict detection*</p>
            </div>
          </div>

          {/* Project highlight 2 */}
          <div className="space-y-1.5 pt-1">
            <p className="flex items-start gap-2.5">
              <span className="text-zinc-400 select-none">•</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                Creator of <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">GitHub Unwrapped</span> &amp; <span className="underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2">CGPA Calculator</span>:
              </span>
            </p>
            <div className="pl-5 space-y-1 text-xs text-zinc-500 font-mono">
              <p>• Developer telemetry retrospectives &amp; holographic export cards*</p>
              <p>• 100% open-source utilities built for developers and students*</p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 font-mono pt-3 select-none">
            * Peak metrics recorded; actual current figures may vary.
          </p>
        </div>
      </div>

      {/* Signature striped divider matching chanhdai.com */}
      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
