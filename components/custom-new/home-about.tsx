"use client";

import { GraduationCap, Award, Book } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import type { Education, SiteSettings } from "@/types/content";
import { springs, use3DTilt, useMagnetic } from "@/lib/motion";
import { ScrollRevealSection, ScrollReveal } from "@/components/shared/scroll-reveal";

const ICONS: Record<string, typeof GraduationCap> = {
  GraduationCap,
  Award,
  Book,
};

function MagneticSocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic(0.35);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.a
        style={{ x, y }}
        whileHover={{ scale: 1.15, rotate: 4 }}
        whileTap={{ scale: 0.9 }}
        transition={springs.snappy}
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        aria-label={label}
        className="cursor-target flex items-center justify-center w-11 h-11 border border-white/10 rounded-full bg-white/5 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-colors shadow-md"
      >
        <Icon size={18} />
      </motion.a>
    </div>
  );
}

export default function HomeAboutSection({
  education,
  settings,
}: {
  education: Education[];
  settings: SiteSettings | null;
}) {
  const bioParagraphs = (settings?.about_bio || "").split("\n\n").filter(Boolean);
  const github = settings?.github_url || "https://github.com/kaiumallimon";
  const linkedin = settings?.linkedin_url || "https://linkedin.com/in/kaiumallimon";
  const email = settings?.email || "kalimon291@gmail.com";
  const facebook = settings?.facebook_url || "https://facebook.com/kaiumallimon";

  const cardTilt = use3DTilt({ maxTilt: 6, scale: 1.01 });

  return (
    <ScrollRevealSection
      id="about"
      className="py-24 px-6 max-w-6xl mx-auto relative z-10"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Bio and Vision */}
        <div className="space-y-8">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
              About Me
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Engineering beyond the framework.
            </h2>
          </div>

          <div className="text-sm md:text-base space-y-4 text-slate-300/90 leading-relaxed font-normal">
            {bioParagraphs.length > 0 ? (
              bioParagraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>
                I am a Software Engineer focused on building clean, scalable software across mobile and web.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <MagneticSocialLink href={github} icon={FaGithub} label="GitHub" />
            <MagneticSocialLink href={linkedin} icon={FaLinkedin} label="LinkedIn" />
            <MagneticSocialLink href={`mailto:${email}`} icon={MdEmail} label="Email" />
            <MagneticSocialLink href={facebook} icon={FaFacebook} label="Facebook" />
          </div>
        </div>

        {/* Right: 3D Tilt Education Glass Card */}
        <div
          ref={cardTilt.ref}
          onMouseMove={cardTilt.handleMouseMove}
          onMouseLeave={cardTilt.handleMouseLeave}
          className="perspective-1000"
        >
          <motion.div
            style={cardTilt.style}
            className="border border-white/10 bg-slate-900/40 backdrop-blur-xl p-7 md:p-9 rounded-3xl relative overflow-hidden shadow-2xl shadow-black/40 group hover:border-indigo-500/30 transition-colors"
          >
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Education</h3>
                <p className="text-xs text-slate-400 mt-0.5">Academic Foundation & Certifications</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Book size={18} className="text-indigo-400" />
              </div>
            </div>

            <div className="space-y-0 relative z-10">
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-500/40 to-transparent" />

              {education.map((edu) => {
                const IconComponent = ICONS[edu.status === "current" ? "GraduationCap" : "Award"] || GraduationCap;
                const isCurrent = edu.status === "current";

                return (
                  <div key={edu.id} className="relative pl-14 py-4 group/item">
                    <div
                      className={`absolute left-0 top-5 w-7 h-7 rounded-full ring-4 ring-slate-950 flex items-center justify-center transition-all ${
                        isCurrent
                          ? "bg-indigo-500 shadow-md shadow-indigo-500/50"
                          : "bg-slate-800 border border-slate-700"
                      }`}
                    >
                      <IconComponent size={13} className="text-white" />
                    </div>

                    <div className="bg-white/3 border border-white/6 rounded-2xl p-4 hover:bg-white/6 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-white font-semibold text-sm leading-snug">{edu.degree}</h4>
                        {isCurrent && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 rounded-full shrink-0">
                            Current
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-medium ${isCurrent ? "text-indigo-300" : "text-slate-400"}`}>
                        {edu.institution}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{edu.period}</p>
                      {edu.description && (
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </ScrollRevealSection>
  );
}
