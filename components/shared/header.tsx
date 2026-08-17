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

  // GSAP Staggered Tri-Dock Entrance Timeline
  useEffect(() => {
    if (!containerRef.current) return;

    const pods = [leftPodRef.current, centerPodRef.current, rightPodRef.current].filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pods,
        { y: -32, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.06,
          ease: 'power4.out',
          delay: 0.05,
        }
      );
    }, containerRef);

    return () => ctx.revert();
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
    { href: '#projects', label: 'Projects' },
    { href: '#contributions', label: 'Open Source' },
    { href: '#languages', label: 'Distribution' },
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
        className="fixed top-3.5 sm:top-4 inset-x-0 z-50 pointer-events-none px-6 max-w-7xl mx-auto flex items-center justify-between gap-4"
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
            title={available ? 'Available for Projects' : 'Currently Engaged'}
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
          {/* Direct Magnetic Contact Button */}
          <MagneticContactButton onClick={(e) => handleNavClick(e, '#contact')} />

          {/* Mobile Drawer Trigger */}
          <button
            className="lg:hidden text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={springs.bouncy}
              className="pointer-events-auto absolute top-14 left-4 right-4 bg-slate-950/95 border border-white/10 backdrop-blur-3xl rounded-3xl p-4 flex flex-col gap-1 shadow-2xl shadow-black/90 lg:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-2xl text-xs sm:text-sm cursor-target transition-all ${
                    isActive(item.href)
                      ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 font-semibold'
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
                className="p-3 mt-1 rounded-2xl text-xs sm:text-sm cursor-target text-center bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-1.5"
              >
                <span>Get in Touch</span>
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}