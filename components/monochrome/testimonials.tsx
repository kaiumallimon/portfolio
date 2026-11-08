"use client";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarText: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "One of my favorite student projects submitted! You are crushing the design craft.",
    name: "Kap",
    role: "Developer Community @Vercel",
    avatarText: "KP",
  },
  {
    quote: "I like your style and attention to micro-interactions :)",
    name: "Max Prilutskiy",
    role: "Creator of lingo.dev",
    avatarText: "MP",
  },
  {
    quote: "Looks great. Clean architecture and blazing-fast search response.",
    name: "jordwalke",
    role: "Creator of React & ReasonML",
    avatarText: "JW",
  },
];

export function MonochromeTestimonials() {
  return (
    <section className="py-8 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between space-y-3"
            >
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed italic">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-mono font-bold flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                  {t.avatarText}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {t.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
