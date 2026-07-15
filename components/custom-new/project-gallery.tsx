"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProjectGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (images.length === 0) return null;

  const go = (dir: number) =>
    setActive((p) => (p + dir + images.length) % images.length);

  return (
    <div className="border-y border-white/10">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${alt} screenshot ${active + 1}`}
          className="max-h-[460px] w-full object-cover"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="View fullscreen"
          className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-opacity",
                i === active
                  ? "border-indigo-500 opacity-100"
                  : "border-white/10 opacity-60 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-auto max-w-[95vw] border-0 bg-black/95 p-2 sm:max-w-[95vw]">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative flex items-center justify-center">
            {images.length > 1 && (
              <button
                type="button"
                className="absolute left-2 text-white/80 transition-colors hover:text-white"
                aria-label="Previous image"
                onClick={() => go(-1)}
              >
                <ChevronLeft className="h-9 w-9" />
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={alt}
              className="max-h-[88vh] max-w-[90vw] object-contain"
            />
            {images.length > 1 && (
              <button
                type="button"
                className="absolute right-2 text-white/80 transition-colors hover:text-white"
                aria-label="Next image"
                onClick={() => go(1)}
              >
                <ChevronRight className="h-9 w-9" />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
