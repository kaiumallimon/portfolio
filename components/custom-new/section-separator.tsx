export default function SectionSeparator() {
  return (
    <div className="py-10 px-6 max-w-6xl mx-auto relative z-10">
      <div className="relative flex items-center justify-center">
        {/* Specular horizontal separator beam */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
        {/* Subtle center glowing diamond */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 border border-indigo-400/40 bg-slate-950 shadow-sm shadow-indigo-500/50" />
      </div>
    </div>
  );
}
