"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MdEmail, MdOutlineEmail, MdOutlineMarkEmailRead } from "react-icons/md";

export default function AboutMePage() {
  const sections = [
    { value: "personal_note", label: "Personal Note" },
    { value: "soft_skills", label: "Soft Skills" },
  ];

  return (
    <div className="h-full w-full bg-white/8 backdrop-blur-sm">
      <div className="flex flex-col-reverse md:flex-row max-w-7xl mx-auto pt-20">
        {/* Left sided content */}
        <div className="md:flex-1">
          <div>
            <p className="text-lg">/*</p>
            <p className="text-lg font-bold">Hello there!</p><br/>
            <p className="text-muted-foreground">I'm Kaium Al Limon, a Computer Science & Engineering student at United International University (UIU) and a Full-Stack Cross-Platform Mobile & Web Developer. I mainly use Flutter & Next.js to build innovative, high-quality mobile and web applications. I specialize in creating seamless user experiences backed by scalable, efficient architectures. I'm passionate about technology and continuously learning to improve my skills to craft future ready solutions.</p><br/>
            <p className="text-muted-foreground">My interest in technology started when I was a kid, and it had guided me towards a career in software development. I love the challenge of solving complex problems and the satisfaction of creating innovative solutions that make a difference in people's lives. I'm improving my skills continuously to stay at the forefront of the industry and deliver cutting-edge solutions.</p><br/>
            <p className="text-muted-foreground">I'm always looking for opportunities to grow, whether it's through projects or working with others who share my passion for technology. I believe in teamwork, problem-solving and creating apps that make life easier.</p>
            <p className="text-lg">*/</p>
          </div>
        </div>
        {/* Right sided content */}
        <div className="md:flex-1 mx-auto p-6 flex flex-col space-y-4 justify-center items-center">
          <Image
            src="/IMG_7311~2.png"
            alt="Profile Picture"
            width={300}
            height={300}
            style={{ objectFit: "cover" }}
            className="border-2 border-muted-foreground hover:border-white rounded-xl transition-all duration-300"
          />

          <div className="flex flex-row w-[300px] items-center space-x-3 border-2 px-5 py-2 rounded-md hover:bg-white transition-all duration-300 cursor-pointer text-muted-foreground hover:text-black ">
            <MdOutlineEmail className="w-6 h-6" />
            <span className="ml-2 text-sm">kalimon291@gmail.com</span>
          </div>
        </div>

      </div>
    </div>

  );
}
