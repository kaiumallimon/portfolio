"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
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

// Animation imports
import {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  hoverScale,
  hoverLift,
  ANIMATION_DELAY,
} from "@/lib/animations";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function Hero() {
  return (
    <motion.section 
      className="relative z-10 px-6 flex flex-col items-center max-w-6xl mx-auto pt-[120px] md:pt-40 pb-10"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >

      {/* Mobile Image */}
      <motion.div 
        className="md:hidden mb-10 w-full flex justify-center"
        variants={scaleIn}
        custom={ANIMATION_DELAY.none}
      >
        <Image
          src="/profile-picture.png"
          alt="Developer"
          width={380}
          height={380}
          className="w-64 h-64 object-cover"
          priority
        />
      </motion.div>

      {/* Greeting */}
      <motion.p
        variants={fadeInDown}
        custom={ANIMATION_DELAY.short}
        className={`text-base md:text-xl font-semibold text-gray-600 text-center mb-8`}
      >
        Hello, I'm <span className="">Kaium Al Limon 👋</span>
      </motion.p>

      {/* Headline */}
      <motion.div
        variants={staggerContainer}
        className="flex flex-col items-center leading-[1.05] -space-y-1"
      >
        <motion.h1
          variants={fadeInUp}
          custom={ANIMATION_DELAY.medium}
          className={`${inter.className} text-4xl md:text-[80px] lg:text-[100px] font-extrabold text-center tracking-tight text-gray-900`}
        >
          FLUTTER & NEXT.JS
        </motion.h1>

        <motion.h1
          variants={fadeInUp}
          custom={ANIMATION_DELAY.long}
          className={`${inter.className} text-4xl md:text-[80px] lg:text-[100px] font-extrabold text-center tracking-tight text-gray-900`}
        >
          DEVELOPER
        </motion.h1>
      </motion.div>

      {/* Description + Image Row */}
      <motion.div
        variants={staggerContainer}
        className="mt-8 md:mt-14 flex flex-col md:flex-row items-start justify-between gap-10 w-full"
      >
        {/* Left Column: Text + Button + Social */}
        <motion.div 
          variants={fadeInLeft}
          custom={ANIMATION_DELAY.veryLong}
          className="flex flex-col justify-between max-w-2xl md:h-[380px] text-center md:text-left"
        >
          {/* Top Section: Text and Button */}
          <div>
            <motion.p 
              variants={fadeInUp}
              custom={ANIMATION_DELAY.veryLong + 0.1}
              className="text-sm md:text-base text-gray-700 leading-6"
            >
              I'm a cross-platform mobile and web developer focused on building
              elegant, high-performance applications. Using{" "}
              <span className="font-semibold text-black">Flutter</span> for
              mobile and <span className="font-semibold text-black">Next.js</span>{" "}
              for web, I craft fast, scalable solutions with exceptional user
              experiences across every platform.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              custom={ANIMATION_DELAY.veryLong + 0.2}
              className="mt-8 md:mt-10"
            >
              <motion.div
                whileHover={hoverLift}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-none px-8 md:px-10 py-3 bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300"
                >
                  <Download className="w-4 h-4 ml-2" />
                  Download CV
                </Button>
              </motion.div>
            </motion.div>
          </div>


          {/* Bottom Section: Social Links - Aligned with image bottom on desktop */}
          <motion.div 
            variants={fadeInUp}
            custom={ANIMATION_DELAY.veryLong + 0.3}
            className="mt-10 md:mt-0"
          >
            <motion.p 
              variants={fadeInUp}
              custom={ANIMATION_DELAY.veryLong + 0.35}
              className="text-sm text-gray-600 mb-3 font-medium"
            >
              You can also find me on -
            </motion.p>
            <motion.div 
              variants={staggerContainer}
              className="flex justify-center md:justify-start space-x-4 md:space-x-5"
            >
              <motion.div variants={scaleIn} custom={ANIMATION_DELAY.veryLong + 0.4}>
                <SocialLink href="https://facebook.com/kaiumallimon" icon={<FaFacebookF />} />
              </motion.div>
              <motion.div variants={scaleIn} custom={ANIMATION_DELAY.veryLong + 0.45}>
                <SocialLink href="https://instagram.com/kaiumallimon" icon={<FaInstagram />} />
              </motion.div>
              <motion.div variants={scaleIn} custom={ANIMATION_DELAY.veryLong + 0.5}>
                <SocialLink href="https://github.com/kaiumallimon" icon={<FaGithub />} />
              </motion.div>
              <motion.div variants={scaleIn} custom={ANIMATION_DELAY.veryLong + 0.55}>
                <SocialLink href="https://linkedin.com/in/kaiumallimon" icon={<FaLinkedinIn />} />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column: Image - Desktop only */}
        <motion.div 
          variants={fadeInRight}
          custom={ANIMATION_DELAY.veryLong}
          className="shrink-0 hidden md:flex justify-start"
        >
          <motion.div
            whileHover={hoverScale}
          >
            <Image
              src="/profile-picture.png"
              alt="Developer"
              width={380}
              height={380}
              className="w-[380px] h-[380px] object-cover"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}


function SocialLink({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={hoverLift}
      whileTap={{ scale: 0.9 }}
    >
      <Link
        href={href}
        target="_blank"
        className="block p-2 border border-gray-300 rounded-full hover:bg-black hover:text-white transition-all duration-300 text-gray-700 text-lg"
      >
        {icon}
      </Link>
    </motion.div>
  );
}