'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, GitCommitHorizontal, Mail, MapPin, Star } from 'lucide-react';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiDart, SiFlutter } from 'react-icons/si';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ScrollReveal,
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/shared/scroll-reveal';

const GITHUB_USERNAME = 'kaiumallimon';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#impact', label: 'Impact' },
  { href: '/projects', label: 'Projects' },
  { href: '#contributions', label: 'Open Source' },
  { href: '#languages', label: 'Languages' },
  { href: '#activities', label: 'Activities' },
  { href: '#achievements', label: 'Achievements' },
  { href: '/tools', label: 'Tools' },
];

const toolLinks = [
  { href: '/tools/github-unwrapped', label: 'GitHub Unwrapped' },
  { href: '/tools/uiu-exam-routine', label: 'UIU Exam Routine' },
  { href: '/tools/uiu-cgpa-calculator', label: 'UIU CGPA Calculator' },
];

const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/kaiumallimon', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/kaiumallimon', label: 'LinkedIn' },
  { icon: FaFacebook, href: 'https://facebook.com/kaiumallimon', label: 'Facebook' },
  { icon: Mail, href: 'mailto:kalimon291@gmail.com', label: 'Email' },
];

interface FooterStats {
  totalContributions: number;
  totalStars: number;
  totalRepos: number;
  topLanguage: string;
}

function StatPill({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      {loading ? (
        <>
          <Skeleton className="h-5 w-12 mb-1.5 bg-slate-700" />
          <Skeleton className="h-3 w-20 bg-slate-700" />
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-white tabular-nums">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </>
      )}
    </div>
  );
}

export default function FlutterFooter() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [stats, setStats] = useState<FooterStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/github/${GITHUB_USERNAME}`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalContributions: data.stats?.totalContributions ?? 0,
            totalStars: data.stats?.totalStars ?? 0,
            totalRepos: data.stats?.totalRepos ?? 0,
            topLanguage: data.stats?.topLanguage ?? '—',
          });
        }
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && pathname !== '/') {
      e.preventDefault();
      window.location.href = '/' + href;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ScrollRevealSection as="footer" className="relative px-6 pb-8 pt-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
        <div className="relative border border-slate-700/30 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

          <div className="p-6 md:p-8 lg:p-10">
            <ScrollRevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
              <ScrollRevealStaggerItem className="lg:col-span-4 space-y-5">
                <div>
                  <a
                    href="/"
                    className="text-xl font-semibold text-white hover:text-indigo-400 transition-colors cursor-target"
                  >
                    Kaium Al Limon
                  </a>
                  <p className="text-sm text-slate-400 leading-relaxed mt-3">
                    Flutter Developer crafting cross-platform mobile apps with clean architecture, expressive UIs, and production-ready Dart.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                    </span>
                    Available for work
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs">
                    <MapPin size={12} />
                    Dhaka, Bangladesh
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <SiFlutter size={18} className="text-blue-400" />
                  <SiDart size={16} className="text-cyan-400" />
                  <span className="text-xs">Flutter · Dart · Firebase</span>
                </div>

                <div className="flex gap-2">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all cursor-target"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </ScrollRevealStaggerItem>

              <ScrollRevealStaggerItem className="lg:col-span-3 space-y-4">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Navigate</h4>
                <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-target"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="inline-flex mt-2 px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all font-medium cursor-target"
                >
                  Contact
                </a>
              </ScrollRevealStaggerItem>

              <ScrollRevealStaggerItem className="lg:col-span-2 space-y-4">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Tools</h4>
                <nav className="space-y-2">
                  {toolLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-target group"
                    >
                      {link.label}
                      <ArrowUpRight size={14} className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </a>
                  ))}
                </nav>
              </ScrollRevealStaggerItem>

              <ScrollRevealStaggerItem className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Live Snapshot</h4>
                  <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-target"
                  >
                    @{GITHUB_USERNAME}
                    <ArrowUpRight size={12} />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatPill
                    label="Contributions"
                    value={stats?.totalContributions.toLocaleString() ?? '—'}
                    loading={statsLoading}
                  />
                  <StatPill
                    label="GitHub Stars"
                    value={stats?.totalStars.toLocaleString() ?? '—'}
                    loading={statsLoading}
                  />
                  <StatPill
                    label="Public Repos"
                    value={stats?.totalRepos.toLocaleString() ?? '—'}
                    loading={statsLoading}
                  />
                  <StatPill
                    label="Top Language"
                    value={stats?.topLanguage ?? '—'}
                    loading={statsLoading}
                  />
                </div>

                {!statsLoading && stats && (
                  <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <GitCommitHorizontal size={12} className="text-indigo-400" />
                      Last 12 months
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star size={12} className="text-yellow-400" />
                      Open source
                    </span>
                  </div>
                )}
              </ScrollRevealStaggerItem>
            </ScrollRevealStagger>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 px-6 md:px-8 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <p>© {currentYear} Kaium Al Limon. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a
                href="mailto:kalimon291@gmail.com"
                className="hover:text-indigo-400 transition-colors cursor-target"
              >
                kalimon291@gmail.com
              </a>
              <button
                onClick={scrollToTop}
                className="hover:text-indigo-400 transition-colors cursor-target"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </ScrollRevealSection>
  );
}
