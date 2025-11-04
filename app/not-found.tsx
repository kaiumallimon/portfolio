"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Silkscreen } from "next/font/google";

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function PageNotFoundPage() {
  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* Subtle background blur layer */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/60" />

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 text-center px-6"
      >
        <h1
          className={`${silkscreen.className} text-6xl md:text-8xl font-bold text-gray-900`}
        >
          404
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-700">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-8">
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-none px-6 py-2 text-base hover:bg-black hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
