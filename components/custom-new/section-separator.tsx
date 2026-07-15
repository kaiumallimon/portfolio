export default function SectionSeparator() {
  return (
    <div className="py-12 px-6 max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto relative">
        {/* Main gradient line */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-indigo-500/30 to-transparent"></div>

        {/* Center decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          
        </div>
      </div>
    </div>
  );
}
