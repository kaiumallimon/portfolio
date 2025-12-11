"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  // Animation variants
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  const fadeUpShort = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };


  return (
    <section className="relative w-full flex min-h-full items-center">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {/* Avatar + Name */}
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.div variants={fadeUp} className="relative group">
            <Image
              src="/bordered.png"
              alt="Kaium Al Limon"
              width={110}
              height={110}
              className="rounded-full border-2 border-white/25 shadow-lg transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </motion.div>

          <motion.div variants={fadeUpShort}>
            <h1 className="text-center mt-4 text-lg md:text-xl font-medium tracking-tight text-white">
              Kaium Al Limon
            </h1>
            <p className="text-center mt-1 text-sm md:text-base text-muted-foreground">
              Full‑stack, cross‑platform developer
            </p>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="mt-8 md:mt-10 text-center"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.h2
            className="mx-auto max-w-4xl text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-white"
            variants={fadeUp}
          >
            Crafting seamless, user‑focused experiences across mobile and web
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-3xl text-sm md:text-base text-muted-foreground"
            variants={fadeUpShort}
          >
            I specialize in Flutter for fast, polished mobile experiences, and complement with Next.js on the web — performant, accessible, and delightful.
          </motion.p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="relative z-10 mt-8 flex space-x-4 items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.div variants={fadeUpShort}>
            <Button onClick={() => router.push("/contact")}>Get in touch</Button>
          </motion.div>
          <motion.div variants={fadeUpShort}>
            <Button variant="outline" onClick={() => router.push("/projects")}>
              View Projects
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
