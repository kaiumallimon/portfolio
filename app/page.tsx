import AchievementsSection from "@/components/custom-new/achievements";
import ContactForm from "@/components/custom-new/contact-form";
import FlutterFooter from "@/components/custom-new/footer";
import HomeAboutSection from "@/components/custom-new/home-about";
import HomeHero from "@/components/custom-new/home-hero";
import HomeProjects from "@/components/custom-new/home-selected-work";
import TechToolsSection from "@/components/custom-new/home-tech-tools";
import JourneySection from "@/components/custom-new/journey";
import SectionSeparator from "@/components/custom-new/section-separator";
import GithubContributions from "@/components/Github-Contributions";
import PortfolioImpact from "@/components/Impacts";
import LanguageBreakdown from "@/components/Language-Breakdown";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home_bg";
import TargetCursor from "@/components/TargetCursor";
import {
  getAchievements,
  getActivities,
  getEducation,
  getMetrics,
  getProjects,
  getResumeUrl,
  getSiteSettings,
  getSkills,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    settings,
    resumeUrl,
    skills,
    education,
    metrics,
    projects,
    activities,
    achievements,
  ] = await Promise.all([
    getSiteSettings(),
    getResumeUrl(),
    getSkills(),
    getEducation(),
    getMetrics(),
    getProjects(),
    getActivities(),
    getAchievements(),
  ]);

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? null;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <TargetCursor spinDuration={2.5} hideDefaultCursor parallaxOn hoverDuration={0.2} />

      <HomeBackground />
      <FloatingHeader />
      <HomeHero settings={settings} resumeUrl={resumeUrl} skills={skills} />
      
      <div className="relative">
        <HomeAboutSection education={education} settings={settings} />
        <SectionSeparator />
        <TechToolsSection skills={skills} />
        <SectionSeparator />
        <PortfolioImpact metrics={metrics} />
        <SectionSeparator />
        <HomeProjects projects={projects} />
        <SectionSeparator />
        <GithubContributions />
        <SectionSeparator />
        <LanguageBreakdown />
        <SectionSeparator />
        <JourneySection activities={activities} />
        <SectionSeparator />
        <AchievementsSection achievements={achievements} />
        <SectionSeparator />
        <ContactForm settings={settings} recaptchaSiteKey={recaptchaSiteKey} />
        <FlutterFooter />
      </div>
    </div>
  );
}
