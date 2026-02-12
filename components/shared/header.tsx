'use client';

import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function FloatingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl ">
      <div className="bg-transparent backdrop-blur-md border border-slate-700/30 rounded-full pl-6 pr-4 py-3 flex items-center justify-between shadow-2xl shadow-black/50">
        <a href="#" className="text-slate-100 font-medium tracking-tight flex items-center gap-2">
          {/* <span className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400 font-semibold text-xs">KL</span> */}
          <span className="cursor-target">Kaium Al Limon</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          <a href="#about" className="cursor-target px-4 py-1.5 text-sm text-slate-400 hover:text-white transition-colors">About</a>
          <a href="#skills" className="cursor-target px-4 py-1.5 text-sm text-slate-400 hover:text-white transition-colors">Skills</a>
          <a href="#projects" className="cursor-target px-4 py-1.5 text-sm text-slate-400 hover:text-white transition-colors">Projects</a>
          <a href="/tools" className="cursor-target px-4 py-1.5 text-sm text-slate-400 hover:text-white transition-colors">Tools</a>
          <a href="#contact" className="cursor-target ml-2 px-4 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/5">Contact</a>
        </div>

        <button
          className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors duration-300 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-transparent  border border-slate-700/30 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-2 md:hidden animate-fade-in">
          <a href="#about" className="p-3 hover:bg-white/5 transition-all duration-300 rounded-xl text-sm cursor-target" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#skills" className="p-3 hover:bg-white/5 transition-all duration-300 rounded-xl text-sm cursor-target" onClick={() => setMobileMenuOpen(false)}>Skills</a>
          <a href="#projects" className="p-3 hover:bg-white/5 transition-all duration-300 rounded-xl text-sm cursor-target" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="/tools" className="p-3 hover:bg-white/5 transition-all duration-300 rounded-xl text-sm cursor-target" onClick={() => setMobileMenuOpen(false)}>Tools</a>
          <a href="#contact" className="p-3 hover:bg-white/5 transition-all duration-300 rounded-xl text-sm text-indigo-400 cursor-target" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </div>
      )}
    </nav>
  );
}