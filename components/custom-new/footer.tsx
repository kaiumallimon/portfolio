'use client';

import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  GitCommitHorizontal,
  Mail,
  MapPin,
  Star,
  ArrowUp,
  Zap,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import {
  SiDart,
  SiFlutter,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiPython,
  SiPostgresql,
} from 'react-icons/si';
import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/shared/scroll-reveal';
import { springs, use3DTilt, useMagnetic } from '@/lib/motion';

const GITHUB_USERNAME = 'kaiumallimon';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#impact', label: 'Impact' },
  { href: '#projects', label: 'Projects' },
  { href: '#contributions', label: 'GitHub' },
  { href: '#activities', label: 'Activities' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
];

const toolLinks = [
  { href: '/tools/github-unwrapped', label: 'GitHub Unwrapped' },
  { href: '/tools/uiu-exam-routine', label: 'UIU Exam Routine' },
  { href: '/tools/uiu-cgpa-calculator', label: 'UIU CGPA Calculator' },
];

const DEFAULT_FOOTER_DESCRIPTION =
  'Full-Stack Mobile & Web Software Engineer building cross-platform Flutter applications, modern Next.js platforms, and scalable backends with clean architecture and production-ready code.';

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
      className="rounded-2xl border border-white/8 bg-white/4 p-3.5 hover:border-indigo-500/30 hover:bg-white/6 transition-all"
    >
      {loading ? (
        <>
          <Skeleton className="h-5 w-12 mb-1.5 bg-slate-800" />
          <Skeleton className="h-3 w-20 bg-slate-800" />
        </>
      ) : (
        <>
          <p className="text-lg font-bold text-white tabular-nums tracking-tight">{value}</p>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</p>
        </>
      )}
    </motion.div>
  );
}

function BackToTopButton() {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(0.2);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.button
        style={{ x, y }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={springs.snappy}
        onClick={scrollToTop}
        className="cursor-target flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all group"
      >
        <span>Back to top</span>
        <div className="w-5 h-5 rounded-full bg-indigo-600 group-hover:bg-indigo-500 text-white flex items-center justify-center transition-colors">
          <ArrowUp size={11} className="group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </motion.button>
    </div>
  );
}

export default function FlutterFooter() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const [stats, setStats] = useState<FooterStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [site, setSite] = useState<PublicSettings | null>(null);

  const cardTilt = use3DTilt({ maxTilt: 2, scale: 1.002 });

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
            topLanguage: data.stats?.topLanguage ?? 'Dart',
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
  const displayName = site?.display_name ?? 'Kaium Al Limon';
  const location = site?.location ?? 'Dhaka, Bangladesh';
  const available = site?.available_status ?? true;
  const email = site?.email ?? DEFAULT_SOCIALS.email;

  const socials = [
    { icon: FaGithub, href: site?.github_url ?? DEFAULT_SOCIALS.github, label: 'GitHub' },
    { icon: FaLinkedin, href: site?.linkedin_url ?? DEFAULT_SOCIALS.linkedin, label: 'LinkedIn', color: 'text-sky-400' },
    { icon: FaFacebook, href: site?.facebook_url ?? DEFAULT_SOCIALS.facebook, label: 'Facebook', color: 'text-blue-400' },
    { icon: Mail, href: `mailto:${email}`, label: 'Email', color: 'text-indigo-400' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && pathname !== '/') {
      e.preventDefault();
      window.location.href = '/' + href;
    }
  };

  return (
    <ScrollRevealSection as="footer" className="relative px-6 pb-12 pt-6 max-w-6xl mx-auto z-10">
      <div className="max-w-6xl mx-auto">
        <div
          data-gsap-card
          ref={cardTilt.ref}
          onMouseMove={cardTilt.handleMouseMove}
          onMouseLeave={cardTilt.handleMouseLeave}
          className="perspective-1000"
        >
          <motion.div
            style={cardTilt.style}
            className="relative border border-white/10 bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Ambient Specular Highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-7 md:p-10 lg:p-12 relative z-10">
              <ScrollRevealStagger className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
                {/* Brand & Engineering Philosophy Column (4 cols) */}
                <ScrollRevealStaggerItem className="lg:col-span-4 space-y-6">
                  <div>
                    <a
                      href="/"
                      className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors cursor-target tracking-tight inline-block"
                    >
                      {displayName}
                    </a>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed mt-3">
                      {footerDescription}
                    </p>
                  </div>

                  {/* Availability & Location Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      {available ? 'Available for work' : 'Currently Engaged'}
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-slate-400 text-xs font-medium">
                      <MapPin size={12} className="text-cyan-400" />
                      {location}
                    </span>
                  </div>

                  {/* Core Stack Spec Icons */}
                  <div className="flex flex-col gap-2 text-slate-500">
                    <div className="flex flex-wrap items-center gap-3">
                      <span title="Flutter"><SiFlutter size={19} className="text-cyan-400" /></span>
                      <span title="Dart"><SiDart size={18} className="text-blue-400" /></span>
                      <span title="Next.js"><SiNextdotjs size={18} className="text-white" /></span>
                      <span title="TypeScript"><SiTypescript size={18} className="text-blue-400" /></span>
                      <span title="Python"><SiPython size={18} className="text-amber-400" /></span>
                      <span title="Node.js"><SiNodedotjs size={18} className="text-emerald-400" /></span>
                      <span title="PostgreSQL"><SiPostgresql size={18} className="text-indigo-400" /></span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Flutter · Next.js · TypeScript · FastAPI · PostgreSQL
                    </span>
                  </div>

                  {/* Social Channels Dock */}
                  <div className="flex gap-2 pt-1">
                    {socials.map((social) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.label}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.92 }}
                          transition={springs.snappy}
                          href={social.href}
                          target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                          rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                          aria-label={social.label}
                          className="w-10 h-10 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-slate-300 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all cursor-target"
                        >
                          <Icon size={17} className={social.color} />
                        </motion.a>
                      );
                    })}
                  </div>
                </ScrollRevealStaggerItem>

                {/* Navigation Column (3 cols) */}
                <ScrollRevealStaggerItem className="lg:col-span-3 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers size={13} className="text-indigo-400" />
                    <span>Navigation</span>
                  </h4>

                  <nav className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {navItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="text-xs sm:text-sm text-slate-400 hover:text-indigo-300 transition-colors cursor-target font-medium"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </ScrollRevealStaggerItem>

                {/* Tools Hub Column (2 cols) */}
                <ScrollRevealStaggerItem className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Code2 size={13} className="text-cyan-400" />
                    <span>Tools Hub</span>
                  </h4>

                  <nav className="space-y-2.5">
                    {toolLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-cyan-300 transition-colors cursor-target group font-medium"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight
                          size={13}
                          className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all text-cyan-400"
                        />
                      </a>
                    ))}
                  </nav>
                </ScrollRevealStaggerItem>

                {/* GitHub Telemetry Scorecard Column (3 cols) */}
                <ScrollRevealStaggerItem className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu size={13} className="text-amber-400" />
                      <span>Live Telemetry</span>
                    </h4>
                    <a
                      href={`https://github.com/${GITHUB_USERNAME}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-target font-semibold"
                    >
                      @{GITHUB_USERNAME}
                      <ArrowUpRight size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
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
                      value={stats?.topLanguage ?? 'Dart'}
                      loading={statsLoading}
                    />
                  </div>

                  {!statsLoading && (
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <GitCommitHorizontal size={12} className="text-indigo-400" />
                        Live sync
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400" />
                        Open Source
                      </span>
                    </div>
                  )}
                </ScrollRevealStaggerItem>
              </ScrollRevealStagger>
            </div>

            {/* Bottom Bar: Copyright & Back to Top */}
            <div className="border-t border-white/8 px-7 md:px-10 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>© {currentYear} {displayName}. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a
                  href={`mailto:${email}`}
                  className="hover:text-indigo-400 transition-colors cursor-target font-medium"
                >
                  {email}
                </a>
                <span className="text-white/10 hidden sm:inline">|</span>
                <BackToTopButton />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ScrollRevealSection>
  );
}