import { Github, Linkedin, Mail, Twitter, Heart } from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/kaiumallimon", label: "GitHub" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/kaiumallimon", label: "LinkedIn" },
    { icon: FaFacebook, href: "https://facebook.com/kaiumallimon", label: "Twitter" },
    { icon: Mail, href: "mailto:kalimon291@gmail.com", label: "Email" },
  ];

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Activities", href: "#activities" },
    { name: "Achievements", href: "#achievements" },
    { name: "Tools", href: "/tools" },
    { name: "Github Unwrapped", href: "/tools/github-unwrapped" },
    { name: "UIU Exam Routine", href: "/tools/uiu-exam-routine" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Kaium Al Limon</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Flutter Specialist & Full-Stack Engineer building high-performance applications.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-target"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>
            © {currentYear} Kaium Al Limon. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
