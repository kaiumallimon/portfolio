import AchievementsSection from "@/components/custom-new/achievements";
import ContactForm from "@/components/custom-new/contact-form";
import FlutterFooter from "@/components/custom-new/footer";
import HomeAboutSection from "@/components/custom-new/home-about";
import HomeHero from "@/components/custom-new/home-hero";
import HomeProjects from "@/components/custom-new/home-selected-work";
import TechToolsSection from "@/components/custom-new/home-tech-tools";
import JourneySection from "@/components/custom-new/journey";
import HobbiesSection from "@/components/custom-new/hobbies";
import SectionSeparator from "@/components/custom-new/section-separator";
import GithubContributions from "@/components/Github-Contributions";
import PortfolioImpact from "@/components/Impacts";
import LanguageBreakdown from "@/components/Language-Breakdown";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home_bg";
import TargetCursor from "@/components/TargetCursor";
import {
  AboutSkeleton,
  AchievementsSkeleton,
  HeroSkeleton,
  HobbiesSkeleton,
  ImpactSkeleton,
  JourneySkeleton,
  ProjectsSkeleton,
  SkillsSkeleton,
} from "@/components/custom-new/section-skeletons";
import {
  getAchievements,
  getActivities,
  getEducation,
  getHobbies,
  getMetrics,
  getProjects,
  getResumeUrl,
  getSiteSettings,
  getSkills,
} from "@/lib/data";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function HeroSection() {
  const [settings, resumeUrl] = await Promise.all([getSiteSettings(), getResumeUrl()]);
  return <HomeHero settings={settings} resumeUrl={resumeUrl} />;
}

async function AboutSection() {
  const [education, settings] = await Promise.all([getEducation(), getSiteSettings()]);
  return <HomeAboutSection education={education} settings={settings} />;
}

async function SkillsSection() {
  const skills = await getSkills();
  return <TechToolsSection skills={skills} />;
}

async function ImpactSection() {
  const metrics = await getMetrics();
  return <PortfolioImpact metrics={metrics} />;
}

async function ProjectsPreviewSection() {
  const projects = await getProjects();
  return <HomeProjects projects={projects} />;
}

async function JourneyViewSection() {
  const activities = await getActivities();
  return <JourneySection activities={activities} />;
}

async function AchievementsViewSection() {
  const achievements = await getAchievements();
  return <AchievementsSection achievements={achievements} />;
}

async function HobbiesViewSection() {
  const hobbies = await getHobbies();
  return <HobbiesSection hobbies={hobbies} />;
}

async function ContactViewSection() {
  const settings = await getSiteSettings();
  return <ContactForm settings={settings} />;
}

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />

      <HomeBackground />
      <FloatingHeader />
      <HomeHeroWrapper />

      <div className="relative bg-[#0b001a]">
        <SectionSeparator />
        <Suspense fallback={<AboutSkeleton />}>
          <AboutSection />
        </Suspense>
        <SectionSeparator />
        <Suspense fallback={<SkillsSkeleton />}>
          <SkillsSection />
        </Suspense>
        <SectionSeparator />
        <Suspense fallback={<ImpactSkeleton />}>
          <ImpactSection />
        </Suspense>
        <SectionSeparator />
        <Suspense fallback={<ProjectsSkeleton />}>
          <ProjectsPreviewSection />
        </Suspense>
        <SectionSeparator />
        <GithubContributions />
        <SectionSeparator />
        <LanguageBreakdown />
        <SectionSeparator />
        <Suspense fallback={<JourneySkeleton />}>
          <JourneyViewSection />
        </Suspense>
        <SectionSeparator />
        <Suspense fallback={<AchievementsSkeleton />}>
          <AchievementsViewSection />
        </Suspense>
        <SectionSeparator />
        <Suspense fallback={<HobbiesSkeleton />}>
          <HobbiesViewSection />
        </Suspense>
        <SectionSeparator />
        <Suspense fallback={<AboutSkeleton />}>
          <ContactViewSection />
        </Suspense>
        <FlutterFooter />
      </div>
    </div>
  );
}

function HomeHeroWrapper() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroSection />
    </Suspense>
  );
}
