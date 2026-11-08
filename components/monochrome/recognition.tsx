"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X, Maximize2 } from "lucide-react";
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

interface FullscreenImageModalProps {
  item: IAchievementItem;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

function FullscreenImageModal({
  item,
  images,
  initialIndex,
  onClose,
}: FullscreenImageModalProps) {
  const [index, setIndex] = useState(initialIndex);
  const currentImage = images[index] || images[0];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && hasMultiple) {
        setIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft" && hasMultiple) {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [hasMultiple, images.length, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full flex items-center justify-between text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {item.awardRank === "champion" ? (
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-amber-500 text-white font-semibold flex items-center gap-1 shadow-xs">
              <RiTrophyLine className="w-3 h-3" />
              Champion
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-zinc-800 text-zinc-200 font-medium flex items-center gap-1 border border-white/10 shadow-xs">
              <RiMedalLine className="w-3 h-3 text-zinc-300" />
              {item.awardRank === "1st-runner-up" ? "1st Runner-Up" : "2nd Runner-Up"}
            </span>
          )}
          <span className="text-xs font-mono text-zinc-300 hidden sm:inline">
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasMultiple && (
            <span className="font-mono text-xs text-zinc-400 tabular-nums">
              {index + 1} / {images.length}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xs bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
            title="Close (Esc)"
            aria-label="Close fullscreen preview"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] opacity-70">Esc</span>
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Previous/Next Controls */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple && (
          <button
            type="button"
            onClick={() =>
              setIndex((prev) => (prev - 1 + images.length) % images.length)
            }
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-2.5 rounded-full bg-zinc-950/75 hover:bg-zinc-900 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
            title="Previous image (←)"
            aria-label="Previous image"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        <div className="relative max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${item.award} — Photo ${index + 1}`}
            className="max-h-[75vh] sm:max-h-[80vh] max-w-[92vw] w-auto h-auto object-contain rounded-xs border border-zinc-800/80 shadow-2xl"
          />
        </div>

        {hasMultiple && (
          <button
            type="button"
            onClick={() => setIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-zinc-950/75 hover:bg-zinc-900 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-105 cursor-pointer shadow-lg"
            title="Next image (→)"
            aria-label="Next image"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* Bottom Information Footer */}
      <div
        className="w-full max-w-3xl mx-auto bg-zinc-950/85 border border-zinc-800 rounded-xs p-3 sm:px-4 sm:py-2.5 text-zinc-300 backdrop-blur-sm z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-0.5">
          <h4 className="text-xs sm:text-sm font-semibold text-white font-sans">
            {item.award}
          </h4>
          <p className="text-[11px] font-mono text-zinc-400">
            Project: <span className="text-zinc-200">{item.project}</span> · Team:{" "}
            <span className="text-zinc-200">{item.team}</span>
          </p>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 tabular-nums self-end sm:self-center">
          {item.date}
        </div>
      </div>
    </div>
  );
}

interface RecognitionCardProps {
  item: IAchievementItem;
  onOpenPreview: (item: IAchievementItem, images: string[], index: number) => void;
}

function RecognitionCard({ item, onOpenPreview }: RecognitionCardProps) {
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
        {/* Top Image Preview Area — clicking opens fullscreen preview modal */}
        <div
          onClick={() => onOpenPreview(item, images, currentIdx)}
          className="relative w-full h-48 sm:h-56 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden select-none cursor-pointer"
          title="Click to view fullscreen preview"
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

          {/* Expand Hint in Top-Right Corner on Hover */}
          <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-xs bg-zinc-950/70 text-white backdrop-blur-xs border border-white/20 pointer-events-none">
            <Maximize2 className="w-3.5 h-3.5" />
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
  const [modalState, setModalState] = useState<{
    item: IAchievementItem;
    images: string[];
    index: number;
  } | null>(null);

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}#recognition`);
      toast.success("Section link copied");
    }
  };

  const handleOpenPreview = (
    item: IAchievementItem,
    images: string[],
    index: number
  ) => {
    setModalState({ item, images, index });
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
          <RecognitionCard
            key={item.id}
            item={item}
            onOpenPreview={handleOpenPreview}
          />
        ))}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {modalState && (
        <FullscreenImageModal
          item={modalState.item}
          images={modalState.images}
          initialIndex={modalState.index}
          onClose={() => setModalState(null)}
        />
      )}

      <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
    </section>
  );
}
