import HeaderComponent from "@/components/custom/common/header";
import EducationSectionComponent from "@/components/custom/home/education";
import GithubContributionsGraphComponent from "@/components/custom/home/github-contributions-graph";


import Hero from "@/components/custom/home/hero";
import SkillsTree from "@/components/custom/home/skills";


export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Hero />
      <GithubContributionsGraphComponent />
      <SkillsTree />
      <EducationSectionComponent />
    </div>
  );  
}
