"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Non-linear progress for a more natural feel
        const increment = Math.random() * 10; 
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setComplete(true);
      }, 1000); // Wait for exit animation
    }
  }, [progress]);

  if (complete) return null;

  return (
    <motion.div
        initial={{ y: 0 }}
        animate={{ y: progress === 100 ? "-100%" : 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="fixed inset-0 z-[9999] flex flex-col justify-between bg-zinc-950 p-10 cursor-wait"
    >
        {/* Name / Brand (Optional, keeping it subtle) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
        >
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            <span className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Portfolio</span>
        </motion.div>

        {/* Large Counter */}
        <div className="flex flex-col items-end">
             <motion.p 
                className="text-white text-[12vw] leading-[0.8] font-bold tracking-tighter"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {Math.round(progress)}
            </motion.p>
        </div>
        
        {/* SVG Curve for fluid exit (optional visual flair) */}
        {/* We can keep it simple first */}
    </motion.div>
  );
}
