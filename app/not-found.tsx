"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search, Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TargetCursor from "@/components/TargetCursor";
import HomeBackground from "@/components/shared/home-color-bend";
import FloatingHeader from "@/components/shared/header";
import Footer from "@/components/custom-new/footer";
import { useState, useEffect } from "react";

export default function NotFound() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />
      
      <HomeBackground />
      <FloatingHeader />

      <main className="relative z-10 min-h-[calc(100vh-80px)] pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <motion.div
          className="relative z-10 mx-auto max-w-xl text-center"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.div 
            variants={fadeUp} 
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 mb-8"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium tracking-wide bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Lost in Space
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeUp} 
            className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6"
          >
            404
          </motion.h1>

          <motion.h2 
            variants={fadeUp} 
            className="text-2xl md:text-3xl font-semibold tracking-tight text-white/90 mb-4"
          >
            Page not found
          </motion.h2>

          <motion.p 
            variants={fadeUp} 
            className="text-slate-400 max-w-md mx-auto leading-relaxed mb-10"
          >
            The page you're looking for was moved, removed, or never existed. Let's get you back to familiar territory.
          </motion.p>

          <motion.div 
            variants={fadeUp} 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => router.push("/")} 
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group cursor-target w-full sm:w-auto"
            >
              <Home size={18} className="transform group-hover:-translate-y-0.5 transition-transform duration-300" />
              Back Home
            </button>
            <button 
              onClick={() => router.push("/projects")} 
              className="px-8 py-3 border border-indigo-500/20 backdrop-blur-md hover:bg-white/5 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 group cursor-target w-full sm:w-auto"
            >
              <Search size={18} className="transform group-hover:scale-110 transition-transform duration-300" />
              View Projects
            </button>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
