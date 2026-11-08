"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { RiLink, RiTrophyLine, RiMedalLine } from "@remixicon/react";
import { toast } from "sonner";
import { IAchievementItem } from "@/lib/data-service";

function getAchievementImages(item: IAchievementItem): string[] {
  if (item.images && item.images.length > 0) return item.images;
  const id = item.id.toLowerCase();
  const text = `${item.title} ${item.award} ${item.project}`.toLowerCase();
  if (id.includes("sad") || text.includes("system analysis")) {
    return ["/sad-lab.png", "/sad-lab-2.jpg"];
  }
  if (id.includes("se-") || text.includes("software engineering")) {
    return ["/software-lab.jpg", "/software-lab-2.jpg"];
  }
  if (id.includes("dbms") || text.includes("dbms") || text.includes("database")) {
    return ["/dbms-lab.png", "/dbms-lab-2.png"];
  }
  if (id.includes("aoop") || text.includes("aoop") || text.includes("object-oriented")) {
    return ["/aoop-lab.jpg", "/aoop-lab-2.jpg"];
  }
  return [];
}

interface RecognitionCardProps {
  item: IAchievementItem;
}

function RecognitionCard({ item }: RecognitionCardProps) {
  const images = getAchievementImages(item);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const hasMultipleImages = images.length > 1;

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIdx];
  const isFailed = currentImage ? Boolean(failedImages[currentImage]) : false;

  return (
    <div className="group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Image Preview Area */}
        <div
          onClick={hasMultipleImages ? () => nextImage() : undefined}
          className={`relative w-full h-48 sm:h-56 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden select-none ${
            hasMultipleImages ? "cursor-pointer" : ""
          }`}
          title={hasMultipleImages ? "Click to view next photo" : undefined}
        >
          {currentImage ? (
            !isFailed ? (
              <Image
                src={currentImage}
                alt={`${item.award} — Photo ${currentIdx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-102"
                priority={item.awardRank === "champion"}
                onError={() =>
                  setFailedImages((prev) => ({ ...prev, [currentImage]: true }))
                }
              />
            ) : (
              /* Fallback to direct static image if Next.js image optimization fails or times out */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentImage}
                alt={`${item.award} — Photo ${currentIdx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-zinc-400">
              No image available
            </div>
          )}

          {/* Rank Badge in Top-Left Corner */}
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            {item.awardRank === "champion" ? (
              <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-amber-500 text-white font-semibold backdrop-blur-xs flex items-center gap-1 shadow-xs">
                <RiTrophyLine className="w-3 h-3" />
                Champion
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-zinc-900/85 text-zinc-100 dark:bg-zinc-800/90 font-medium backdrop-blur-xs flex items-center gap-1 border border-white/10 shadow-xs">
                <RiMedalLine className="w-3 h-3 text-zinc-300" />
                {item.awardRank === "1st-runner-up" ? "1st Runner-Up" : "2nd Runner-Up"}
              </span>
            )}
          </div>

          {/* Multiple Images Arrow Controls in Bottom-Right Corner */}
          {hasMultipleImages && (
            <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 bg-zinc-950/85 hover:bg-zinc-950 text-white rounded-xs border border-white/20 backdrop-blur-xs p-1 shadow-xs transition-colors">
              <button
                type="button"
                onClick={prevImage}
                className="p-0.5 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Previous photo"
                aria-label="Previous photo"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-mono px-1 select-none tabular-nums opacity-90">
                {currentIdx + 1}/{images.length}
              </span>
              <button
                type="button"
                onClick={nextImage}
                className="p-0.5 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Next photo"
                aria-label="Next photo"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="p-4 sm:p-5 space-y-2.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs font-mono text-zinc-400 tabular-nums">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
                {item.title}
              </span>
              <span className="shrink-0">{item.date}</span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50 font-sans tracking-tight leading-snug">
              {item.award}
            </h3>
          </div>
        </div>
      </div>

      {/* Card Footer: Project and Team info */}
      <div className="px-4 py-3 sm:px-5 sm:py-3 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
        <div>
          Project: <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{item.project}</strong>
        </div>
        <div>
          Team: <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{item.team}</strong>
        </div>
      </div>
    </div>
  );
}

export function MonochromeRecognition({
  achievements,
}: {
  achievements: IAchievementItem[];
}) {
  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#recognition`);
      toast.success("Section link copied");
    }
  };

  return (
    <section
      id="recognition"
      className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800"
    >
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
            Recognition
          </h2>
          <button
            onClick={copyLink}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Copy link to Recognition"
          >
            <RiLink className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          {achievements.length} awards
        </span>
      </div>

      {/* Responsive Grid replacing the old vertical list */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((item) => (
          <RecognitionCard key={item.id} item={item} />
        ))}
      </div>

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
