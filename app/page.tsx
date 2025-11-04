import HeaderComponent from "@/components/custom/common/header";
import Hero from "@/components/custom/home/hero";
import ScrollDemo from "@/components/custom/home/scroll-demo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      <Hero/>
      <ScrollDemo/>
    </div>
  );
}
