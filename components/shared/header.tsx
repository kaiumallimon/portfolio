'use client';

import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'projects', 'activities', 'achievements', 'contact'];
      let currentSection = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section top is above viewport center
          if (rect.top <= window.innerHeight / 2 && rect.bottom > 0) {
            currentSection = section;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('#')) {
      return activeSection === href.slice(1);
    }
    // For page routes, check if pathname starts with href (to include sub-routes)
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
    { href: '/projects', label: 'Projects' },
    { href: '#activities', label: 'Activities' },
    { href: '#achievements', label: 'Achievements' },
    { href: '/tools', label: 'Tools' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl "
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-transparent backdrop-blur-md border border-slate-700/30 rounded-full pl-6 pr-4 py-3 flex items-center justify-between shadow-2xl shadow-black/50"
      >
        <a
          href="/"
          className="text-slate-100 font-medium tracking-tight flex items-center gap-2 cursor-target hover:text-indigo-500 transition-colors duration-500"
        >
          Kaium Al Limon
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`cursor-target px-3 py-1.5 text-sm rounded-full transition-all duration-300 relative group ${
                isActive(item.href)
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {/* Modern underline effect */}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-linear-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ${
                  isActive(item.href) ? 'w-6' : 'w-0 group-hover:w-6'
                }`}
              />
              {/* Background glow for active */}
              {isActive(item.href) && (
                <span className="absolute inset-0 rounded-full bg-indigo-500/10 border border-indigo-500/30 z-0" />
              )}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="cursor-target ml-4 px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all font-medium"
          >
            Contact
          </a>
        </div>

        <button
          className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors duration-300 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 w-full bg-transparent border border-slate-700/30 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-2 md:hidden"
          >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                handleNavClick(e, item.href);
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-sm cursor-target transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-200'
                  : 'hover:bg-white/5'
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
            className="p-3 rounded-xl text-sm cursor-target transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Contact
          </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}