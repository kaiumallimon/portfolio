'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, GitCommitHorizontal, Mail, MapPin, Star } from 'lucide-react';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import {
  SiDart,
  SiFlutter,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
} from 'react-icons/si';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  ScrollReveal,
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/shared/scroll-reveal';
import { springs } from '@/lib/motion';

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

const DEFAULT_FOOTER_DESCRIPTION =
  'Full-Stack Mobile & Web Software Engineer building cross-platform apps, modern web experiences, and scalable backends with clean architecture and production-ready code.';

const DEFAULT_SOCIALS = {
  github: 'https://github.com/kaiumallimon',
  linkedin: 'https://linkedin.com/in/kaiumallimon',
  facebook: 'https://facebook.com/kaiumallimon',
  email: 'kalimon291@gmail.com',
};

interface PublicSettings {
  display_name: string | null;
  available_status: boolean | null;
  footer_description: string | null;
  facebook_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  location: string | null;
}

interface FooterStats {
  totalContributions: number;
  totalStars: number;
  totalRepos: number;
  topLanguage: string;
}

function StatPill({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={springs.snappy}
      className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 hover:border-indigo-500/20 transition-all"
    >
      {loading ? (
        <>
          <Skeleton className="h-5 w-12 mb-1.5 bg-slate-800" />
          <Skeleton className="h-3 w-20 bg-slate-800" />
        </>
      ) : (
        <>
          <p className="text-lg font-bold text-white tabular-nums">{value}</p>
          <p className="text-[11px] text-slate-400 font-medium">{label}</p>
        </>
      )}
    </motion.div>
  );
}

export default function FlutterFooter() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [stats, setStats] = useState<FooterStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [site, setSite] = useState<PublicSettings | null>(null);

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

  useEffect(() => {
    async function fetchSite() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) setSite(await res.json());
      } catch {
        /* keep defaults */
      }
    }
    fetchSite();
  }, []);

  const footerDescription = site?.footer_description ?? DEFAULT_FOOTER_DESCRIPTION;
  const displayName = site?.display_name ?? "Kaium Al Limon";
  const location = site?.location ?? "Dhaka, Bangladesh";
  const available = site?.available_status ?? true;
  const socials = [
    { icon: FaGithub, href: site?.github_url ?? DEFAULT_SOCIALS.github, label: 'GitHub' },
    { icon: FaLinkedin, href: site?.linkedin_url ?? DEFAULT_SOCIALS.linkedin, label: 'LinkedIn' },
    { icon: FaFacebook, href: site?.facebook_url ?? DEFAULT_SOCIALS.facebook, label: 'Facebook' },
    { icon: Mail, href: `mailto:${site?.email ?? DEFAULT_SOCIALS.email}`, label: 'Email' },
  ];
  const email = site?.email ?? DEFAULT_SOCIALS.email;

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
    <ScrollRevealSection as="footer" className="relative px-6 pb-10 pt-6 max-w-6xl mx-auto z-10">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="relative border border-white/10 bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

            <div className="p-7 md:p-10 lg:p-12">
              <ScrollRevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
                {/* Brand Column */}
                <ScrollRevealStaggerItem className="lg:col-span-4 space-y-6">
                  <div>
                    <a
                      href="/"
                      className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors cursor-target tracking-tight"
                    >
                      {displayName}
                    </a>
                    <p className="text-sm text-slate-400 leading-relaxed mt-3">
                      {footerDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                      </span>
                      {available ? "Available for work" : "Unavailable"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400 text-xs font-medium">
                      <MapPin size={12} className="text-indigo-400" />
                      {location}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5 text-slate-500">
                    <div className="flex flex-wrap items-center gap-3">
                      <SiFlutter size={20} className="text-cyan-400" />
                      <SiDart size={18} className="text-blue-400" />
                      <SiNextdotjs size={18} className="text-white" />
                      <SiTypescript size={18} className="text-blue-500" />
                      <SiNodedotjs size={18} className="text-emerald-500" />
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Flutter · Next.js · TypeScript · Node.js</span>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    {socials.map((social) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.label}
                          whileHover={{ scale: 1.12, y: -2 }}
                          whileTap={{ scale: 0.92 }}
                          transition={springs.snappy}
                          href={social.href}
                          target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                          rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                          aria-label={social.label}
                          className="w-10 h-10 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-300 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all cursor-target"
                        >
                          <Icon size={18} />
                        </motion.a>
                      );
                    })}
                  </div>
                </ScrollRevealStaggerItem>

                {/* Navigation Column */}
                <ScrollRevealStaggerItem className="lg:col-span-3 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
                  <nav className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {navItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="text-sm text-slate-400 hover:text-indigo-300 transition-colors cursor-target"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springs.snappy}
                    href="#contact"
                    onClick={(e) => handleNavClick(e, '#contact')}
                    className="inline-flex mt-3 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-all shadow-md shadow-indigo-500/20 cursor-target"
                  >
                    Get in Touch
                  </motion.a>
                </ScrollRevealStaggerItem>

                {/* Tools Column */}
                <ScrollRevealStaggerItem className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tools Hub</h4>
                  <nav className="space-y-2.5">
                    {toolLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-300 transition-colors cursor-target group"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={14} className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-indigo-400" />
                      </a>
                    ))}
                  </nav>
                </ScrollRevealStaggerItem>

                {/* Telemetry Column */}
                <ScrollRevealStaggerItem className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Metrics</h4>
                    <a
                      href={`https://github.com/${GITHUB_USERNAME}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-target font-medium"
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
                        <GitCommitHorizontal size={13} className="text-indigo-400" />
                        Last 12 months
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Star size={13} className="text-amber-400" />
                        Open Source
                      </span>
                    </div>
                  )}
                </ScrollRevealStaggerItem>
              </ScrollRevealStagger>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/8 px-7 md:px-10 lg:px-12 py-4.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>© {currentYear} {displayName}. All rights reserved.</p>
              <div className="flex items-center gap-5">
                <a
                  href={`mailto:${email}`}
                  className="hover:text-indigo-400 transition-colors cursor-target"
                >
                  {email}
                </a>
                <button
                  onClick={scrollToTop}
                  className="hover:text-indigo-400 transition-colors cursor-target flex items-center gap-1 font-medium"
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