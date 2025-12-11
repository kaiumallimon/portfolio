"use client";

import { MdSportsSoccer, MdVideogameAsset, MdMovie } from "react-icons/md";

const hobbiesList = [
  {
    icon: MdSportsSoccer,
    title: "European Football",
    description: "Watching European football leagues and matches regularly to follow the latest games and strategies.",
  },
  {
    icon: MdVideogameAsset,
    title: "Gaming",
    description: "Playing games like FIFA, eFootball, PUBG Mobile, and more for fun and improving focus and strategy.",
  },
  {
    icon: MdMovie,
    title: "Movies & Series",
    description: "Watching movies and series to relax and explore storytelling, cinematography, and creativity.",
  },
];

export default function HobbiesGrid() {
  return (
    <div className="w-full py-5">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-12 text-center text-white">
          Hobbies & Interests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {hobbiesList.map((hobby, idx) => {
            const Icon = hobby.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <Icon className="text-white w-6 h-6" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                  {hobby.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">{hobby.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
