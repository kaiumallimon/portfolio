"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function NotFound() {
  const router = useRouter();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section className="fixed inset-0 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none" />
      <motion.div
        className="relative z-10 mx-auto max-w-xl px-6 py-16 text-center"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/10 px-4 py-2">
          <span className="text-sm text-white/70">Error</span>
          <span className="text-sm font-semibold">404 • Not Found</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="mt-6 text-3xl md:text-5xl font-semibold tracking-tight text-white">
          This page took a wrong turn
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-3 text-sm md:text-base text-muted-foreground">
          The content you’re seeking doesn’t exist or has moved. Let’s get you back on track.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8  flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/")} className="px-5">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/projects")} className="px-5">
            <Search className="mr-2 h-4 w-4" />
            Browse Projects
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
