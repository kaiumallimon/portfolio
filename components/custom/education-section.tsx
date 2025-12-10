"use client";

import { MdSchool } from "react-icons/md";

const educationTimeline = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    school: "United International University (UIU)",
    duration: "2022 - Present",
    description: "Focused on software engineering, full-stack development, and cross-platform mobile apps. Participated in academic projects and hackathons.",
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    school: "Safiuddin Sarkar Academy & College",
    duration: "2018 - 2020",
    description: "GPA: 5.00",
  },
  {
    degree: "Secondary School Certificate (SSC)",
    school: "Daudpur Putina High School",
    duration: "2013 - 2018",
    description: "GPA: 5.00",
  },
];

export default function EducationTimeline() {
  return (
    <div className="w-full py-10 ">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-15 text-center text-white">
          Academic Path
        </h2>

        <div className="relative">
          {/* Vertical line */}
          {/* <div className="absolute top-0 left-5 md:left-6 h-full border-l-2 border-white/30"></div> */}

          {educationTimeline.map((edu, idx) => (
            <div key={idx} className="mb-10 flex items-start relative">
              {/* Circle marker */}
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center z-10">
                <MdSchool className="text-white w-6 h-6" />
              </div>

              {/* Text content */}
              <div className="ml-6 md:ml-8">
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {edu.degree}
                </h3>
                <p className="text-sm md:text-base text-white/70 font-medium">
                  {edu.school} • {edu.duration}
                </p>
                <p className="mt-2 text-muted-foreground">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
