"use client";

export default function HomeBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(76,0,168,0.25),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.18),transparent_55%)]" />
      </div>
      {/* overlay */}
      <div className="absolute inset-0 z-0 bg-linear-to-t from-slate-950/80 to-transparent" />
    </>
  );
}
