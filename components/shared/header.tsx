'use client';

import { Menu, X, ArrowUpRight, Sparkles, Send, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { springs, useMagnetic } from '@/lib/motion';
import GradualBlur from './gradual-blur';

function MagneticNavButton({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(0.2);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.a
        style={{ x, y }}
        href={href}
        onClick={onClick}
        className={`cursor-target px-3.5 py-1.5 text-xs rounded-full transition-all relative block select-none ${
          active
            ? 'text-white font-semibold shadow-sm'
            : 'text-slate-400 hover:text-slate-200 font-medium'
        }`}
      >
        {active && (
          <motion.div
            layoutId="active-nav-indicator"
            transition={springs.snappy}
            className="absolute inset-0 rounded-full bg-slate-900/85 border border-indigo-500/40 shadow-md shadow-indigo-500/20 backdrop-blur-xl z-0 overflow-hidden"
          >
            {/* Top specular subtle highlight */}
            <div className="absolute top-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
            {/* Bottom electric indigo light beam */}
            <div className="absolute -bottom-px inset-x-2 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_8px_#818cf8] pointer-events-none" />
          </motion.div>
        )}
        <span className="relative z-10">{label}</span>
      </motion.a>
    </div>
  );
}

function MagneticContactButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(0.25);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.a
        style={{ x, y }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={springs.snappy}
        href="#contact"
        onClick={onClick}
        className="cursor-target group relative inline-flex items-center justify-center h-8 min-w-[110px] overflow-hidden rounded-full p-1 ps-3.5 pe-8 text-xs font-semibold text-slate-200 hover:text-white transition-all duration-500 hover:ps-8 hover:pe-3.5 bg-slate-900/80 hover:bg-slate-800/90 border border-white/12 hover:border-indigo-500/50 shadow-lg shadow-black/40 hover:shadow-indigo-500/25 backdrop-blur-xl select-none"
      >
        <span className="relative z-10 transition-all duration-500 leading-none whitespace-nowrap">
          Let's Talk
        </span>
        <div className="absolute right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-500 text-white border border-indigo-400/50 shadow-md shadow-indigo-600/30 transition-all duration-500 group-hover:right-[calc(100%-28px)] shrink-0">
          <ArrowUpRight size={13} className="transition-transform duration-500" />
        </div>
      </motion.a>
    </div>
  );
}

export default function FloatingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [displayName, setDisplayName] = useState('Kaium Al Limon');
  const [available, setAvailable] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPodRef = useRef<HTMLDivElement>(null);
  const centerPodRef = useRef<HTMLDivElement>(null);
  const rightPodRef = useRef<HTMLDivElement>(null);

  // Fetch display name and availability from settings
  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d) {
          if (d.display_name) setDisplayName(d.display_name);
          if (typeof d.available_status === 'boolean') setAvailable(d.available_status);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Prevent background scroll when mobile sheet is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // GSAP Staggered Tri-Dock Entrance Timeline (Synchronized with Preloader)
  useEffect(() => {
    if (!containerRef.current) return;

    const pods = [leftPodRef.current, centerPodRef.current, rightPodRef.current].filter(Boolean);

    // Initial hidden state off-top
    gsap.set(pods, { y: -35, opacity: 0, scale: 0.96 });

    const runEntrance = () => {
      gsap.to(pods, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 0.15,
      });
    };

    const isPreloaderActive = typeof window !== 'undefined' && (window as any).__PRELOADER_ACTIVE__;

    if (isPreloaderActive) {
      window.addEventListener('preloader-exit', runEntrance, { once: true });
      return () => window.removeEventListener('preloader-exit', runEntrance);
    } else {
      runEntrance();
    }
  }, []);

  // Scroll detection & Section spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = [
        'about',
        'skills',
        'impact',
        'projects',
        'contributions',
        'languages',
        'activities',
        'achievements',
        'contact',
      ];
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
      const section = href.slice(1);
      if (section === 'contributions') {
        return activeSection === 'contributions' || activeSection === 'languages';
      }
      return activeSection === section;
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
    { href: '#projects', label: 'Projects' },
    { href: '#contributions', label: 'GitHub' },
    { href: '#activities', label: 'Activities' },
    { href: '#achievements', label: 'Achievements' },
  ];

  return (
    <>
      {/* React Bits Gradual Blur Veil (Expanded Surface Area) */}
      <GradualBlur
        position="top"
        height="8.5rem"
        layers={10}
        maxBlur={36}
        tint="from-slate-950/70 via-slate-950/25 to-transparent"
      />

      {/* Floating Header Bar (Clean Minimalist Overlay with Gradual Blur) */}
      <header
        ref={containerRef}
        className="fixed top-3 sm:top-4 inset-x-0 z-50 pointer-events-none px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4"
      >
        {/* Left Pod: Identity Badge */}
        <div
          ref={leftPodRef}
          className="pointer-events-auto flex items-center gap-2.5 py-1.5"
        >
          <a
            href="/"
            className="cursor-target flex items-center gap-2 text-white font-bold text-xs sm:text-sm tracking-tight group"
          >
            <span className="truncate max-w-[130px] sm:max-w-none text-slate-200 group-hover:text-white transition-colors">
              {displayName}
            </span>
          </a>

          {/* Availability Pulse Light */}
          <div
            title={available ? 'Open for Work' : 'Currently Engaged'}
            className="flex items-center gap-1.5 pl-2 border-l border-white/10 text-[11px] text-emerald-400 font-medium hidden sm:flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] text-slate-400">Available</span>
          </div>
        </div>

        {/* Center Pod: Floating Nav Orbiter (Desktop) */}
        <nav
          ref={centerPodRef}
          aria-label="Main Navigation"
          className="pointer-events-auto hidden lg:flex items-center gap-1 py-1"
        >
          {navItems.map((item) => (
            <MagneticNavButton
              key={item.href}
              href={item.href}
              label={item.label}
              active={isActive(item.href)}
              onClick={(e) => handleNavClick(e, item.href)}
            />
          ))}
        </nav>

        {/* Right Pod: Action Command Dock */}
        <div
          ref={rightPodRef}
          className="pointer-events-auto flex items-center gap-2.5 py-1"
        >
          {/* Direct Magnetic Contact Button (Desktop/Tablet) */}
          <div className="hidden sm:inline-flex">
            <MagneticContactButton onClick={(e) => handleNavClick(e, '#contact')} />
          </div>

          {/* Mobile Drawer Trigger */}
          <button
            className="lg:hidden text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Navigation Sheet (Right-side slide-in) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Frosted Backdrop Veil */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMobileMenuOpen(false)}
                className="pointer-events-auto fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm lg:hidden"
              />

              {/* Slide-in Sheet Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="pointer-events-auto fixed inset-y-0 right-0 z-[100] w-full max-w-[320px] sm:max-w-[360px] bg-slate-950/95 border-l border-white/10 backdrop-blur-2xl p-6 flex flex-col justify-between shadow-2xl shadow-black/90 lg:hidden"
              >
                {/* Sheet Top: Logo / Brand Identity & Close Trigger */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <a
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="cursor-target flex items-center gap-2 text-white font-bold text-sm tracking-tight group"
                  >
                    <span className="truncate text-slate-200 group-hover:text-white transition-colors font-semibold">
                      {displayName}
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                  </a>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close Navigation Sheet"
                    className="cursor-target w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Sheet Middle: Navigation Links */}
                <nav className="flex flex-col gap-1.5 py-6 overflow-y-auto">
                  {navItems.map((item, idx) => (
                    <motion.a
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.035, duration: 0.2 }}
                      href={item.href}
                      onClick={(e) => {
                        handleNavClick(e, item.href);
                        setMobileMenuOpen(false);
                      }}
                      className={`group cursor-target flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            isActive(item.href)
                              ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]'
                              : 'bg-white/20 group-hover:bg-indigo-400/60'
                          }`}
                        />
                        {item.label}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400 group-hover:text-indigo-400"
                      />
                    </motion.a>
                  ))}
                </nav>

                {/* Sheet Bottom: Telemetry & Signature Header CTA Button */}
                <div className="pt-5 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      <span>{available ? "Open for Work" : "Busy"}</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">UTC+6 Dhaka</span>
                  </div>

                  {/* Header CTA Button (Same sliding badge architecture) */}
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springs.snappy}
                    href="#contact"
                    onClick={(e) => {
                      handleNavClick(e, '#contact');
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-target group relative flex items-center justify-center h-12 w-full overflow-hidden rounded-full p-1 ps-5 pe-12 text-sm font-semibold text-white transition-all duration-500 hover:ps-12 hover:pe-5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 shadow-xl shadow-indigo-600/30 select-none"
                  >
                    <span className="relative z-10 transition-all duration-500 leading-none whitespace-nowrap">
                      Let's Talk
                    </span>
                    <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-700 shadow-md transition-all duration-500 group-hover:right-[calc(100%-44px)] shrink-0">
                      <ArrowUpRight size={16} className="transition-transform duration-500" />
                    </div>
                  </motion.a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}