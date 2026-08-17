"use client";

import { motion } from "framer-motion";

export default function HomeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Ambient Deep Obsidian Core */}
      <div className="absolute inset-0 bg-[#06060c]" />

      {/* Dynamic Luminous Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[15%] left-[10%] w-[550px] h-[550px] rounded-full bg-indigo-600/15 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full bg-violet-600/12 blur-[140px]"
      />

      <motion.div
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute -bottom-[10%] left-[25%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[130px]"
      />

      {/* Subtle Matrix Grid Texture */}
      <div className="absolute inset-0 bg-size-[36px_36px] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] opacity-60" />

      {/* Top Specular Horizon Beam */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-indigo-500/30 to-transparent z-50 pointer-events-none" />
    </div>
  );
}
