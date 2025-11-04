"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

// React Icons
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa6";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function Hero() {
  return (
    <section className="relative z-10 px-6 flex flex-col items-center max-w-7xl mx-auto pt-[120px] md:pt-40">
      {/* Greeting */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${inter.className} text-lg md:text-2xl font-semibold text-gray-800 text-center mb-4`}
      >
        Hello, I'm <span className="text-black">Kaium Al Limon</span>
      </motion.p>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex flex-col items-center leading-[1.05] -space-y-1"
      >
        <h1
          className={`${inter.className} text-4xl md:text-[90px] lg:text-[120px] font-extrabold text-center tracking-tight text-gray-900`}
        >
          FLUTTER & NEXT.JS
        </h1>

        <h1
          className={`${inter.className} text-4xl md:text-[90px] lg:text-[120px] font-extrabold text-center tracking-tight text-gray-900`}
        >
          DEVELOPER
        </h1>
      </motion.div>

      {/* Description + Image Row */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-14 flex flex-col md:flex-row items-start justify-between gap-10 w-full"
      >
        {/* Left Column: Text + Button + Social */}
        <div className="flex flex-col justify-between max-w-2xl h-[380px] text-center md:text-left">
          {/* Top Section: Text and Button */}
          <div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              I’m a cross-platform mobile and web developer focused on building
              elegant, high-performance applications. Using{" "}
              <span className="font-semibold text-black">Flutter</span> for
              mobile and <span className="font-semibold text-black">Next.js</span>{" "}
              for web, I craft fast, scalable solutions with exceptional user
              experiences across every platform.
            </p>

            <div className="mt-10">
              <Button
                variant="default"
                size="lg"
                className="rounded-none px-10 py-3 bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300"
              >
                Contact Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Bottom Section: Social Links - Aligned with image bottom */}
          <div className="mt-12 md:mt-0">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              You can also find me
            </p>
            <div className="flex space-x-5">
              <SocialLink href="https://facebook.com/" icon={<FaFacebookF />} />
              <SocialLink href="https://instagram.com/" icon={<FaInstagram />} />
              <SocialLink href="https://github.com/" icon={<FaGithub />} />
              <SocialLink href="https://linkedin.com/" icon={<FaLinkedinIn />} />
            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="shrink-0">
          <Image
            src="/profile-picture.png"
            alt="Developer"
            width={380}
            height={380}
            className="hidden md:block object-cover"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}

// Reusable Social Link Component
function SocialLink({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="p-2 border border-gray-300 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-gray-700 text-lg"
    >
      {icon}
    </Link>
  );
}
