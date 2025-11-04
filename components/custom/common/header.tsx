"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Geist_Mono, Silkscreen } from "next/font/google";
import { Button } from "../../ui/button";
import Link from "next/link";

const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "#contact" },
    { name: "Blog", href: "#blog" },
  ];

  return (
    <>
      {/* HEADER BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/85 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              className={`${silkscreen.className} font-bold text-2xl md:text-3xl`}
            >
              KAL
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:block bg-transparent py-4">
              <ul className="flex items-center space-x-8 text-sm md:text-base font-medium text-gray-800">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="relative group transition-colors duration-300"
                    >
                      {item.name}
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button
                variant="outline"
                className="rounded-none px-4 hover:bg-black hover:text-white transition-colors duration-300"
              >
                Contact Me <ArrowRight />
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-2 border border-gray-300 bg-white/40 backdrop-blur-sm hover:bg-gray-100 transition-all duration-200"
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU BACKDROP */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* MOBILE MENU PANEL */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-64 z-50 bg-white/80 backdrop-blur-lg border-l border-gray-200 md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <div
                  className={`${silkscreen.className} font-bold text-xl text-gray-900`}
                >
                  KAL
                </div>
                <motion.button
                  onClick={closeMenu}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 pt-6">
                <ul className="flex flex-col space-y-2">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="block px-6 py-3 text-gray-800 hover:bg-gray-100 hover:pl-8 transition-all duration-300"
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Footer CTA */}
              <div className="p-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="w-full rounded-none hover:bg-black hover:text-white transition-all duration-300"
                >
                  Contact Me <ArrowRight />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
