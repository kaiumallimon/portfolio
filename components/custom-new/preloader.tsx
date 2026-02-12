"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [complete, setComplete] = useState(false);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTextVisible(false);
      setTimeout(() => setComplete(true), 800); // Wait for exit animation
    }, 2000); // Display time

    return () => clearTimeout(timer);
  }, []);

  if (complete) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: textVisible ? 0 : "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950"
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
    </motion.div>
  );
}
