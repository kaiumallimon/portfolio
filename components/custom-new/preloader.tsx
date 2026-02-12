"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });

    // Check if preloader has already been shown in this session
    const hasShown = sessionStorage.getItem("preloaderShown");
    if (hasShown) {
      setComplete(true);
      return;
    }

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
        sessionStorage.setItem("preloaderShown", "true");
      }, 1000); // Wait for exit animation
    }
  }, [progress]);

  if (complete) return null;

  // Circle properties for progress border
  const radius = 54; // Slightly larger than the image (50px radius + padding)
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
        initial={{ y: 0 }}
        animate={{ y: progress === 100 ? "-100%" : 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="fixed inset-0 z-[9999] flex flex-col justify-between bg-zinc-950 p-10 cursor-wait"
    >
        {/* Top-left Brand (Optional) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
        >
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            <span className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Portfolio</span>
        </motion.div>

        {/* Center Image with Circular Progress */}
        <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative flex items-center justify-center">
                 {/* Progress Circle Background */}
                 <svg className="absolute w-[120px] h-[120px] -rotate-90">
                     <circle 
                        cx="60" cy="60" r={radius} 
                        fill="none" 
                        stroke="#27272a" // zinc-800
                        strokeWidth="4" 
                     />
                     <motion.circle 
                        cx="60" cy="60" r={radius} 
                        fill="none" 
                        stroke="#6366f1" // indigo-500
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.2 }}
                     />
                 </svg>

                 {/* Profile Image */}
                 <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-zinc-900"
                 >
                     <Image 
                        src="/bordered.png" 
                        alt="Profile" 
                        fill 
                        className="object-cover"
                     />
                 </motion.div>
             </div>
        </div>

        {/* Bottom-right Large Counter */}
        <div className="flex flex-col items-end relative z-10">
             <motion.p 
                className="text-white text-[12vw] leading-[0.8] font-bold tracking-tighter"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {Math.round(progress)}
            </motion.p>
        </div>
    </motion.div>
  );
}
