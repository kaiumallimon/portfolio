'use client';

import FlutterAchievementsSection from "@/components/flutter-portfolio/achievements";
import FlutterContactForm from "@/components/flutter-portfolio/contact-form";
import FlutterFooter from "@/components/flutter-portfolio/footer";
import FlutterHomeAboutSection from "@/components/flutter-portfolio/home-about";
import FlutterHomeHero from "@/components/flutter-portfolio/home-hero";
import HomeProjects from "@/components/custom-new/home-selected-work";
import FlutterTechToolsSection from "@/components/flutter-portfolio/home-tech-tools";
import FlutterGithubContributions from "@/components/flutter-portfolio/github-contributions";
import FlutterLanguageBreakdown from "@/components/flutter-portfolio/language-breakdown";
import FlutterJourneySection from "@/components/flutter-portfolio/journey";
import FlutterPortfolioImpact from "@/components/flutter-portfolio/portfolio-impact";
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

      <HomeBackground />
      <FloatingHeader />
      <FlutterHomeHero />
      <div className="relative bg-[#0b001a]">
        <FlutterHomeAboutSection />
        <SectionSeparator />
        <FlutterTechToolsSection />
        <SectionSeparator />
        <FlutterPortfolioImpact />
        <SectionSeparator />
        <HomeProjects />
        <SectionSeparator />
        <FlutterGithubContributions />
        <SectionSeparator />
        <FlutterLanguageBreakdown />
        <SectionSeparator />
        <FlutterJourneySection />
        <SectionSeparator />
        <FlutterAchievementsSection />
        <SectionSeparator />
        <FlutterContactForm />
        <FlutterFooter />
      </div>
    </div>
  );
}
