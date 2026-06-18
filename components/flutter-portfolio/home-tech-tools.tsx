'use client';

import { Layers, Smartphone, Cloud } from "lucide-react";
import {
  ScrollReveal,
  ScrollRevealSection,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from "@/components/shared/scroll-reveal";

const techStack = [
  {
    title: "Flutter & Dart",
    icon: Smartphone,
    hoverBorder: "hover:border-blue-500/30",
    iconContainer: "bg-blue-500/10 text-blue-400",
    highlightStyles: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    cardGradient: "bg-gradient-to-br from-blue-500/10 to-transparent",
    cardShadow: "shadow-inner",
    skills: [
      { name: "Flutter", highlight: true },
      { name: "Dart", highlight: true },
      { name: "Material Design", highlight: true },
      { name: "Cupertino Widgets", highlight: false },
      { name: "Custom Widgets", highlight: false },
      { name: "Responsive Layouts", highlight: false },
      { name: "Animations", highlight: false },
      { name: "Navigation 2.0", highlight: false },
      { name: "GoRouter", highlight: false },
      { name: "Platform Channels", highlight: false },
    ]
  },
  {
    title: "Architecture & State",
    icon: Layers,
    hoverBorder: "hover:border-indigo-500/30",
    iconContainer: "bg-indigo-500/10 text-indigo-400",
    highlightStyles: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    cardGradient: "bg-gradient-to-br from-indigo-500/10 to-transparent",
    cardShadow: "shadow-inner",
    skills: [
      { name: "BLoC", highlight: true },
      { name: "Provider", highlight: true },
      { name: "Clean Architecture", highlight: true },
      { name: "GetX", highlight: false },
      { name: "MVVM", highlight: false },
      { name: "Repository Pattern", highlight: false },
      { name: "Dependency Injection", highlight: false },
      { name: "Dio", highlight: false },
    ]
  },
  {
    title: "Platform & Services",
    icon: Cloud,
    hoverBorder: "hover:border-cyan-500/30",
    iconContainer: "bg-cyan-500/10 text-cyan-400",
    highlightStyles: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    cardGradient: "bg-gradient-to-br from-cyan-500/10 to-transparent",
    cardShadow: "shadow-inner",
    skills: [
      { name: "Firebase", highlight: true },
      { name: "Supabase", highlight: true },
      { name: "REST APIs", highlight: true },
      { name: "Hive", highlight: false },
      { name: "SharedPreferences", highlight: false },
      { name: "CI/CD", highlight: false },
    ]
  }
];

export default function FlutterTechToolsSection() {
  return (
    <ScrollRevealSection id="skills" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
      <ScrollReveal className="mb-12">
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">Flutter Toolkit</h2>
        <p className="text-slate-400 max-w-xl">A mobile-first stack built for expressive UIs, maintainable architecture, and shipping production apps to both app stores.</p>
      </ScrollReveal>

      <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {techStack.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <ScrollRevealStaggerItem key={index}>
              <div className={`cursor-target backdrop-blur-md border p-6 rounded-2xl transition-colors h-full ${tech.hoverBorder} ${tech.cardGradient} ${tech.cardShadow}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className={`p-2 rounded-lg ${tech.iconContainer}`}>
                  <Icon size={16} />
                </span>
                <h3 className="font-medium text-white">{tech.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className={`px-3 py-1 text-xs font-medium rounded-md border ${skill.highlight
                      ? `${tech.highlightStyles} border`
                      : "bg-white/5 text-slate-300 border-white/10"
                      }`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
              </div>
            </ScrollRevealStaggerItem>
          );
        })}
      </ScrollRevealStagger>
    </ScrollRevealSection>
  );
}
