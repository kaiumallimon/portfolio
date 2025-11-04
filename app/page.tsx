import HeaderComponent from "@/components/custom/common/header";
import Hero from "@/components/custom/home/hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-screen bg-white">
      <Hero/>
    </div>
  );
}
