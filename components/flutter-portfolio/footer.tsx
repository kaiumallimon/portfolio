'use client';

import { Mail } from "lucide-react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

export default function FlutterFooter() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/kaiumallimon", label: "GitHub" },
    { icon: FaLinkedin, href: "https://linkedin.com/in/kaiumallimon", label: "LinkedIn" },
    { icon: FaFacebook, href: "https://facebook.com/kaiumallimon", label: "Facebook" },
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
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Kaium Al Limon</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Flutter Developer building beautiful, performant cross-platform mobile applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h4>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-target"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all cursor-target"
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-slate-400"
        >
          <p>
            © {currentYear} Kaium Al Limon. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
