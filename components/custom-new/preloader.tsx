"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [complete, setComplete] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // 20ms * 100 = 2000ms duration

    const completionTimer = setTimeout(() => {
      setTextVisible(false);
      setTimeout(() => setComplete(true), 800);
    }, 2200); // Slightly longer than progress to ensure 100% is seen

    return () => {
      clearInterval(timer);
      clearTimeout(completionTimer);
    };
  }, []);

  if (complete) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: textVisible ? 0 : "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 gap-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
            opacity: textVisible ? 1 : 0,
            scale: textVisible ? 1 : 1.1
        }}
        transition={{ duration: 0.5 }}
        className="text-white text-3xl md:text-5xl font-bold tracking-tighter"
      >
        <span className="text-indigo-500">Kaium</span> Al Limon
      </motion.div>

      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: textVisible ? 1 : 0 }}
         transition={{ delay: 0.2, duration: 0.3 }}
         className="flex flex-col items-center gap-2"
      >
        <span className="text-slate-400 font-mono text-sm">{progress}%</span>
        <div className="w-48 h-[1px] bg-slate-800 overflow-hidden relative">
            <motion.div 
                className="absolute inset-y-0 left-0 bg-indigo-500"
                style={{ width: `${progress}%` }}
            />
        </div>
      </motion.div>
    </motion.div>
  );
}
