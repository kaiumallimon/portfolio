"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AboutMePage() {
  const sections = [
    { value: "personal_note", label: "Personal Note" },
    { value: "soft_skills", label: "Soft Skills" },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");

  const [activeSection, setActiveSection] = useState<string>(sectionParam || "personal_note");

  useEffect(() => {
    if (sectionParam && sectionParam !== activeSection) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  const handleSectionChange = (value: string) => {
    setActiveSection(value);
    router.replace(`?section=${value}`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "personal_note":
        return (
          <>
            <h1 className="text-2xl font-bold text-white">Personal Note</h1>
            <p className="text-muted-foreground mt-2">This is your personal note section.</p>
          </>
        );

      case "soft_skills":
        return (
          <>
            <h1 className="text-2xl font-bold text-white">Soft Skills</h1>
            <p className="text-muted-foreground mt-2">Showcase your strengths, teamwork, communication, and more.</p>
          </>
        );

      default:
        return null;
    }
  };

  return (

    <div className="h-full relative flex-1 flex overflow-hidden p-0">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-none border-r backdrop-blur-sm h-full">
        <p className="px-4 py-3 text-sm font-semibold border-b  text-white shrink-0">
          About me
        </p>
        <ul className="flex-1 flex flex-col">
          {sections.map((item) => (
            <li
              key={item.value}
              onClick={() => handleSectionChange(item.value)}
              className={`cursor-pointer px-4 py-3 border-b transition-colors duration-300 flex items-center space-x-2 hover:bg-white/30 hover:text-white ${activeSection === item.value ? "bg-white text-black" : "text-muted-foreground"
                }`}
            >
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Mobile Select */}
        <div className="md:hidden p-4 border-b mb-4">
          <Select onValueChange={handleSectionChange} value={activeSection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {renderSection()}
      </div>
    </div>


  );
}