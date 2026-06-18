'use client';

import AchievementsSection from "@/components/custom-new/achievements";
import ContactForm from "@/components/custom-new/contact-form";
import Footer from "@/components/custom-new/footer";
import HomeAboutSection from "@/components/custom-new/home-about";
import HomeHero from "@/components/custom-new/home-hero";
import HomeProjects from "@/components/custom-new/home-selected-work";
import TechToolsSection from "@/components/custom-new/home-tech-tools";
import JourneySection from "@/components/custom-new/journey";
import SectionSeparator from "@/components/custom-new/section-separator";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home_bg";
import TargetCursor from "@/components/TargetCursor";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">

      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
      />

      {/* Background gradient and top border */}
      <HomeBackground />
      <FloatingHeader />
      <HomeHero />
      <div className="relative bg-[#0b001a]">
        <HomeAboutSection />
        <SectionSeparator />
        <TechToolsSection />
        <SectionSeparator />
        <HomeProjects />
        <SectionSeparator />
        <JourneySection />
        <SectionSeparator />
        <AchievementsSection />
        <SectionSeparator />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
}