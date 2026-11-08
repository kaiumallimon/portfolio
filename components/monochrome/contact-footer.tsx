"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ArrowUp, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { ISiteSettings } from "@/lib/models";

export function MonochromeContactFooter({ settings }: { settings: ISiteSettings }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive Signature Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasCustomSignature, setHasCustomSignature] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Initial default calligraphic signature
    drawDefaultSignature(ctx, rect.width, rect.height);
  }, []);

  const drawDefaultSignature = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = document.documentElement.classList.contains("dark")
      ? "#e4e4e7"
      : "#18181b";
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    // K
    ctx.moveTo(20, 16);
    ctx.lineTo(22, 44);
    ctx.moveTo(35, 20);
    ctx.lineTo(21, 32);
    ctx.lineTo(37, 44);
    // a i u m
    ctx.moveTo(42, 38);
    ctx.quadraticCurveTo(46, 32, 50, 38);
    ctx.quadraticCurveTo(54, 44, 58, 36);
    ctx.quadraticCurveTo(62, 32, 66, 38);
    ctx.quadraticCurveTo(70, 44, 74, 36);
    ctx.lineTo(76, 44);
    // L
    ctx.moveTo(88, 14);
    ctx.lineTo(90, 42);
    ctx.lineTo(108, 42);
    // i m o n
    ctx.moveTo(114, 36);
    ctx.lineTo(115, 42);
    ctx.moveTo(122, 36);
    ctx.quadraticCurveTo(126, 32, 130, 42);
    ctx.quadraticCurveTo(134, 32, 138, 42);
    ctx.moveTo(144, 39);
    ctx.ellipse(148, 39, 4, 3, 0, 0, Math.PI * 2);
    ctx.moveTo(156, 36);
    ctx.quadraticCurveTo(160, 32, 164, 42);
    // Underline flourish
    ctx.moveTo(16, 48);
    ctx.quadraticCurveTo(90, 52, 175, 46);
    ctx.stroke();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasCustomSignature(false);
    drawDefaultSignature(ctx, rect.width, rect.height);
    toast.success("Signature reset");
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!hasCustomSignature) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      setHasCustomSignature(true);
    }

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = document.documentElement.classList.contains("dark")
      ? "#e4e4e7"
      : "#18181b";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message.");
      }

      toast.success("Message transmitted successfully via secure SMTP (Port 465).");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Unable to transmit message at this moment. Please email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Contact & Message Dispatch Section */}
      <section id="contact" className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
              Contact &amp; Dispatch
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Direct telemetry to {settings.email || "kalimon291@gmail.com"}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ada@lovelace.io"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Message
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Brief project outline, proposal or inquiry..."
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-mono text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Transmitting via SMTP 465..." : "Send Message"}</span>
            </button>
          </form>
        </div>

        <div className="stripe-divider h-8 border-t border-zinc-200 dark:border-zinc-800 w-full" />
      </section>

      {/* Technical Colophon Footer matching chanhdai.com */}
      <footer className="w-full bg-white dark:bg-zinc-950 text-xs font-mono border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            kaiumallimon.tech
          </span>
          <span className="font-sans text-zinc-500">
            A CAD-engineered, minimal design portfolio &amp; telemetry hub.
          </span>
        </div>

        {/* 4-column Colophon Specification Grid */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800">
          <div className="flex min-w-0 flex-col gap-1 bg-white dark:bg-zinc-950 px-4 py-3">
            <dt className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              Crafted by
            </dt>
            <dd className="text-xs">
              <a
                className="underline hover:text-zinc-900 dark:hover:text-white"
                href="https://github.com/kaiumallimon"
                target="_blank"
                rel="noopener noreferrer"
              >
                @kaiumallimon
              </a>
            </dd>
          </div>

          <div className="flex min-w-0 flex-col gap-1 bg-white dark:bg-zinc-950 px-4 py-3">
            <dt className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              Location
            </dt>
            <dd className="text-xs text-zinc-700 dark:text-zinc-300">
              Dhaka, Bangladesh
            </dd>
          </div>

          <div className="flex min-w-0 flex-col gap-1 bg-white dark:bg-zinc-950 px-4 py-3">
            <dt className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              Deployed on
            </dt>
            <dd className="text-xs text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
              <span>▲</span>
              <span>Vercel</span>
            </dd>
          </div>

          <div className="flex min-w-0 flex-col gap-1 bg-white dark:bg-zinc-950 px-4 py-3">
            <dt className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              Typeface
            </dt>
            <dd className="text-xs text-zinc-700 dark:text-zinc-300">
              Geist &amp; Geist Mono
            </dd>
          </div>

          <div className="flex min-w-0 flex-col gap-1 bg-white dark:bg-zinc-950 px-4 py-3 col-span-2">
            <dt className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              Stack
            </dt>
            <dd className="text-xs text-zinc-600 dark:text-zinc-400">
              Next.js 16 · React 19 · Tailwind CSS v4 · Framer Motion
            </dd>
          </div>

          <div className="flex min-w-0 flex-col gap-1 bg-white dark:bg-zinc-950 px-4 py-3">
            <dt className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              License
            </dt>
            <dd className="text-xs text-zinc-700 dark:text-zinc-300">
              MIT License
            </dd>
          </div>

          <div className="flex min-w-0 flex-col gap-1 bg-white dark:bg-zinc-950 px-4 py-3">
            <dt className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              For agents
            </dt>
            <dd className="text-xs">
              <a
                className="underline hover:text-zinc-900 dark:hover:text-white"
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
              >
                llms.txt
              </a>
            </dd>
          </div>

          {/* Approved by Interactive Signature Canvas */}
          <div className="flex min-w-0 flex-col gap-1 bg-white dark:bg-zinc-950 px-4 py-3 col-span-2 md:col-span-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <dt className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                Approved by
              </dt>
              <button
                type="button"
                onClick={clearSignature}
                className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Sign again or reset signature"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sign again</span>
              </button>
            </div>

            <div className="relative w-full h-16 border border-dashed border-zinc-200 dark:border-zinc-800 mt-1 cursor-crosshair bg-zinc-50/50 dark:bg-zinc-900/40">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full block"
              />
              <span className="pointer-events-none absolute bottom-1 right-2 text-[9px] font-mono text-zinc-400 select-none">
                KAIUM AL LIMON
              </span>
            </div>
          </div>
        </dl>

        {/* Bottom bar with return to top */}
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Kaium Al Limon
            </span>
            <span>·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Available for hire</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
              title="Return to top"
              aria-label="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
