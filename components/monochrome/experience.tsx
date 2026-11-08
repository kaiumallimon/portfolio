import { IExperience } from "@/lib/models";

export function MonochromeExperience({ experiences }: { experiences: Partial<IExperience>[] }) {
  return (
    <section id="experience" className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Journey & Experience
          </h2>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Roles, milestones and engineering background
          </p>
        </div>

        <div className="space-y-3">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-2 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-sans">
                    {exp.role}
                  </h3>
                  <span className="text-zinc-400 text-xs">@</span>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {exp.company}
                  </span>
                  {exp.current && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Current
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-zinc-400 tabular-nums">
                  {exp.period}
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                {exp.description}
              </p>

              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-1 pt-1.5 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 font-sans">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-400 font-mono select-none">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
