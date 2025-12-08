"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

type RouteSplashProps = {
  durationMs?: number;
};

export default function RouteSplash({ durationMs = 700 }: RouteSplashProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const lastPathRef = useRef<string>(pathname);

  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      setVisible(true);
      const t = setTimeout(() => setVisible(false), durationMs);
      return () => clearTimeout(t);
    }
  }, [pathname, durationMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute inset-0 z-50"
        >
          {/* Solid cover that grows from top-left (open effect) */}
          <motion.div
            initial={{ clipPath: "circle(0% at 0 0)" }}
            animate={{ clipPath: "circle(130% at 0 0)" }}
            exit={{ clipPath: "circle(130% at 0 0)" }}
            transition={{ duration: durationMs / 1000, ease: "easeInOut" }}
            className="absolute inset-0 bg-foreground"
          />

          {/* Thin accent outline for added visibility */}
          {/* No borders or outlines during splash */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
