import { ArrowRight, Download, Server } from "lucide-react";
import { GiElectric } from "react-icons/gi";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SiFlutter } from "react-icons/si";
import { IoServer } from "react-icons/io5";
import { FiSmartphone } from "react-icons/fi";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
export default function HomeHero() {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          "opacity-20"
        )}
      />
      <main className="relative z-10 py-38 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          <Image
            src="/bordered.png"
            alt="profile-picture"
            width={75}
            height={75}
            className="rounded-full border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/30 hover:scale-120 transition-transform duration-500 cursor-pointer cursor-target"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Available
          </div>

          <h1 className={`text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] ${inter.className}`}>
            Crafting <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-300">
              seamless, user‑focused experiences
            </span> across <span className="inline-block bg-[#4c00a8] px-3  -skew-x-6">
  platforms
</span>

          </h1>


          <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
            Flutter Specialist & Full-Stack Engineer crafting high-performance mobile apps and scalable backends with Flutter, FastAPI, Node.js + Express, and Next.js.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#projects" className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group cursor-target">
              Download CV
              <Download size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a href="#contact" className="px-8 py-2 border backdrop-blur-md hover:bg-white/5 text-white rounded-full font-medium transition-all flex items-center justify-center gap-2 cursor-target">
              Let's Talk
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          {/* <!-- Stats/Stack Preview --> */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 opacity-60 ">
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
              <SiFlutter size={24} className="text-blue-400 " />
              <span className="text-xs md:text-sm font-medium">Flutter Expert</span>
            </div>
            <div className="flex   items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500" >
              <IoServer size={24} className="text-green-400" />
              <span className="text-xs md:text-sm font-medium">Backend Arch</span>
            </div>
            <div className="flex  items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
              <FiSmartphone size={24} className="text-pink-400" />
              <span className="text-xs md:text-sm font-medium">iOS & Android</span>
            </div>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500">
              <GiElectric size={24} className="text-yellow-400" />
              <span className="text-xs md:text-sm font-medium">High Perf</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}