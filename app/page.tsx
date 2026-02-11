import HomeAboutSection from "@/components/custom-new/home-about";
import HomeHero from "@/components/custom-new/home-hero";
import TechToolsSection from "@/components/custom-new/home-tech-tools";
import FloatingHeader from "@/components/shared/header";
import HomeBackground from "@/components/shared/home_bg";

export default function Home() {
  return (
    <div className="bg-slate-950 text-slate-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">

      {/* Background gradient and top border */}
      <HomeBackground />
      <FloatingHeader />
      <HomeHero />
      <div className="relative bg-[#0b001a]">
        <HomeAboutSection />
        <TechToolsSection />
      </div>
    </div>
  );
}