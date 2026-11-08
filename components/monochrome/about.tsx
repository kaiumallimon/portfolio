"use client";

export function MonochromeAbout() {
  return (
    <section className="py-8 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
          About
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 mt-1 select-none">•</span>
            <span>
              Design Engineer & Full-Stack Developer with strong attention to craftsmanship, pixel-perfect execution, and resilient distributed architecture.
            </span>
          </p>

          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 mt-1 select-none">•</span>
            <span>
              Skilled in Next.js, React, TypeScript, Flutter, Python, and modern cloud technologies; building high-quality, user-centric web and cross-platform applications.
            </span>
          </p>

          <p className="flex items-start gap-2.5">
            <span className="text-zinc-400 mt-1 select-none">•</span>
            <span>
              Passionate about exploring new technologies and turning ideas into reality through polished, thoughtfully crafted engineering utilities.
            </span>
          </p>

          {/* Project highlight 1 */}
          <div className="space-y-1.5 pt-1">
            <p className="flex items-start gap-2.5">
              <span className="text-zinc-400 mt-1 select-none">•</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                Creator of UIU Exam Routine Finder: sub-millisecond schedule search engine for students
              </span>
            </p>
            <div className="pl-6 space-y-1 text-xs text-zinc-500 font-mono">
              <p>• 4,000+ active student users across university terms*</p>
              <p>• Sub-50ms regex search indexing 600+ course sections*</p>
            </div>
          </div>

          {/* Project highlight 2 */}
          <div className="space-y-1.5 pt-1">
            <p className="flex items-start gap-2.5">
              <span className="text-zinc-400 mt-1 select-none">•</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                Creator of GitHub Unwrapped: interactive developer contribution retrospective
              </span>
            </p>
            <div className="pl-6 space-y-1 text-xs text-zinc-500 font-mono">
              <p>• Spotify-Wrapped-inspired recap engine parsing GitHub GraphQL*</p>
              <p>• Holographic SVG/PNG export engine*</p>
            </div>
          </div>

          {/* Project highlight 3 */}
          <div className="space-y-1.5 pt-1">
            <p className="flex items-start gap-2.5">
              <span className="text-zinc-400 mt-1 select-none">•</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                Creator of UIU CGPA Calculator: predictive grade and semester planning tool
              </span>
            </p>
            <div className="pl-6 space-y-1 text-xs text-zinc-500 font-mono">
              <p>• Calibrated to university grading scale milestones*</p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 font-mono pt-2">
            * Peak metrics recorded; actual current figures may vary.
          </p>
        </div>
      </div>
    </section>
  );
}
