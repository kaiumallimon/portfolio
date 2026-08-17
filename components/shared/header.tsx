'use client';

import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/lib/motion';

export default function FloatingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [displayName, setDisplayName] = useState("Kaium Al Limon");
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.display_name) setDisplayName(d.display_name);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'impact', 'projects', 'contributions', 'languages', 'activities', 'achievements', 'contact'];
      let currentSection = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom > 0) {
            currentSection = section;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('#')) {
      return activeSection === href.slice(1);
    }
    return pathname.startsWith(href);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && pathname !== '/') {
      e.preventDefault();
      window.location.href = '/' + href;
    }
  };

  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#impact', label: 'Impact' },
    { href: '/projects', label: 'Projects' },
    { href: '#contributions', label: 'Open Source' },
    { href: '#activities', label: 'Activities' },
    { href: '#achievements', label: 'Achievements' },
    { href: '/tools', label: 'Tools' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springs.gentle}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl pointer-events-auto"
    >
      <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-full pl-6 pr-3.5 py-2.5 flex items-center justify-between shadow-2xl shadow-black/60">
        <a
          href="/"
          className="text-slate-100 font-semibold tracking-tight flex items-center gap-2 cursor-target hover:text-indigo-400 transition-colors"
        >
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          {displayName}
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`cursor-target px-3.5 py-1.5 text-sm rounded-full transition-colors relative ${
                  active ? 'text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-nav-pill"
                    transition={springs.snappy}
                    className="absolute inset-0 rounded-full bg-indigo-500/15 border border-indigo-500/30 z-0"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
            onClick={(e) => handleNavClick(e, '#contact')}
            className="cursor-target ml-3 px-5 py-2 text-sm bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-full font-medium shadow-lg shadow-indigo-500/25 transition-all"
          >
            Contact
          </motion.a>
        </div>

        <button
          className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={springs.bouncy}
            className="absolute top-16 left-0 w-full bg-slate-950/90 border border-white/10 backdrop-blur-2xl rounded-2xl p-4 flex flex-col gap-2 shadow-2xl lg:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleNavClick(e, item.href);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-sm cursor-target transition-all ${
                  isActive(item.href)
                    ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 font-medium'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                handleNavClick(e, '#contact');
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl text-sm cursor-target text-center bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/25"
            >
              Contact
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}