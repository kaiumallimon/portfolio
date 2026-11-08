export function MonochromeSkills({
  skills,
}: {
  skills: { category: string; skills: string[] }[];
}) {
  return (
    <section id="skills" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Technical Arsenal
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Core competencies, frameworks, systems &amp; languages
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((group) => (
          <div
            key={group.category}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <span className="text-xs font-mono font-semibold uppercase text-zinc-900 dark:text-zinc-100 tracking-wider">
                {group.category}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {group.skills.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[11px] font-mono rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
