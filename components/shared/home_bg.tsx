'use client';

import ColorBends from "@/components/ColorBends";

export default function HomeBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ColorBends
          colors={[ "#000000", "#4c00a8"]}
          speed={0.20}
          scale={1}
          transparent={true}
          autoRotate={0.0}
          rotation={45}
          frequency={1.0}
          mouseInfluence={1.0}
          warpStrength={1.0}
          parallax={.50}
          noise={0}
        />
      </div>
      {/* overlay */}
      <div className="absolute inset-0 z-0 bg-linear-to-t from-slate-950/80 to-transparent" />
    </>
  );
}